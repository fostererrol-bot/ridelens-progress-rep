import { Upload, BarChart3, TrendingUp, GitCompareArrows, ShieldCheck, LayoutDashboard, Camera, CheckCircle, ArrowRight, History, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

function Section({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.section>
  );
}

const steps = [
  {
    step: 1,
    icon: Camera,
    title: "Take a screenshot",
    body: "After completing a ride in Zwift, take a screenshot of your Progress Report or Ride Menu screen. These are the two screens RideLens can extract data from.",
    tip: "PNG, JPG, and WebP formats are supported. You can upload up to 20 screenshots at once.",
  },
  {
    step: 2,
    icon: Upload,
    title: "Upload your screenshots",
    body: "Navigate to the Import Screenshots page and drag & drop your images (or click to browse). RideLens will automatically detect whether each image is a Progress Report or Ride Menu.",
    link: { to: "/import", label: "Go to Import" },
  },
  {
    step: 3,
    icon: CheckCircle,
    title: "Review extracted data",
    body: "AI extracts metrics from your screenshots. Review the extracted values on each card — you can edit any field before saving if something looks off.",
    tip: "Duplicate screenshots are detected automatically via image hashing, so you won't accidentally import the same ride twice.",
  },
  {
    step: 4,
    icon: BarChart3,
    title: "Save and explore",
    body: "Hit 'Save All' to store your data. Then head to the Dashboard to see your latest metrics, or check the History page for a full timeline.",
    link: { to: "/", label: "Go to Dashboard" },
  },
];

const features = [
  {
    icon: GitCompareArrows,
    title: "Between-report comparisons",
    body: "The Dashboard shows delta chips next to each metric, so you can see exactly what changed since your previous snapshot.",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard overview",
    body: "View your latest ride data at a glance — XP, performance power numbers, fitness trends, and training status all in one place.",
  },
  {
    icon: TrendingUp,
    title: "Trends over time",
    body: "The Trends page charts your key metrics across all your snapshots, helping you spot improvements or patterns.",
  },
  {
    icon: ShieldCheck,
    title: "Your data, your control",
    body: "All data comes from screenshots you upload. Nothing is synced, scraped, or pulled from external sources.",
  },
];

const pages = [
  { icon: LayoutDashboard, title: "Dashboard", to: "/", body: "Your latest snapshot with metric comparisons against the previous one." },
  { icon: Upload, title: "Import Screenshots", to: "/import", body: "Upload and process Zwift screenshots with AI extraction." },
  { icon: History, title: "History", to: "/history", body: "Browse all your saved snapshots in chronological order." },
  { icon: TrendingUp, title: "Trends", to: "/trends", body: "Visualise your metrics over time with interactive charts." },
  { icon: Settings, title: "Settings", to: "/settings", body: "Configure your account and app preferences." },
];

export default function HowToUsePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <Section>
        <motion.h1 variants={fadeUp} transition={{ duration: 0.4 }} className="text-2xl font-bold mb-2">
          How to Use RideLens
        </motion.h1>
        <motion.p variants={fadeUp} transition={{ duration: 0.4 }} className="text-muted-foreground text-sm leading-relaxed mb-10">
          RideLens turns your Zwift ride screenshots into structured data and meaningful trends. Here's how to get started.
        </motion.p>
      </Section>

      {/* ─── Step-by-step guide ─── */}
      <Section className="mb-12">
        <motion.h2 variants={fadeUp} transition={{ duration: 0.4 }} className="text-lg font-semibold mb-6">
          Getting Started
        </motion.h2>
        <div className="space-y-6">
          {steps.map(({ step, icon: Icon, title, body, tip, link }) => (
            <motion.div
              key={step}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="flex gap-4 rounded-xl border border-border bg-card p-5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-sm font-semibold">
                {step}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold">{title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                {tip && (
                  <p className="text-xs text-muted-foreground/70 italic">💡 {tip}</p>
                )}
                {link && (
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline mt-1"
                  >
                    {link.label} <ArrowRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── Key Features ─── */}
      <Section className="mb-12">
        <motion.h2 variants={fadeUp} transition={{ duration: 0.4 }} className="text-lg font-semibold mb-6">
          Key Features
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <motion.div
              key={title}
              variants={fadeUp}
              transition={{ duration: 0.4 }}
              className="rounded-xl border border-border bg-card p-5 space-y-2"
            >
              <Icon className="h-5 w-5 text-primary" />
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── App Pages ─── */}
      <Section className="mb-12">
        <motion.h2 variants={fadeUp} transition={{ duration: 0.4 }} className="text-lg font-semibold mb-6">
          App Pages
        </motion.h2>
        <div className="space-y-3">
          {pages.map(({ icon: Icon, title, to, body }) => (
            <motion.div key={to} variants={fadeUp} transition={{ duration: 0.4 }}>
              <Link
                to={to}
                className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:bg-accent/50 transition-colors group"
              >
                <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <div>
                  <h3 className="text-sm font-semibold">{title}</h3>
                  <p className="text-xs text-muted-foreground">{body}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ─── Supported Screenshots ─── */}
      <Section>
        <motion.h2 variants={fadeUp} transition={{ duration: 0.4 }} className="text-lg font-semibold mb-4">
          Supported Screenshot Types
        </motion.h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="rounded-xl border border-border bg-card p-5 space-y-2">
            <h3 className="text-sm font-semibold">Progress Report</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shows XP, level, achievements, route badges, challenge progress, performance power records, fitness trends, and training status.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} transition={{ duration: 0.4 }} className="rounded-xl border border-border bg-card p-5 space-y-2">
            <h3 className="text-sm font-semibold">Ride Menu</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Shows this-ride stats (distance, duration, calories, elevation), power records, rider totals, rider score, and heart rate / power distributions.
            </p>
          </motion.div>
        </div>
      </Section>
    </div>
  );
}
