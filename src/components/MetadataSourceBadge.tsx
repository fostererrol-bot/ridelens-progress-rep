interface MetadataSourceBadgeProps {
  source: "exif" | "file" | "unknown";
}

export function MetadataSourceBadge({ source }: MetadataSourceBadgeProps) {
  const config = {
    exif: { label: "EXIF", className: "bg-primary/15 text-primary" },
    file: { label: "FILE TIME", className: "bg-secondary text-muted-foreground" },
    unknown: { label: "UNKNOWN", className: "bg-secondary text-muted-foreground" },
  };

  const { label, className } = config[source];

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${className}`}>
      {label}
    </span>
  );
}
