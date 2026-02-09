export default function DisclaimerPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Disclaimer</h1>

      <div className="space-y-6">
        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">About</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This app is part of <span className="font-medium text-foreground">ESF Designs Vision</span>, where engineering meets clarity.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            It started as a simple learning exercise: taking information that lives on a screen and turning it into something structured, understandable, and useful over time. The focus isn't on chasing features, but on building calm, reliable tools that make progress easier to see and reason about.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Riders upload their own screenshots, the data is structured thoughtfully, and trends are visualised in a way that supports reflection and improvement.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This project is shared openly as part of a learning-in-public journey and will continue to evolve through small, deliberate iterations.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">Disclaimer</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            This is an independent <span className="font-medium text-foreground">ESF Designs Vision</span> project and is not affiliated with, endorsed by, or connected to Zwift.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All trademarks and references belong to their respective owners.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All data shown in the app is user-provided, based on screenshots uploaded by the user. No data is accessed from Zwift systems or services.
          </p>
        </section>

        <section className="rounded-xl border border-border bg-card p-5 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Short version</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            An independent ESF Designs Vision project. Not affiliated with or endorsed by Zwift. User-provided data only.
          </p>
        </section>
      </div>
    </div>
  );
}
