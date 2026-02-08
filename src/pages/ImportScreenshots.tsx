import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, AlertTriangle, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ExtractionResult, ImageMetadata } from "@/types/zwift";
import { extractImageMetadata } from "@/hooks/useImageMetadata";
import { MetadataSourceBadge } from "@/components/MetadataSourceBadge";
import CryptoJS from "crypto-js";

type Step = "upload" | "processing" | "review" | "done";

const defaultMetadata: ImageMetadata = {
  captured_at: null,
  timezone_offset_minutes: null,
  metadata_source: "unknown",
};

const defaultExtraction: ExtractionResult = {
  screen_type: "progress_report",
  level: 0,
  career_progress: {
    this_ride_xp: 0, xp_current: 0, xp_target: 0,
    achievements_current: 0, achievements_target: 0,
    route_badges_current: 0, route_badges_target: 0,
    challenge_name: "", challenge_stage_current: 0, challenge_stage_target: 0,
    challenge_this_ride_km: 0, challenge_progress_km: 0, challenge_target_km: 0,
  },
  performance: { best_5s_w: 0, best_1m_w: 0, best_5m_w: 0, best_20m_w: 0, ftp_w: 0, racing_score: 0 },
  fitness_trends: {
    weekly_this_ride_km: 0, weekly_progress_km: 0, weekly_goal_km: 0,
    streak_weeks: 0, total_distance_km: 0, total_elevation_m: 0, total_energy_kj: 0,
  },
  training_status: { training_score: 0, training_score_delta: 0, freshness_state: "" },
  image_metadata: defaultMetadata,
  confidence: { overall: 0 },
};

