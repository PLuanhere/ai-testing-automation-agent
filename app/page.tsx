"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef, FC } from "react";
import Logo from "@/components/custom/Logo";
import {
  Zap,
  Play,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Cpu,
  RefreshCw,
  Layers,
  Menu,
  X,
  ChevronDown,
  Github,
  Code2,
  Globe,
  Monitor,
  Check,
  Clock,
  Activity,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────
const C = {
  bg: "#080c0a",
  bgSubtle: "#0d1410",
  surface: "#101813",
  surfaceAlt: "#141f18",
  border: "rgba(16, 185, 129, 0.15)",
  borderHover: "rgba(52, 211, 153, 0.35)",
  primary: "#10b981",
  primaryHover: "#34d399",
  primaryGlow: "rgba(16, 185, 129, 0.25)",
  cyan: "#06b6d4",
  textPrimary: "#f8fafc",
  textMuted: "#94a3b8",
  textSubtle: "#64748b",
} as const;

// ─── Helpers ──────────────────────────────────────────────────────
function useInView(threshold = 0.12): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function useScrollY(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    const fn = () => setY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return y;
}

function useCounter(target: number, active: boolean, duration = 1400): number {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const fps = 60;
    const steps = (duration / 1000) * fps;
    let i = 0;
    const id = setInterval(() => {
      i++;
      const ease = 1 - Math.pow(1 - i / steps, 3);
      setVal(Math.round(target * ease));
      if (i >= steps) {
        setVal(target);
        clearInterval(id);
      }
    }, 1000 / fps);
    return () => clearInterval(id);
  }, [active, target, duration]);
  return val;
}

// ─── Interactive Live Runner Simulator ─────────────────────────────
interface TestCase {
  id: string;
  name: string;
  category: string;
  time: string;
  status: "passed" | "running" | "pending";
  steps: string[];
}

const INITIAL_CASES: TestCase[] = [
  {
    id: "TC-01",
    name: "auth/session-token.spec.ts",
    category: "Security",
    time: "0.8s",
    status: "passed",
    steps: ["POST /api/auth/callback", "Validate JWT header", "Verify cookie session"],
  },
  {
    id: "TC-02",
    name: "checkout/stripe-webhook.spec.ts",
    category: "Billing",
    time: "1.4s",
    status: "passed",
    steps: ["Simulate checkout.session.completed", "Check idempotency key", "Update credits state"],
  },
  {
    id: "TC-03",
    name: "workspace/create-repo.spec.ts",
    category: "Core Engine",
    time: "1.1s",
    status: "passed",
    steps: ["Authorize GitHub OAuth token", "Fetch repo branch tree", "Parse AST component map"],
  },
  {
    id: "TC-04",
    name: "e2e/self-heal-selector.spec.ts",
    category: "AI Resilience",
    time: "0.9s",
    status: "passed",
    steps: ["Detect mutated button class", "Synthesize dynamic query", "Execute click action"],
  },
];

