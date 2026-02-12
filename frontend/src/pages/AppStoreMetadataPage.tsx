import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy } from "lucide-react";
import { toast } from "@/hooks/use-toast";

function CopyButton({ text }: { text: string }) {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied to clipboard" });
      }}
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
    >
      <Copy className="w-3 h-3" />
    </button>
  );
}

function MetadataBlock({ label, value, maxLength }: { label: string; value: string; maxLength?: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          {maxLength && (
            <span className={`text-[10px] ${value.length > maxLength ? "text-destructive" : "text-muted-foreground"}`}>
              {value.length}/{maxLength}
            </span>
          )}
          <CopyButton text={value} />
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed select-all rounded-lg border border-border bg-secondary/40 p-3">
        {value}
      </p>
    </div>
  );
}

const appName = "RideLens — Ride Data Insight";
const subtitle = "Turn ride screenshots into trends";

const shortDescription = "Upload your ride screenshots and turn them into structured data, trends, and between-report comparisons.";

const fullDescription = `RideLens transforms your own ride screenshots into structured data and meaningful trends, helping you see progress clearly over time rather than isolated numbers.

How it works:
1. Upload your ride screenshots directly into the app
2. Key metrics are extracted and stored in a clean, consistent format
3. Track trends and compare reports to understand what's improving

Key features:
• Between-report comparisons — see what changed since the last snapshot, not just cumulative totals
• User-controlled data — all data is uploaded by you, nothing is pulled from external systems
• Calm, readable dashboards — built to be understandable at a glance
• Career progress, performance metrics, and training status tracking
• Progressive Web App — install directly from your browser, no app store needed

RideLens is an independent project by ESF Designs Vision, built with an engineering mindset and shared openly as part of a learning-in-public journey. Not affiliated with or endorsed by Zwift. User-provided data only.`;

const keywords = [
  "cycling tracker",
  "ride data",
  "fitness trends",
  "cycling progress",
  "workout tracker",
  "cycling metrics",
  "FTP tracker",
  "training status",
  "ride screenshots",
  "cycling dashboard",
];

const categories = {
  primary: "Health & Fitness",
  secondary: "Sports",
};

const screenshotCaptions = [
  "Dashboard with career progress, performance, and training status",
  "Between-report comparisons showing what changed",
  "Trend charts tracking metrics over time",
  "Screenshot import with automatic data extraction",
  "Full ride history with searchable snapshots",
];

export default function AppStoreMetadataPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold">App Store Metadata</h1>
      <p className="text-sm text-muted-foreground">Ready-to-use copy for your app store listing. Click the copy icon to grab any field.</p>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MetadataBlock label="App Name" value={appName} maxLength={30} />
          <MetadataBlock label="Subtitle" value={subtitle} maxLength={30} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Descriptions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <MetadataBlock label="Short Description" value={shortDescription} maxLength={80} />
          <MetadataBlock label="Full Description" value={fullDescription} maxLength={4000} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Keywords</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((kw) => (
                <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
              ))}
            </div>
            <CopyButton text={keywords.join(", ")} />
          </div>
          <p className="text-[10px] text-muted-foreground">{keywords.join(", ").length}/100 characters</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Primary</span>
            <Badge>{categories.primary}</Badge>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Secondary</span>
            <Badge variant="outline">{categories.secondary}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Screenshot Captions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-2">
            {screenshotCaptions.map((cap, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 text-xs font-semibold text-muted-foreground mt-0.5">{i + 1}.</span>
                <span className="flex-1 text-foreground">{cap}</span>
                <CopyButton text={cap} />
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
