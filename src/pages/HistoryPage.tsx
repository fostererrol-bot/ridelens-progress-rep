import { useAllSnapshots } from "@/hooks/useSnapshots";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Eye, ArrowUp, ArrowDown, ArrowUpDown, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MetadataSourceBadge } from "@/components/MetadataSourceBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { FullSnapshot } from "@/types/zwift";

type SortField = "captured" | "uploaded" | "confidence" | "level" | "ftp";
type SortDir = "asc" | "desc";

export default function HistoryPage() {
  const { data, isLoading } = useAllSnapshots();
  const queryClient = useQueryClient();
  const [detailSnap, setDetailSnap] = useState<FullSnapshot | null>(null);
  const [sortField, setSortField] = useState<SortField>("uploaded");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterSource, setFilterSource] = useState<string>("all");
  const [filterStamp, setFilterStamp] = useState<string>("all");
  const [searchFile, setSearchFile] = useState("");

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 ml-1 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="w-3 h-3 ml-1" /> : <ArrowDown className="w-3 h-3 ml-1" />;
  };

  const getFileName = (url: string | null) => {
    const raw = url || "";
    const p = raw.split("/").pop() || "";
    return p.includes("-") ? p.substring(p.indexOf("-") + 1) : p;
  };

  const filteredAndSorted = useMemo(() => {
    if (!data) return [];
    let items = [...data];

    // Filter by source
    if (filterSource !== "all") {
      items = items.filter((i) => i.snapshot.source === filterSource);
    }
    // Filter by stamp
    if (filterStamp !== "all") {
      items = items.filter((i) => {
        const src = (i.snapshot.metadata_json as any)?.metadata_source || "unknown";
        return src === filterStamp;
      });
    }
    // Filter by filename search
    if (searchFile.trim()) {
      const q = searchFile.toLowerCase();
      items = items.filter((i) => getFileName(i.snapshot.image_url).toLowerCase().includes(q));
    }

    // Sort
    items.sort((a, b) => {
      let av: number, bv: number;
      switch (sortField) {
        case "captured":
          av = a.snapshot.captured_at ? new Date(a.snapshot.captured_at).getTime() : 0;
          bv = b.snapshot.captured_at ? new Date(b.snapshot.captured_at).getTime() : 0;
          break;
        case "uploaded":
          av = new Date(a.snapshot.created_at).getTime();
          bv = new Date(b.snapshot.created_at).getTime();
          break;
        case "confidence":
          av = Number(a.snapshot.overall_confidence) || 0;
          bv = Number(b.snapshot.overall_confidence) || 0;
          break;
        case "level":
          av = a.progress?.level ?? 0;
          bv = b.progress?.level ?? 0;
          break;
        case "ftp":
          av = a.performance?.ftp_w ?? 0;
          bv = b.performance?.ftp_w ?? 0;
          break;
        default:
          av = 0; bv = 0;
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });

    return items;
  }, [data, sortField, sortDir, filterSource, filterStamp, searchFile]);

  const sources = useMemo(() => {
    if (!data) return [];
    return [...new Set(data.map((d) => d.snapshot.source))];
  }, [data]);

  const hasActiveFilters = filterSource !== "all" || filterStamp !== "all" || searchFile.trim() !== "";

  const clearFilters = () => {
    setFilterSource("all");
    setFilterStamp("all");
    setSearchFile("");
  };

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
        <>
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
              placeholder="Search filename…"
              value={searchFile}
              onChange={(e) => setSearchFile(e.target.value)}
              className="w-48 h-9 text-sm"
            />
            <Select value={filterSource} onValueChange={setFilterSource}>
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sources</SelectItem>
                {sources.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStamp} onValueChange={setFilterStamp}>
              <SelectTrigger className="w-36 h-9 text-sm">
                <SelectValue placeholder="Stamp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stamps</SelectItem>
                <SelectItem value="exif">EXIF</SelectItem>
                <SelectItem value="file">File</SelectItem>
                <SelectItem value="unknown">Unknown</SelectItem>
              </SelectContent>
            </Select>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-9 text-xs gap-1">
                <X className="w-3 h-3" /> Clear
              </Button>
            )}
            <span className="text-xs text-muted-foreground ml-auto">
              {filteredAndSorted.length} of {data.length} records
            </span>
          </div>

          <div className="rounded-xl border border-border overflow-hidden overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-secondary/50">
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("captured")}>
                    <span className="inline-flex items-center">Captured<SortIcon field="captured" /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("uploaded")}>
                    <span className="inline-flex items-center">Uploaded<SortIcon field="uploaded" /></span>
                  </TableHead>
                  <TableHead>Stamp</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("confidence")}>
                    <span className="inline-flex items-center">Confidence<SortIcon field="confidence" /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("level")}>
                    <span className="inline-flex items-center">Level<SortIcon field="level" /></span>
                  </TableHead>
                  <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("ftp")}>
                    <span className="inline-flex items-center">FTP<SortIcon field="ftp" /></span>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSorted.map((item, idx) => {
                  const fileName = getFileName(item.snapshot.image_url);
                  const capturedAt = item.snapshot.captured_at;
                  const createdAt = item.snapshot.created_at;
                  const metaJson = item.snapshot.metadata_json as any;
                  const metaSource: "exif" | "file" | "unknown" = metaJson?.metadata_source || "unknown";

                  return (
                  <TableRow key={item.snapshot.id} className="hover:bg-secondary/30 cursor-pointer" onClick={() => setDetailSnap(item)}>
                    <TableCell className="font-mono text-xs text-muted-foreground">{filteredAndSorted.length - idx}</TableCell>
                    <TableCell className="text-sm max-w-[160px] truncate" title={fileName}>
                      {fileName || "—"}
                    </TableCell>
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {capturedAt ? format(new Date(capturedAt), "dd MMM yyyy, HH:mm") : "—"}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {format(new Date(createdAt), "dd MMM yyyy, HH:mm")}
                    </TableCell>
                    <TableCell>
                      <MetadataSourceBadge source={metaSource} />
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="text-xs">{item.snapshot.source}</Badge></TableCell>
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}

      <Dialog open={!!detailSnap} onOpenChange={() => setDetailSnap(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card border-border">
          <DialogHeader>
            <DialogTitle>Snapshot Detail</DialogTitle>
          </DialogHeader>
          {detailSnap && (
            <div className="space-y-4">
              {/* Timestamp details */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Captured</span>
                  <p className="font-mono text-sm mt-0.5">
                    {detailSnap.snapshot.captured_at
                      ? format(new Date(detailSnap.snapshot.captured_at), "dd MMM yyyy, HH:mm:ss")
                      : "—"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Uploaded</span>
                  <p className="font-mono text-sm mt-0.5">
                    {format(new Date(detailSnap.snapshot.created_at), "dd MMM yyyy, HH:mm:ss")}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Timestamp Source</span>
                  <div className="mt-1">
                    <MetadataSourceBadge source={(detailSnap.snapshot.metadata_json as any)?.metadata_source || "unknown"} />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">File</span>
                  <p className="text-sm mt-0.5 truncate">
                    {(() => {
                      const u = detailSnap.snapshot.image_url || "";
                      const p = u.split("/").pop() || "";
                      return p.includes("-") ? p.substring(p.indexOf("-") + 1) : p || "—";
                    })()}
                  </p>
                </div>
              </div>

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
