import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useAllSnapshots } from "@/hooks/useSnapshots";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRef } from "react";

export default function SettingsPage() {
  const { data } = useAllSnapshots();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const exportJson = () => {
    if (!data?.length) return toast.info("No data to export.");
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zwift-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (!data?.length) return toast.info("No data to export.");
    const headers = ["date", "level", "ftp_w", "racing_score", "training_score", "freshness", "total_distance_km", "streak_weeks"];
    const rows = data.map((d) => [
      d.snapshot.created_at,
      d.progress?.level ?? "",
      d.performance?.ftp_w ?? "",
      d.performance?.racing_score ?? "",
      d.training?.training_score ?? "",
      d.training?.freshness_state ?? "",
      d.fitness?.total_distance_km ?? "",
      d.fitness?.streak_weeks ?? "",
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zwift-progress-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const imported = JSON.parse(text);
      if (!Array.isArray(imported)) throw new Error("Expected array");

      let count = 0;
      for (const item of imported) {
        const snap = item.snapshot;
        if (!snap) continue;

        const { data: inserted, error } = await supabase
          .from("snapshots")
          .insert({
            source: "import",
            screen_type: snap.screen_type || "progress_report",
            image_url: snap.image_url,
            image_hash: snap.image_hash,
            raw_extraction_json: snap.raw_extraction_json,
            parsed_data_json: snap.parsed_data_json,
            overall_confidence: snap.overall_confidence || 0,
          })
          .select()
          .single();

        if (error || !inserted) continue;

        if (item.progress) await supabase.from("progress_report_metrics").insert({ ...item.progress, id: undefined, snapshot_id: inserted.id });
        if (item.performance) await supabase.from("performance_metrics").insert({ ...item.performance, id: undefined, snapshot_id: inserted.id });
        if (item.fitness) await supabase.from("fitness_trends").insert({ ...item.fitness, id: undefined, snapshot_id: inserted.id });
        if (item.training) await supabase.from("training_status").insert({ ...item.training, id: undefined, snapshot_id: inserted.id });
        count++;
      }

      toast.success(`Imported ${count} snapshots`);
      queryClient.invalidateQueries({ queryKey: ["snapshots"] });
    } catch (err: any) {
      toast.error("Import failed: " + err.message);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-6 max-w-lg">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Export Data</h3>
          <div className="flex gap-3">
            <Button onClick={exportJson} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button onClick={exportCsv} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Import Data</h3>
          <input ref={fileRef} type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          <Button onClick={() => fileRef.current?.click()} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import JSON
          </Button>
          <p className="text-xs text-muted-foreground mt-2">Import a previously exported JSON file.</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Units</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-muted-foreground">Power:</span> <span className="font-mono">W (watts)</span></div>
            <div><span className="text-muted-foreground">Distance:</span> <span className="font-mono">km</span></div>
            <div><span className="text-muted-foreground">Elevation:</span> <span className="font-mono">m</span></div>
            <div><span className="text-muted-foreground">Energy:</span> <span className="font-mono">kJ</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