const InteractiveSimulator: FC = () => {
  const [activeTab, setActiveTab] = useState<"execution" | "generator" | "healing">("execution");
  const [isRunning, setIsRunning] = useState(false);
  const [runProgress, setRunProgress] = useState(100);
  const [cases, setCases] = useState<TestCase[]>(INITIAL_CASES);
  const [selectedCase, setSelectedCase] = useState<TestCase>(INITIAL_CASES[0]);

  const handleRunSuite = () => {
    if (isRunning) return;
    setIsRunning(true);
    setRunProgress(0);

    // Reset status to running
    setCases(prev => prev.map(c => ({ ...c, status: "pending" })));

    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setRunProgress(progress);

      if (progress === 40) {
        setCases(prev => [
          { ...prev[0], status: "passed" },
          { ...prev[1], status: "running" },
          prev[2],
          prev[3],
        ]);
      } else if (progress === 70) {
        setCases(prev => [
          { ...prev[0], status: "passed" },
          { ...prev[1], status: "passed" },
          { ...prev[2], status: "running" },
          prev[3],
        ]);
      } else if (progress >= 100) {
        setCases(INITIAL_CASES);
        setIsRunning(false);
        clearInterval(interval);
      }
    }, 450);
  };

  return (
    <div className="w-full rounded-2xl border border-emerald-500/20 bg-[#0d1510]/95 backdrop-blur-xl shadow-[0_12px_48px_rgba(0,0,0,0.6),0_0_40px_rgba(16,185,129,0.1)] overflow-hidden transition-all text-left">
      {/* Chrome Top Bar */}
      <div className="flex flex-wrap items-center justify-between border-b border-emerald-500/15 bg-[#090f0c] px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="ml-3 font-mono text-xs text-emerald-400/80 bg-emerald-950/40 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1.5">
            <Github className="w-3 h-3 text-emerald-400" />
            acme-corp/saas-core · main
          </span>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
          <button
            onClick={() => setActiveTab("execution")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "execution"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⚡ Live Runner
          </button>
          <button
            onClick={() => setActiveTab("generator")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "generator"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ✦ AI Synthesis
          </button>
          <button
            onClick={() => setActiveTab("healing")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "healing"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ⟳ Self-Healing Diff
          </button>
        </div>

        {/* Run Action */}
        <button
          onClick={handleRunSuite}
          disabled={isRunning}
          className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-md shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Running Grid ({runProgress}%)...
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              Run Test Suite
            </>
          )}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-emerald-950/40 h-1 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-300"
          style={{ width: `${runProgress}%` }}
        />
      </div>

      {/* Main Tab Content */}
      {activeTab === "execution" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-emerald-500/10 min-h-[360px]">
          {/* Left Column: Test Cases List */}
          <div className="lg:col-span-6 p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-3">
                <span className="flex items-center gap-1 text-emerald-400 font-medium">
                  <Activity className="w-3.5 h-3.5 text-emerald-400" />
                  Cloud Grid: 4 Parallel Workers
                </span>
                <span className="text-emerald-400">All 4 Passed (4.2s)</span>
              </div>

              <div className="space-y-2">
                {cases.map(c => {
                  const isSelected = selectedCase.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCase(c)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-emerald-950/40 border-emerald-500/40 shadow-sm"
                          : "bg-black/30 border-white/5 hover:border-emerald-500/20"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {c.status === "passed" ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : c.status === "running" ? (
                          <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                        ) : (
                          <span className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                        )}
                        <div>
                          <div className="font-mono text-xs text-slate-200 font-medium">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 text-[10px]">
                              {c.category}
                            </span>
                            <span>{c.steps.length} assertions verified</span>
                          </div>
                        </div>
                      </div>
                      <span className="font-mono text-xs text-slate-400">{c.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-500/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1 text-slate-300">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Browserbase Cloud Headless Chrome
              </span>
              <span className="font-mono text-emerald-400 font-semibold">100% Pass Rate</span>
            </div>
          </div>

          {/* Right Column: Simulated Live Browser Viewport */}
          <div className="lg:col-span-6 bg-[#080d0a] p-4 flex flex-col justify-between">
            <div>
              {/* Simulated Browser URL bar */}
              <div className="flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg border border-white/5 mb-3 font-mono text-[11px] text-slate-400">
                <span className="text-emerald-400">https://</span>
                <span className="text-slate-200 truncate">preview.acme-corp.com/{selectedCase.name.split("/")[0]}</span>
                <span className="ml-auto text-emerald-400/80 bg-emerald-950 px-1.5 py-0.5 rounded text-[10px]">
                  HTTP 200 OK
                </span>
              </div>

              {/* Viewport Canvas */}
              <div className="bg-[#111c15] border border-emerald-500/20 rounded-xl p-4 min-h-[220px] flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-semibold text-slate-200">
                      Step Trace Inspector: {selectedCase.id}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">FPS: 60 · Cloud Grid</span>
                </div>

                <div className="my-3 space-y-2 font-mono text-xs">
                  {selectedCase.steps.map((st, i) => (
                    <div key={i} className="flex items-center gap-2 text-slate-300">
                      <span className="text-emerald-400 text-[10px]">[{i + 1}]</span>
                      <span className="text-emerald-300">PASS</span>
                      <span className="text-slate-400">→</span>
                      <span>{st}</span>
                    </div>
                  ))}
                  <div className="text-emerald-400 text-xs pt-1 flex items-center gap-1.5 font-medium">
                    <Check className="w-3.5 h-3.5" />
                    DOM State matched assertion snapshot
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
                  <span>Viewport: 1920x1080 WebKit</span>
                  <span className="text-cyan-400">Session video recorded</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 mt-3 font-mono">
              <span>Auto-retries: 0</span>
              <span className="text-emerald-400">Zero Flake Guarantee</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === "generator" && (
        <div className="p-6 font-mono text-xs text-slate-300 space-y-3 bg-[#090f0c]">
          <div className="text-slate-400 flex items-center justify-between">
            <span>// Agent QA Autonomous Spec Generator (LLM AST Crawler)</span>
            <span className="text-emerald-400">Synthesized in 1.2s</span>
          </div>
          <div className="p-4 rounded-xl bg-black/60 border border-emerald-500/20 text-emerald-300 leading-relaxed overflow-x-auto">
            <pre>{`import { test, expect } from '@playwright/test';

// Generated by Agent QA for route: /checkout/payment
test.describe('Checkout & Payment Flow', () => {
  test('autonomous user journey with discount and credit card', async ({ page }) => {
    await page.goto('/checkout');
    await page.getByTestId('cart-item-count').waitFor({ state: 'visible' });
    
    // Agent discovered dynamic promo code input
    await page.fill('input[name="promoCode"]', 'SUMMER2026');
    await page.click('button:has-text("Apply")');
    
    // Assert calculation & tax breakdown
    await expect(page.locator('.total-summary')).toContainText('$79.20');
    
    // Automated Stripe Tokenization test
    await page.click('#stripe-pay-button');
    await expect(page).toHaveURL(/\\/order\\/success/);
  });
});`}</pre>
          </div>
        </div>
      )}

      {activeTab === "healing" && (
        <div className="p-6 font-mono text-xs text-slate-300 space-y-3 bg-[#090f0c]">
          <div className="flex items-center justify-between text-slate-400">
            <span>// Self-Healing Selector Engine (DOM Drift Resolution)</span>
            <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              Healed Automatically
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
              <div className="text-red-400 font-semibold mb-2 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                Original Broken Selector (DOM mutated in commit a8f9c)
              </div>
              <code className="text-red-300 block">
                button.btn-primary.checkout-v1-btn[disabled="false"]
              </code>
              <p className="text-[11px] text-slate-400 mt-3 font-sans">
                Status: Element not found after frontend team refactored to Tailwind v4.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40">
              <div className="text-emerald-400 font-semibold mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Agent QA Healed Replacement
              </div>
              <code className="text-emerald-300 block">
                button:has-text("Complete Order") & role="button"[aria-busy="false"]
              </code>
              <p className="text-[11px] text-slate-400 mt-3 font-sans">
                Result: Semantics analyzed via accessibility tree. Test continued without failure.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Stat Cell Component ──────────────────────────────────────────
const StatCell: FC<{ target: number; suffix: string; label: string; active: boolean }> = ({
  target,
  suffix,
  label,
  active,
}) => {
  const count = useCounter(target, active);
  return (
    <div className="p-6 text-center lg:text-left transition-all">
      <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 tracking-tight">
        {count}
        {suffix}
      </div>
      <div className="text-xs sm:text-sm font-medium text-slate-400 mt-1.5">{label}</div>
    </div>
  );
};

// ─── FAQ Accordion Item ───────────────────────────────────────────
const FaqItem: FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className="rounded-xl border border-emerald-500/15 bg-emerald-950/10 hover:border-emerald-500/35 transition-all p-5 cursor-pointer select-none"
    >
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-semibold text-slate-200 text-sm sm:text-base">{q}</h4>
        <ChevronDown
          className={`w-4 h-4 text-emerald-400 shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </div>
      {open && (
        <p className="mt-3 text-slate-400 text-xs sm:text-sm leading-relaxed border-t border-white/5 pt-3">
          {a}
        </p>
      )}
    </div>
  );
};

// ─── How to Use Section Component ─────────────────────────────────
const HowToUseSection: FC = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      step: "01",
      badge: "Step 1: Connect",
      title: "Connect your GitHub Repository",
      subtitle: "1-Click OAuth Authorization",
      desc: "Authorize Agent QA with your GitHub account and select any repository. Agent QA immediately parses your route declarations, server components, and interactive UI forms.",
      bullets: [
        "Zero CLI or configuration files required",
        "Supports private and public repositories",
        "Automatic route mapping and component graph",
      ],
      terminal: `$ agent-qa connect --repo github.com/acme/storefront\n✦ GitHub OAuth Authorized: @developer\n✦ Discovered: 14 Next.js App Router routes, 38 components\n✦ Environment: React 19, TypeScript, Tailwind CSS`,
      tip: "Takes under 15 seconds. No credit card required.",
      cta: "Connect Repo in Workspace",
    },
    {
      step: "02",
      badge: "Step 2: Configure",
      title: "Set Target App Domain & Instructions",
      subtitle: "Preview, Staging, or Localhost",
      desc: "Specify your website's URL (such as a Vercel preview deployment or localhost) where headless cloud browsers navigate. Optionally add test credentials or instructions.",
      bullets: [
        "Supports Vercel preview URLs, staging, & production",
        "Global instructions for test accounts & auth cookies",
        "Encrypted credential storage with zero leak risk",
      ],
      terminal: `// Project Configuration · storefront\nTARGET_DOMAIN = "https://preview.acme-corp.com"\nGLOBAL_INSTRUCTIONS = "Use test user: demo@acme.com / Pass123!\nDismiss cookie consent modal on initial page load."`,
      tip: "Agent QA automatically injects these parameters during test execution.",
      cta: "Configure URL",
    },
    {
      step: "03",
      badge: "Step 3: Synthesize",
      title: "Synthesize Autonomous Test Suites",
      subtitle: "Gemini 2.5 Autonomous AST Synthesis",
      desc: "Click 'Generate AI Test Suite'. Gemini AI analyzes your state transitions, form validations, and user journeys to create 20+ comprehensive Playwright test cases.",
      bullets: [
        "Comprehensive coverage: Auth, Checkout, Search, Edge cases",
        "Standard Playwright TypeScript code output",
        "Edit, customize, or add manual test assertions anytime",
      ],
      terminal: `✦ Synthesizing Playwright specs with Gemini AI...\n  ✓ TC-01: Auth cookie & session persistence (0.8s)\n  ✓ TC-02: Stripe checkout discount calculation (1.4s)\n  ✓ TC-03: Cart inventory decrement on purchase (1.1s)\n  ✓ TC-04: Self-healing selector test on /checkout (0.9s)`,
      tip: "Over 20+ production-grade test cases generated in ~5 seconds.",
      cta: "Synthesize Tests",
    },
    {
      step: "04",
      badge: "Step 4: Execute",
      title: "Run Cloud Tests & Session Replays",
      subtitle: "Parallel Execution via Browserbase",
      desc: "Click 'Run Test Suite'. Tests run concurrently across real cloud browsers with video recordings, step traces, and Self-Healing selectors that adapt when UI classes shift.",
      bullets: [
        "Headless Chromium, WebKit (Safari), & Firefox Quantum",
        "Self-Healing selectors auto-resolve broken classes",
        "Full session video replay and network waterfall traces",
      ],
      terminal: `✦ Launching Browserbase Cloud Grid (4 Parallel Workers)...\n  [1/4] Chromium 120.0: auth.spec.ts → PASSED (0.9s)\n  [2/4] WebKit 17.2: checkout.spec.ts → PASSED (1.4s)\n  [3/4] Firefox 121.0: cart.spec.ts → PASSED (1.1s)\n  [4/4] Chromium 120.0: search.spec.ts → PASSED (0.8s)\n✓ 100% Suite Pass Rate · Session Video Saved`,
      tip: "Download standard Playwright code or commit it directly to GitHub.",
      cta: "Run Suite",
    },
  ];

  const curr = steps[activeStep];

  return (
    <section id="how-to-use" className="relative z-10 py-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto scroll-mt-20">
      <div id="how-it-works" className="scroll-mt-20">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3.5 py-1 rounded-full border border-emerald-500/25 inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Quick Start Guide
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
            How to Use Agent QA
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              in 4 Simple Steps
            </span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3 leading-relaxed">
            From connecting your repository to watching your first automated test run on cloud browsers in under 3 minutes.
          </p>
        </div>

        {/* ── STEP SELECTOR TABS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {steps.map((s, idx) => {
            const isActive = activeStep === idx;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-br from-[#0e1a12] to-[#0a120d] border-emerald-500/50 shadow-[0_0_25px_rgba(16,185,129,0.15)]"
                    : "bg-[#0a100c]/60 border-white/10 hover:border-emerald-500/30 hover:bg-[#0c140f]"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
                      isActive
                        ? "text-emerald-300 bg-emerald-500/20 border-emerald-500/40"
                        : "text-slate-400 bg-black/40 border-white/10"
                    }`}
                  >
                    {s.step}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  {s.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                  {s.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── ACTIVE STEP DETAIL CARD (Interactive Preview) ── */}
        <div className="rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-[#0c1610] via-[#09120c] to-[#070e09] p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Explanations & Bullet Points */}
            <div className="lg:col-span-6 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                <span>{curr.badge}</span>
                <span>·</span>
                <span className="text-slate-400">Step {activeStep + 1} of 4</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {curr.title}
              </h3>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {curr.desc}
              </p>

              <div className="space-y-2.5 pt-2">
                {curr.bullets.map((b, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                {activeStep < 3 ? (
                  <button
                    onClick={() => setActiveStep((prev) => Math.min(prev + 1, 3))}
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                  >
                    Next: Step {activeStep + 2}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <Link
                    href="/workspace"
                    className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
                  >
                    Start Testing Now in Workspace
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}

                <span className="text-xs text-slate-500 italic">
                  💡 {curr.tip}
                </span>
              </div>
            </div>

            {/* Right Column: Code & Terminal Simulation View */}
            <div className="lg:col-span-6">
              <div className="rounded-xl border border-emerald-500/20 bg-black/70 shadow-inner overflow-hidden text-left font-mono text-xs">
                {/* Window Chrome */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#090f0c] border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                    <span className="ml-2 text-slate-400 text-[11px]">agent-qa · step-0{activeStep + 1}</span>
                  </div>
                  <span className="text-[10px] text-emerald-400/80">Interactive Guide</span>
                </div>

                {/* Simulated Content */}
                <div className="p-4 sm:p-5 text-emerald-300 leading-relaxed whitespace-pre-wrap overflow-x-auto min-h-[220px]">
                  {curr.terminal}
                </div>

                {/* Footer status */}
                <div className="px-4 py-2 bg-emerald-950/20 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Check className="w-3.5 h-3.5" /> Ready in production
                  </span>
                  <span>Agent QA 2.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════
export default function AgentQALanding() {
  const scrollY = useScrollY();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [statsRef, statsIn] = useInView(0.2);

  const scrolled = scrollY > 20;

  return (
    <div className="min-h-screen bg-[#080c0a] text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden font-sans">
      {/* Background Matrix & Subtle Gradient Mesh */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage: "radial-gradient(#10b981 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px]" />
        <div className="absolute top-[35%] right-[-15%] w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[140px]" />
        <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-600/10 blur-[150px]" />
      </div>

      {/* ── HEADER / NAVBAR ── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#080c0a]/85 backdrop-blur-xl border-b border-emerald-500/15 py-3 shadow-lg shadow-black/40"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Logo size="md" variant="dark" href="/" />
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-black/40 border border-emerald-500/15 rounded-full px-4 py-1.5 backdrop-blur-md">
            {[
              { label: "How to Use", href: "#how-to-use" },
              { label: "Features", href: "#features" },
              { label: "Interactive Demo", href: "#demo" },
              { label: "Comparison", href: "#comparison" },
              { label: "FAQ", href: "#faq" },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                className="px-3.5 py-1 text-xs font-medium text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/workspace"
              className="text-xs font-medium text-slate-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Sign in
            </Link>

            <Link
              href="/workspace"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-xs px-4 py-2 rounded-lg shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
            >
              Launch App
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 text-slate-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a100c]/98 border-b border-emerald-500/20 px-6 py-6 space-y-4 backdrop-blur-2xl">
            <nav className="flex flex-col space-y-3">
              {[
                { label: "How to Use", href: "#how-to-use" },
                { label: "Features", href: "#features" },
                { label: "Interactive Demo", href: "#demo" },
                { label: "Comparison", href: "#comparison" },
                { label: "FAQ", href: "#faq" },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-slate-300 hover:text-emerald-400 py-1"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              <Link
                href="/workspace"
                className="w-full text-center py-2 text-sm text-slate-300 bg-white/5 rounded-lg border border-white/10"
              >
                Sign in
              </Link>
              <Link
                href="/workspace"
                className="w-full text-center py-2.5 text-sm font-semibold text-slate-950 bg-emerald-400 rounded-lg shadow-md"
              >
                Connect GitHub & Launch →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 pt-32 sm:pt-40 pb-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        {/* Animated Feature Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium mb-8 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
          <span>Agent QA 2.0 • Autonomous Test Engineering for Web</span>
          <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6">
          Autonomous QA Engineering
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            for Modern Web Apps
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed mb-10">
          Connect your GitHub repository. Agent QA crawls your route tree, generates resilient
          Playwright test suites with AI, and executes them in cloud browsers with zero flakiness.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <Link
            href="/workspace"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-bold text-sm sm:text-base px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/25 active:scale-95 transition-all"
          >
            <Github className="w-4 h-4" />
            Connect GitHub Repository
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#demo"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-semibold text-sm sm:text-base px-6 py-3 rounded-xl backdrop-blur-md transition-all"
          >
            <Play className="w-4 h-4 text-emerald-400 fill-current" />
            Live Runner Sandbox
          </a>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 mb-16">
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Zero manual config
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Next.js & React AST analysis
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-400" /> Powered by Browserbase Cloud
          </span>
        </div>

        {/* Interactive Simulator Section */}
        <div id="demo" className="scroll-mt-28">
          <InteractiveSimulator />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section
        ref={statsRef}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
      >
        <div className="rounded-2xl border border-emerald-500/15 bg-gradient-to-b from-[#0d1611] to-[#080d0a] grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-emerald-500/15 shadow-xl">
          <StatCell target={99} suffix=".8%" label="Flake-Free Pass Rate" active={statsIn} />
          <StatCell target={214} suffix="+" label="Avg Scenarios Generated" active={statsIn} />
          <StatCell target={2400} suffix="+" label="GitHub Repos Analyzed" active={statsIn} />
          <StatCell target={38} suffix="s" label="Avg Full Suite Runtime" active={statsIn} />
        </div>
      </section>

      {/* ── HOW TO USE (INTERACTIVE 4 STEPS) ── */}
      <HowToUseSection />


      {/* ── BENTO GRID FEATURES ── */}
      <section id="features" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/25">
            Engine Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Built for High-Velocity Engineering Teams
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            No brittle Selenium scripts. No maintenance nightmares. Just pure autonomous quality.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Self-Healing DOM Engine (Wide) */}
          <div className="md:col-span-2 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0c140f] to-[#080d0a] p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Self-Healing DOM Selectors
              </h3>
              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                When your frontend engineers change button classes, reorganize Flexbox containers, or refactor to Tailwind v4, Agent QA's semantic AI automatically reconciles broken selectors without failing the build.
              </p>
            </div>

            {/* Code Diff Visual */}
            <div className="mt-6 p-4 rounded-xl bg-black/60 border border-emerald-500/20 font-mono text-xs text-slate-300">
              <div className="text-red-400 flex items-center gap-1.5 mb-1">
                <span>-</span>
                <span className="line-through">await page.click('.checkout-btn-v2.old-style')</span>
                <span className="text-[10px] text-red-500">(Broken by layout shift)</span>
              </div>
              <div className="text-emerald-400 flex items-center gap-1.5 font-medium">
                <span>+</span>
                <span>await page.click('button:has-text("Submit Payment")')</span>
                <span className="text-[10px] text-emerald-500 bg-emerald-950 px-1 rounded">(Healed by Agent QA)</span>
              </div>
            </div>
          </div>

          {/* Card 2: Parallel Cloud Browsers */}
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0c140f] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Browserbase Cloud Grid
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Execute hundreds of tests concurrently across real cloud browsers with zero infrastructure configuration.
              </p>
            </div>

            <div className="mt-6 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                <span className="text-slate-300">Chromium Headless</span>
                <span className="text-emerald-400 font-semibold">Ready · 16 workers</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                <span className="text-slate-300">WebKit (Safari)</span>
                <span className="text-emerald-400 font-semibold">Ready · 8 workers</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-black/40 border border-white/5">
                <span className="text-slate-300">Firefox Quantum</span>
                <span className="text-emerald-400 font-semibold">Ready · 8 workers</span>
              </div>
            </div>
          </div>

          {/* Card 3: Session Replays & Traces */}
          <div className="rounded-2xl border border-emerald-500/20 bg-[#0c140f] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Monitor className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Video Session Replays
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Inspect failing journeys frame-by-frame with full DOM snapshots, network waterfall logs, and console errors.
              </p>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-black/50 border border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Play className="w-4 h-4 fill-current" />
              </div>
              <div className="text-xs">
                <div className="text-slate-200 font-semibold">Session_Run_8921.mp4</div>
                <div className="text-slate-400 text-[11px]">1080p · 24fps with network sync</div>
              </div>
            </div>
          </div>

          {/* Card 4: CI/CD GitHub Bot (Wide) */}
          <div className="md:col-span-2 rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-[#0c140f] to-[#080d0a] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
                <Github className="w-5 h-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Automated Pull Request Guardian
              </h3>
              <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
                Agent QA listens to PR webhooks, automatically spins up test suites for modified components, and posts detailed pass/fail reviews with suggested code fixes before merge.
              </p>
            </div>

            <div className="mt-6 p-4 rounded-xl bg-black/60 border border-emerald-500/20 text-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-emerald-400 font-bold">bot/agent-qa</span>
                <span className="text-slate-500">commented 2 minutes ago</span>
              </div>
              <p className="text-slate-300">
                ✅ <strong>All 214 tests passed</strong> across Chrome, Firefox, and Safari on Browserbase.
                Coverage increased by <strong>+4.2%</strong> on routes: <code className="text-emerald-300">/api/checkout</code>, <code className="text-emerald-300">/workspace</code>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section id="comparison" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/25">
            The Shift
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Traditional QA vs. Agent QA
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-2">
            Why high-growth tech companies are transitioning from manual scripting to autonomous agents.
          </p>
        </div>

        <div className="rounded-2xl border border-emerald-500/20 bg-[#0c140f] overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-emerald-500/15">
            {/* Manual QA */}
            <div className="p-6 sm:p-8 bg-red-950/5">
              <div className="flex items-center gap-2 text-red-400 font-bold text-lg mb-6">
                <XCircle className="w-5 h-5" />
                Manual Scripting & Old QA
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">✕</span>
                  <span>Days spent hand-writing repetitive Playwright/Cypress scripts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">✕</span>
                  <span>Tests constantly break whenever CSS classes or DOM elements shift</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">✕</span>
                  <span>Managing expensive local Docker Selenium grids and flakiness</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 font-bold shrink-0">✕</span>
                  <span>Missed edge cases due to manual test scenario oversight</span>
                </li>
              </ul>
            </div>

            {/* Agent QA */}
            <div className="p-6 sm:p-8 bg-emerald-950/15">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-lg mb-6">
                <CheckCircle2 className="w-5 h-5" />
                Agent QA Autonomous Platform
              </div>
              <ul className="space-y-4 text-xs sm:text-sm text-slate-200">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Instant GitHub connection and AI synthesis of 200+ test scenarios</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Self-Healing selectors adapt to frontend refactors in real time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Zero infrastructure via Browserbase cloud parallel browser instances</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>Comprehensive user journey coverage with video replay and traces</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION ── */}
      <section id="faq" className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/25">
            Frequently Asked Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-4">
          <FaqItem
            q="How does Agent QA generate test cases without manual scripting?"
            a="Agent QA connects to your GitHub repository and parses your project's Abstract Syntax Tree (AST), route declarations, server actions, and component hierarchy. Our AI model identifies all interactive state transitions and synthesizes real Playwright test suites customized to your application."
          />
          <FaqItem
            q="What is the Self-Healing mechanism and how does it prevent flakiness?"
            a="Traditional tests fail whenever class names or markup structures change. Agent QA analyzes the semantic purpose of each UI element (via accessibility trees and component roles). When an element moves or changes its class, Agent QA dynamically heals the query at runtime and passes the test."
          />
          <FaqItem
            q="How does the Browserbase integration work?"
            a="Tests execute remotely on Browserbase's cloud browser infrastructure. You don't need to run headless Chrome or configure Docker locally. Every run includes full video recordings, network inspection, and console logs."
          />
          <FaqItem
            q="Is my source code secure?"
            a="Yes. Agent QA only inspects the repository metadata and component structure necessary for test synthesis over secure, encrypted GitHub OAuth connections. We never sell or train public models on your proprietary business logic."
          />
          <FaqItem
            q="Can I export the generated Playwright code to my repo?"
            a="Yes! All synthesized test cases are standard Playwright TypeScript specs. You can run them directly through Agent QA, or export and commit them directly into your git repository for standard CI execution."
          />
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="relative z-10 py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-[#0f1f15] via-[#09140d] to-[#060b08] p-8 sm:p-14 text-center relative overflow-hidden shadow-[0_20px_60px_rgba(16,185,129,0.15)]">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              Ready to automate your test suite?
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
              Ship with confidence.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Every single commit.
              </span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8">
              Connect your GitHub repository and have a full AI-generated test suite executing in Browserbase within minutes.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-sm sm:text-base px-7 py-3.5 rounded-xl shadow-lg shadow-emerald-400/25 active:scale-95 transition-all"
              >
                <Github className="w-4 h-4" />
                Connect GitHub & Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white font-medium text-sm sm:text-base px-6 py-3.5 rounded-xl border border-white/15 backdrop-blur-md transition-all"
              >
                Try Sandbox Demo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="relative z-10 border-t border-emerald-500/15 bg-[#060907] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Logo size="sm" variant="dark" href="/" />
            <span className="text-xs text-slate-500 font-mono">
              Autonomous AI Testing Agent
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <a href="#how-to-use" className="hover:text-emerald-400 transition-colors">
              How to Use
            </a>
            <a href="#features" className="hover:text-emerald-400 transition-colors">
              Features
            </a>
            <a href="#demo" className="hover:text-emerald-400 transition-colors">
              Sandbox
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors">
              FAQ
            </a>
            <Link href="/workspace" className="hover:text-emerald-400 transition-colors">
              Workspace
            </Link>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              All Systems Operational
            </span>
            <span>·</span>
            <span>© {new Date().getFullYear()} Agent QA</span>
          </div>
        </div>
      </footer>
    </div>
  );
}