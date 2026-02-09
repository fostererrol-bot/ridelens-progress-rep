import { Link } from "react-router-dom";
import { Upload, BarChart3, TrendingUp, ArrowRight, GitCompareArrows, ShieldCheck, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroDashboard from "@/assets/hero-dashboard.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Top Navigation ─── */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-base font-semibold tracking-tight">RideLens</span>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">View the project</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/">Install the app</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* ─── Hero Section ─── */}
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Product Launch
            </span>
            <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Turning ride data into clear&nbsp;insight.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              RideLens transforms your own ride screenshots into structured data and meaningful trends,
              helping you see progress clearly over time rather than isolated numbers.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Built with an engineering mindset and shared openly as part of a learning-in-public journey.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link to="/">View the project</Link>
              </Button>
              <Button asChild>
                <Link to="/">
                  Install the app
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-xl border border-border shadow-lg" style={{ boxShadow: "var(--shadow-card)" }}>
              <img
                src={heroDashboard}
                alt="RideLens dashboard showing ride metrics and between-report comparisons"
                className="w-full object-cover opacity-90 saturate-[0.85]"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Steps</p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">How RideLens works</h2>

          <div className="mt-14 space-y-12">
            {[
              {
                step: 1,
                icon: Upload,
                title: "Upload your screenshots",
                body: "Add your own ride screenshots directly into the app. No syncing, no scraping, no hidden data sources.",
              },
              {
                step: 2,
                icon: BarChart3,
                title: "Structure the data",
                body: "RideLens extracts key metrics, lets you review them, and stores everything in a clean, consistent format.",
              },
              {
                step: 3,
                icon: TrendingUp,
                title: "See change over time",
                body: "Track trends and compare reports to understand what's improving, what's steady, and what's changing.",
              },
            ].map(({ step, icon: Icon, title, body }) => (
              <div key={step} className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold text-foreground">
                  {step}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Key Features ─── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Features</p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Designed for clarity, not noise</h2>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {[
              {
                icon: GitCompareArrows,
                title: "Between-report comparisons",
                body: "See what changed since the last snapshot, not just cumulative totals.",
              },
              {
                icon: ShieldCheck,
                title: "User-controlled data",
                body: "All data is uploaded by you. Nothing is pulled from external systems.",
              },
              {
                icon: LayoutDashboard,
                title: "Calm, readable dashboards",
                body: "Built to be understandable at a glance, without overwhelming charts.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="space-y-3">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Why RideLens Exists ─── */}
      <section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Purpose</p>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">Why RideLens exists</h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            RideLens was created to answer a simple question: what happens when useful information stays
            trapped inside screens?
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Instead of building another tracker, the focus is on structure, consistency, and insight over
            time. It's a deliberate, evolving project shaped by real use and shared openly as part of a
            learning-in-public approach.
          </p>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-10 text-center">
          <p className="text-sm font-semibold tracking-tight">RideLens <span className="font-light text-muted-foreground">by ESF Designs Vision</span></p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <Link to="/disclaimer" className="hover:text-foreground transition-colors">About</Link>
            <span className="text-border">·</span>
            <Link to="/disclaimer" className="hover:text-foreground transition-colors">Privacy</Link>
            <span className="text-border">·</span>
            <Link to="/disclaimer" className="hover:text-foreground transition-colors">Disclaimer</Link>
          </div>
          <p className="mt-4 text-[10px] text-muted-foreground leading-relaxed">
            Independent project. Not affiliated with or endorsed by Zwift. User-provided data only.
          </p>
        </div>
      </footer>
    </div>
  );
}
