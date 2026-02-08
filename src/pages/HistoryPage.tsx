import { useAllSnapshots } from "@/hooks/useSnapshots";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { FullSnapshot } from "@/types/zwift";

export default function HistoryPage() {
  const { data, isLoading } = useAllSnapshots();
  const queryClient = useQueryClient();
  const [detailSnap, setDetailSnap] = useState<FullSnapshot | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this snapshot?")) return;
    const { error } = await supabase.from("snapshots").delete().eq("id", id);
    if (error) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    queryClient.invalidateQueries({ queryKey: ["snapshots"] });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">History</h1>

      {!data?.length ? (
        <p className="text-muted-foreground">No snapshots yet.</p>
      ) : (
        <div className="rounded-xl border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-secondary/50">
                <TableHead>Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>FTP</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.snapshot.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => setDetailSnap(item)}>
                  <TableCell className="font-mono text-sm">{format(new Date(item.snapshot.created_at), "PP p")}</TableCell>
                  <TableCell><Badge variant="secondary" className="text-xs">{item.snapshot.source}</Badge></TableCell>
                  <TableCell className="text-sm">{item.snapshot.screen_type}</TableCell>
                  <TableCell>
                    <span className={`font-mono text-sm ${Number(item.snapshot.overall_confidence) >= 0.85 ? "delta-up" : "text-warning"}`}>
                      {(Number(item.snapshot.overall_confidence) * 100).toFixed(0)}%
                    </span>
                  </TableCell>
                  <TableCell className="font-mono">{item.progress?.level ?? "—"}</TableCell>
                  <TableCell className="font-mono">{item.performance?.ftp_w ? `${item.performance.ftp_w}W` : "—"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" onClick={() => setDetailSnap(item)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item.snapshot.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!detailSnap} onOpenChange={() => setDetailSnap(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>Snapshot Detail</DialogTitle>
          </DialogHeader>
          {detailSnap && (
            <div className="space-y-4">
              {detailSnap.snapshot.image_url && (
                <img src={detailSnap.snapshot.image_url} alt="Screenshot" className="w-full rounded-lg border border-border" />
              )}
              <pre className="text-xs font-mono bg-secondary p-4 rounded-lg overflow-auto max-h-60">
                {JSON.stringify(detailSnap.snapshot.parsed_data_json, null, 2)}
              </pre>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
