export function FreshnessBadge({ state }: { state: string }) {
  const s = state.toUpperCase();
  const cls = s === "FRESH" ? "badge-fresh" : s === "TIRED" ? "badge-tired" : "badge-stale";
  return <span className={cls}>{s || "UNKNOWN"}</span>;
}