export default function ImportScreenshots() {
  const [step, setStep] = useState<Step>("upload");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imageHash, setImageHash] = useState<string>("");
  const [extraction, setExtraction] = useState<ExtractionResult>(defaultExtraction);
  const [rawJson, setRawJson] = useState<any>(null);
  const [metadata, setMetadata] = useState<ImageMetadata>(defaultMetadata);
  const [saving, setSaving] = useState(false);
  const queryClient = useQueryClient();

  const onDrop = useCallback(async (accepted: File[]) => {
    const f = accepted[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));

    // Extract metadata first
    const meta = await extractImageMetadata(f);
    setMetadata(meta);

    // Compute hash
    const arrayBuf = await f.arrayBuffer();
    const wordArray = CryptoJS.lib.WordArray.create(arrayBuf);
    const hash = CryptoJS.SHA256(wordArray).toString();
    setImageHash(hash);

    // Check duplicate
    const { data: existing } = await supabase
      .from("snapshots")
      .select("id")
      .eq("image_hash", hash)
      .maybeSingle();

    if (existing) {
      toast.warning("This screenshot has already been imported.");
      return;
    }

    // Upload to storage
    setStep("processing");
    const filePath = `uploads/${hash}-${f.name}`;
    const { error: uploadErr } = await supabase.storage.from("screenshots").upload(filePath, f, { upsert: true });
    if (uploadErr) {
      toast.error("Upload failed: " + uploadErr.message);
      setStep("upload");
      return;
    }
    const { data: urlData } = supabase.storage.from("screenshots").getPublicUrl(filePath);
    setImageUrl(urlData.publicUrl);

    // Call extraction edge function
    try {
      const { data: extractionData, error: fnErr } = await supabase.functions.invoke("extract-zwift", {
        body: { imageUrl: urlData.publicUrl },
      });

      if (fnErr) throw fnErr;

      const parsed = extractionData?.parsed || defaultExtraction;
      // Merge metadata from EXIF into the extraction result
      parsed.image_metadata = meta;
      setRawJson(extractionData?.raw || null);
      setExtraction(parsed);
      setStep("review");
    } catch (err: any) {
      toast.error("Extraction failed. Please fill in values manually.");
      setExtraction({ ...defaultExtraction, image_metadata: meta });
      setStep("review");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
    maxFiles: 1,
  });

  const updateField = (section: string, field: string, value: any) => {
    setExtraction((prev) => {
      if (section === "root") return { ...prev, [field]: value };
      return { ...prev, [section]: { ...(prev as any)[section], [field]: value } };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Determine captured_at: prefer EXIF, then file time, then now()
      const capturedAt = metadata.captured_at || new Date().toISOString();

      const { data: snap, error: snapErr } = await supabase
        .from("snapshots")
        .insert({
          source: "upload" as string,
          screen_type: extraction.screen_type,
          image_url: imageUrl,
          image_hash: imageHash,
          raw_extraction_json: rawJson as any,
          parsed_data_json: extraction as any,
          overall_confidence: extraction.confidence.overall,
          captured_at: capturedAt,
          timezone_offset_minutes: metadata.timezone_offset_minutes,
          metadata_json: metadata as any,
        })
        .select()
        .single();

      if (snapErr) throw snapErr;

      const cp = extraction.career_progress;
      const perf = extraction.performance;
      const fit = extraction.fitness_trends;
      const ts = extraction.training_status;

      await Promise.all([
        supabase.from("progress_report_metrics").insert({
          snapshot_id: snap.id,
          level: extraction.level,
          this_ride_xp: cp.this_ride_xp, xp_current: cp.xp_current, xp_target: cp.xp_target,
          achievements_current: cp.achievements_current, achievements_target: cp.achievements_target,
          route_badges_current: cp.route_badges_current, route_badges_target: cp.route_badges_target,
          challenge_name: cp.challenge_name,
          challenge_stage_current: cp.challenge_stage_current, challenge_stage_target: cp.challenge_stage_target,
          challenge_this_ride_km: cp.challenge_this_ride_km,
          challenge_progress_km: cp.challenge_progress_km, challenge_target_km: cp.challenge_target_km,
        }),
        supabase.from("performance_metrics").insert({
          snapshot_id: snap.id, ...perf,
        }),
        supabase.from("fitness_trends").insert({
          snapshot_id: snap.id, ...fit,
        }),
        supabase.from("training_status").insert({
          snapshot_id: snap.id, ...ts,
        }),
      ]);

      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
      toast.success("Snapshot saved successfully!");
      setStep("done");
    } catch (err: any) {
      toast.error("Save failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const renderField = (section: string, field: string, label: string, type: "number" | "text" = "number") => (
    <div key={field}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={(section === "root" ? (extraction as any)[field] : (extraction as any)[section]?.[field]) ?? ""}
        onChange={(e) => updateField(section, field, type === "number" ? Number(e.target.value) : e.target.value)}
        className="mt-1 bg-secondary border-border font-mono text-sm"
      />
    </div>
  );

  const capturedLabel = metadata.captured_at
    ? new Date(metadata.captured_at).toLocaleString()
    : "Not available";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Import Screenshots</h1>

      {step === "upload" && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">Drop your Zwift screenshot here</p>
          <p className="text-sm text-muted-foreground mt-2">or click to browse — PNG, JPG, WebP</p>
        </div>
      )}

      {step === "processing" && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-lg font-medium">Extracting data from screenshot...</p>
          <p className="text-sm text-muted-foreground mt-1">AI is analyzing your Zwift progress report</p>
        </div>
      )}

      {step === "review" && (
        <div>
          {/* Metadata info bar */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border mb-4">
            <span className="text-xs text-muted-foreground">Captured:</span>
            <span className="text-sm font-mono text-foreground">{capturedLabel}</span>
            <MetadataSourceBadge source={metadata.metadata_source} />
          </div>

          {extraction.confidence.overall < 0.85 && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-warning/10 border border-warning/30 mb-6">
              <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-warning">Low confidence extraction</p>
                <p className="text-xs text-muted-foreground">
                  Confidence: {(extraction.confidence.overall * 100).toFixed(0)}% — please review all fields before saving.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-6">
            {preview && (
              <div className="flex-shrink-0">
                <img src={preview} alt="Screenshot" className="w-48 rounded-lg border border-border" />
              </div>
            )}

            <div className="flex-1">
              <Tabs defaultValue="career">
                <TabsList className="bg-secondary mb-4">
                  <TabsTrigger value="career">Career</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="fitness">Fitness</TabsTrigger>
                  <TabsTrigger value="training">Training</TabsTrigger>
                </TabsList>

                <TabsContent value="career" className="space-y-3">
                  {renderField("root", "level", "Level")}
                  <div className="grid grid-cols-3 gap-3">
                    {renderField("career_progress", "this_ride_xp", "This Ride XP")}
                    {renderField("career_progress", "xp_current", "XP Current")}
                    {renderField("career_progress", "xp_target", "XP Target")}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {renderField("career_progress", "achievements_current", "Achievements")}
                    {renderField("career_progress", "achievements_target", "Achievements Target")}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {renderField("career_progress", "route_badges_current", "Route Badges")}
                    {renderField("career_progress", "route_badges_target", "Route Badges Target")}
                  </div>
                  {renderField("career_progress", "challenge_name", "Challenge Name", "text")}
                  <div className="grid grid-cols-3 gap-3">
                    {renderField("career_progress", "challenge_stage_current", "Stage Current")}
                    {renderField("career_progress", "challenge_stage_target", "Stage Target")}
                    {renderField("career_progress", "challenge_target_km", "Target km")}
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    {renderField("performance", "best_5s_w", "5s Power (W)")}
                    {renderField("performance", "best_1m_w", "1m Power (W)")}
                    {renderField("performance", "best_5m_w", "5m Power (W)")}
                    {renderField("performance", "best_20m_w", "20m Power (W)")}
                    {renderField("performance", "ftp_w", "FTP (W)")}
                    {renderField("performance", "racing_score", "Racing Score")}
                  </div>
                </TabsContent>

                <TabsContent value="fitness" className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {renderField("fitness_trends", "weekly_this_ride_km", "This Ride km")}
                    {renderField("fitness_trends", "weekly_progress_km", "Weekly Progress km")}
                    {renderField("fitness_trends", "weekly_goal_km", "Weekly Goal km")}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {renderField("fitness_trends", "streak_weeks", "Streak (weeks)")}
                    {renderField("fitness_trends", "total_distance_km", "Total Distance km")}
                    {renderField("fitness_trends", "total_elevation_m", "Total Elevation m")}
                    {renderField("fitness_trends", "total_energy_kj", "Total Energy kJ")}
                  </div>
                </TabsContent>

                <TabsContent value="training" className="space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    {renderField("training_status", "training_score", "Training Score")}
                    {renderField("training_status", "training_score_delta", "Delta")}
                    {renderField("training_status", "freshness_state", "Freshness State", "text")}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex gap-3 mt-6">
                <Button onClick={handleSave} disabled={saving} className="bg-primary text-primary-foreground hover:bg-primary/90">
                  {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                  Save Snapshot
                </Button>
                <Button variant="outline" onClick={() => { setStep("upload"); setFile(null); setPreview(""); }}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {step === "done" && (
        <div className="text-center py-20">
          <Check className="w-16 h-16 mx-auto text-success mb-4" />
          <h2 className="text-xl font-semibold mb-2">Snapshot Saved!</h2>
          <p className="text-muted-foreground mb-6">Your Zwift progress has been recorded.</p>
          <Button onClick={() => { setStep("upload"); setFile(null); setPreview(""); }}>
            Import Another
          </Button>
        </div>
      )}
    </div>
  );
}
