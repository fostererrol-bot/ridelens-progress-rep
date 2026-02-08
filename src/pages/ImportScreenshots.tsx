import { useState, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, Check, Loader2, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { extractImageMetadata } from "@/hooks/useImageMetadata";
import { BulkImportCard } from "@/components/BulkImportCard";
import type { BulkImportItem } from "@/types/bulk-import";
import { defaultMetadata, defaultExtraction } from "@/types/bulk-import";
import CryptoJS from "crypto-js";

export default function ImportScreenshots() {
  const [items, setItems] = useState<BulkImportItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const processingRef = useRef(false);

  const updateItem = useCallback((id: string, updates: Partial<BulkImportItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  }, []);

  const processFile = useCallback(async (item: BulkImportItem) => {
    // 1. Extract metadata
    const meta = await extractImageMetadata(item.file);
    updateItem(item.id, { metadata: meta, status: "hashing" });

    // 2. Compute hash
    const arrayBuf = await item.file.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuf);
    const hash = CryptoJS.SHA256(wordArray).toString();
    updateItem(item.id, { imageHash: hash });

    // 3. Check duplicate
    const { data: existing } = await supabase
      .from("snapshots")
      .select("id")
      .eq("image_hash", hash)
      .maybeSingle();

    if (existing) {
      updateItem(item.id, { status: "duplicate" });
      return;
    }

    // 4. Upload to storage
    updateItem(item.id, { status: "uploading" });
    const filePath = `uploads/${hash}-${item.file.name}`;
    const { error: uploadErr } = await supabase.storage
      .from("screenshots")
      .upload(filePath, item.file, { upsert: true });
    if (uploadErr) {
      updateItem(item.id, { status: "error", error: `Upload failed: ${uploadErr.message}` });
      return;
    }
    const { data: urlData } = supabase.storage.from("screenshots").getPublicUrl(filePath);
    updateItem(item.id, { imageUrl: urlData.publicUrl });

    // 5. AI extraction
    updateItem(item.id, { status: "extracting" });
    try {
      const { data: extractionData, error: fnErr } = await supabase.functions.invoke("extract-zwift", {
        body: { imageUrl: urlData.publicUrl },
      });
      if (fnErr) throw fnErr;

      const parsed = extractionData?.parsed || defaultExtraction;
      parsed.image_metadata = meta;
      updateItem(item.id, {
        status: "ready",
        extraction: parsed,
        rawJson: extractionData?.raw || null,
        imageHash: hash,
      });
    } catch (err: any) {
      updateItem(item.id, {
        status: "ready",
        extraction: { ...defaultExtraction, image_metadata: meta },
        error: "Extraction failed — review manually",
        imageHash: hash,
      });
    }
  }, [updateItem]);

  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0) return;

      const newItems: BulkImportItem[] = accepted.map((f) => ({
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        file: f,
        preview: URL.createObjectURL(f),
        status: "pending" as const,
        metadata: defaultMetadata,
        extraction: defaultExtraction,
      }));

      setItems((prev) => [...prev, ...newItems]);

      // Process files sequentially to avoid rate limiting
      if (processingRef.current) return; // already processing a batch
      processingRef.current = true;
      setIsProcessing(true);

      // Get all pending items (including just-added ones)
      const allPending = [...newItems];
      for (const item of allPending) {
        try {
          await processFile(item);
        } catch (err: any) {
          updateItem(item.id, { status: "error", error: err.message || "Unexpected error" });
        }
      }

      processingRef.current = false;
      setIsProcessing(false);
    },
    [processFile, updateItem]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 20,
    multiple: true,
  });

  const onUpdateField = useCallback(
    (id: string, section: string, field: string, value: any) => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.id !== id) return item;
          const ext = { ...item.extraction };
          if (section === "root") {
            (ext as any)[field] = value;
          } else {
            (ext as any)[section] = { ...(ext as any)[section], [field]: value };
          }
          return { ...item, extraction: ext };
        })
      );
    },
    []
  );

  const onRemove = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const readyItems = items.filter((i) => i.status === "ready");
  const savedItems = items.filter((i) => i.status === "saved");
  const allDone = items.length > 0 && items.every((i) => i.status === "saved" || i.status === "duplicate" || i.status === "error");

  const handleSaveAll = async () => {
    if (readyItems.length === 0) return;
    setIsSaving(true);

    for (const item of readyItems) {
      updateItem(item.id, { status: "saving" });
      try {
        const capturedAt = item.metadata.captured_at || new Date().toISOString();

        const { data: snap, error: snapErr } = await supabase
          .from("snapshots")
          .insert({
            source: "upload" as string,
            screen_type: item.extraction.screen_type,
            image_url: item.imageUrl,
            image_hash: item.imageHash,
            raw_extraction_json: item.rawJson as any,
            parsed_data_json: item.extraction as any,
            overall_confidence: item.extraction.confidence.overall,
            captured_at: capturedAt,
            timezone_offset_minutes: item.metadata.timezone_offset_minutes,
            metadata_json: item.metadata as any,
          })
          .select()
          .single();

        if (snapErr) throw snapErr;

        const cp = item.extraction.career_progress;
        const perf = item.extraction.performance;
        const fit = item.extraction.fitness_trends;
        const ts = item.extraction.training_status;

        await Promise.all([
          supabase.from("progress_report_metrics").insert({
            snapshot_id: snap.id,
            level: item.extraction.level,
            this_ride_xp: cp.this_ride_xp, xp_current: cp.xp_current, xp_target: cp.xp_target,
            achievements_current: cp.achievements_current, achievements_target: cp.achievements_target,
            route_badges_current: cp.route_badges_current, route_badges_target: cp.route_badges_target,
            challenge_name: cp.challenge_name,
            challenge_stage_current: cp.challenge_stage_current, challenge_stage_target: cp.challenge_stage_target,
            challenge_this_ride_km: cp.challenge_this_ride_km,
            challenge_progress_km: cp.challenge_progress_km, challenge_target_km: cp.challenge_target_km,
          }),
          supabase.from("performance_metrics").insert({ snapshot_id: snap.id, ...perf }),
          supabase.from("fitness_trends").insert({ snapshot_id: snap.id, ...fit }),
          supabase.from("training_status").insert({ snapshot_id: snap.id, ...ts }),
        ]);

        updateItem(item.id, { status: "saved" });
      } catch (err: any) {
        updateItem(item.id, { status: "error", error: `Save failed: ${err.message}` });
      }
    }

    queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    setIsSaving(false);
    toast.success(`${readyItems.length} snapshot(s) saved!`);
  };

  const handleClearAll = () => {
    items.forEach((item) => URL.revokeObjectURL(item.preview));
    setItems([]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Import Screenshots</h1>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleClearAll} className="text-xs">
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear All
          </Button>
        )}
      </div>

      {/* Drop zone — always visible when not all done */}
      {!allDone && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors mb-6 ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-base font-medium">Drop Zwift screenshots here</p>
          <p className="text-sm text-muted-foreground mt-1">
            Multiple files supported — PNG, JPG, WebP (up to 20)
          </p>
        </div>
      )}

      {/* Queue */}
      {items.length > 0 && (
        <div className="space-y-3">
          {/* Summary bar */}
          <div className="flex items-center justify-between px-1">
            <p className="text-xs text-muted-foreground">
              {items.length} file{items.length !== 1 ? "s" : ""} •{" "}
              {readyItems.length} ready •{" "}
              {savedItems.length} saved •{" "}
              {items.filter((i) => i.status === "duplicate").length} duplicates
            </p>
            {readyItems.length > 0 && (
              <Button
                onClick={handleSaveAll}
                disabled={isSaving || isProcessing}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                ) : (
                  <Save className="w-4 h-4 mr-1.5" />
                )}
                Save All ({readyItems.length})
              </Button>
            )}
          </div>

          {items.map((item) => (
            <BulkImportCard
              key={item.id}
              item={item}
              onUpdateField={onUpdateField}
              onRemove={onRemove}
            />
          ))}
        </div>
      )}

      {/* All done */}
      {allDone && savedItems.length > 0 && (
        <div className="text-center py-12">
          <Check className="w-16 h-16 mx-auto text-success mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {savedItems.length} Snapshot{savedItems.length !== 1 ? "s" : ""} Saved!
          </h2>
          <p className="text-muted-foreground mb-6">Your Zwift progress has been recorded.</p>
          <Button onClick={handleClearAll}>Import More</Button>
        </div>
      )}
    </div>
  );
}
