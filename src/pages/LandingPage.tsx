import { Link } from "react-router-dom";
import { Upload, BarChart3, TrendingUp, ArrowRight, GitCompareArrows, ShieldCheck, LayoutDashboard } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroDashboard from "@/assets/hero-dashboard.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

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
      <Section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <motion.span variants={fadeUp} transition={{ duration: 0.5 }} className="mb-4 inline-block text-xs font-semibold uppercase tracking-widest text-primary">
              Product Launch
            </motion.span>
            <motion.h1 variants={fadeUp} transition={{ duration: 0.5 }} className="text-3xl font-bold leading-tight tracking-tight md:text-5xl">
              Turning ride data into clear&nbsp;insight.
            </motion.h1>
            <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              RideLens transforms your own ride screenshots into structured data and meaningful trends,
              helping you see progress clearly over time rather than isolated numbers.
            </motion.p>
            <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Built with an engineering mindset and shared openly as part of a learning-in-public journey.
            </motion.p>
            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mt-8 flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <Link to="/">View the project</Link>
              </Button>
              <Button asChild>
                <Link to="/">
                  Install the app
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>

          <motion.div variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="relative">
            <div className="overflow-hidden rounded-xl border border-border shadow-lg" style={{ boxShadow: "var(--shadow-card)" }}>
              <img
                src={heroDashboard}
                alt="RideLens dashboard showing ride metrics and between-report comparisons"
                className="w-full object-cover opacity-90 saturate-[0.85]"
                loading="eager"
              />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ─── How It Works ─── */}
      <Section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-4xl px-6 py-20 md:py-28">
          <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Steps</motion.p>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.5 }} className="text-2xl font-bold tracking-tight md:text-3xl">How RideLens works</motion.h2>

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
              <motion.div key={step} variants={fadeUp} transition={{ duration: 0.5 }} className="flex gap-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-semibold text-foreground">
                  {step}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ─── Key Features ─── */}
      <Section className="border-t border-border">
        <div className="mx-auto max-w-5xl px-6 py-20 md:py-28">
          <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Features</motion.p>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.5 }} className="text-2xl font-bold tracking-tight md:text-3xl">Designed for clarity, not noise</motion.h2>

          <motion.div variants={stagger} className="mt-14 grid gap-10 sm:grid-cols-3">
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
              <motion.div key={title} variants={fadeUp} transition={{ duration: 0.5 }} className="space-y-3">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ─── Why RideLens Exists ─── */}
      <Section className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
          <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="mb-2 text-xs font-semibold uppercase tracking-widest text-primary">Purpose</motion.p>
          <motion.h2 variants={fadeUp} transition={{ duration: 0.5 }} className="text-2xl font-bold tracking-tight md:text-3xl">Why RideLens exists</motion.h2>
          <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
            RideLens was created to answer a simple question: what happens when useful information stays
            trapped inside screens?
          </motion.p>
          <motion.p variants={fadeUp} transition={{ duration: 0.5 }} className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Instead of building another tracker, the focus is on structure, consistency, and insight over
            time. It's a deliberate, evolving project shaped by real use and shared openly as part of a
            learning-in-public approach.
          </motion.p>
        </div>
      </Section>

      {/* ─── Footer ─── */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="border-t border-border"
      >
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
      </motion.footer>
    </div>
  );
}
