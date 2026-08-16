import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, CheckCircle2, ChevronRight, ArrowRight, Sparkles, Shield, Brain, Zap, BarChart2, Globe, AlertTriangle, RefreshCcw, ExternalLink, Building2, Layers, Activity, Target, HelpCircle, User, X } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
import { getFriendlyErrorMessage, requestApi } from '../../../../api/client';
import { getSelectedWorkspaceId } from '../../../../api/session';
type Phase = "setup_complete" | "confirm_analysis" | "analysis_started" | "analysis_complete" | "analysis_error";
type StageStatus = "pending" | "running" | "complete" | "error";
type Progress = Record<string, StageStatus>;
const steps = ["Company Information", "Business Description", "Existing Platforms", "Integrations", "Setup Complete"];
const setupRows = [{
  name: "Company Information",
  status: "Complete"
}, {
  name: "Business Description",
  status: "Complete"
}, {
  name: "Existing Platforms",
  status: "Complete"
}, {
  name: "Integrations",
  status: "Configured"
}];
const analysisStages = [{
  id: "profile",
  label: "Business Profile",
  icon: Building2
}, {
  id: "products",
  label: "Products & Services",
  icon: Layers
}, {
  id: "platforms",
  label: "Connected Platforms",
  icon: Zap
}, {
  id: "marketing",
  label: "Marketing & Analytics",
  icon: BarChart2
}, {
  id: "insights",
  label: "AI Insights",
  icon: Sparkles
}];
const sources = ["Business Profile", "Products & Services", "Google Analytics", "Google Search Console", "Google Ads"];
const categories = [{
  label: "Business Profile",
  icon: Building2
}, {
  label: "Products & Services",
  icon: Layers
}, {
  label: "Website",
  icon: Globe
}, {
  label: "SEO",
  icon: Target
}, {
  label: "Marketing",
  icon: TrendingIcon
}, {
  label: "Advertising",
  icon: BarChart2
}, {
  label: "Analytics",
  icon: Activity
}, {
  label: "Integrations",
  icon: Zap
}];
function TrendingIcon({
  size = 15,
  className = ""
}: {
  size?: number;
  className?: string;
}) {
  return <Activity size={size} className={className} />;
}
export const LuluSetupComplete = () => {
  const [phase, setPhase] = useState<Phase>("setup_complete");
  const [progress, setProgress] = useState<Progress>(() => Object.fromEntries(analysisStages.map(stage => [stage.id, "pending"])) as Progress);
  const [elapsed, setElapsed] = useState(0);
  const [completionError, setCompletionError] = useState('');
  const reducedMotion = useRef(false);
  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  useEffect(() => {
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) return;
    requestApi({ path: `/workspaces/${workspaceId}/onboarding/complete`, method: 'POST', body: {} })
      .catch(cause => setCompletionError(getFriendlyErrorMessage(cause, 'We could not finish the setup. Please try again.')));
  }, []);
  useEffect(() => {
    if (phase !== "analysis_started") return;
    const timers: number[] = [];
    const update = (changes: Progress) => setProgress(current => ({
      ...current,
      ...changes
    }));
    if (reducedMotion.current) {
      update(Object.fromEntries(analysisStages.map(stage => [stage.id, "complete"])) as Progress);
      const done = window.setTimeout(() => undefined, 250);
      timers.push(done);
      return () => timers.forEach(window.clearTimeout);
    }
    update({
      profile: "running"
    });
    timers.push(window.setTimeout(() => update({
      profile: "complete",
      products: "running"
    }), 1500));
    timers.push(window.setTimeout(() => update({
      products: "complete",
      platforms: "running"
    }), 3000));
    timers.push(window.setTimeout(() => update({
      platforms: "complete",
      marketing: "running"
    }), 4500));
    timers.push(window.setTimeout(() => update({
      marketing: "complete",
      insights: "running"
    }), 6000));
    timers.push(window.setTimeout(() => {
      update({
        insights: "complete"
      });
    }, 7500));
    return () => timers.forEach(window.clearTimeout);
  }, [phase]);
  useEffect(() => {
    if (phase !== "analysis_started") return;
    const started = Date.now();
    const timer = window.setInterval(() => setElapsed((Date.now() - started) / 1000), 100);
    return () => window.clearInterval(timer);
  }, [phase]);
  const startAnalysis = async () => {
    setProgress(Object.fromEntries(analysisStages.map(stage => [stage.id, "pending"])) as Progress);
    setElapsed(0);
    setPhase("analysis_started");
    const workspaceId = getSelectedWorkspaceId();
    if (!workspaceId) {
      setPhase('analysis_error');
      return;
    }
    try {
      const conversation = await requestApi<{ id: string }>({
        path: `/workspaces/${workspaceId}/ai/conversations`,
        method: 'POST',
        body: { title: 'Initial company analysis', metadata: { source: 'onboarding' } },
      });
      await requestApi({
        path: `/workspaces/${workspaceId}/ai/conversations/${conversation.data.id}/respond`,
        method: 'POST',
        body: { content: 'Analyze the company profile, offerings and connected platform context. Identify the three highest-impact opportunities, the three most important risks, and the recommended next actions. Clearly distinguish observations from inferences.' },
      });
      setProgress(Object.fromEntries(analysisStages.map(stage => [stage.id, "complete"])) as Progress);
      setPhase('analysis_complete');
    } catch {
      setPhase('analysis_error');
    }
  };
  return <div className="min-h-screen bg-[var(--background)] text-foreground">
      {completionError && <div role="alert" className="fixed left-1/2 top-3 z-50 -translate-x-1/2 rounded-lg border border-border bg-[var(--card)] px-4 py-2 text-sm text-[var(--destructive)] shadow-xl">{completionError}</div>}
      <header className="sticky top-0 z-30 border-b border-border bg-[var(--background)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              L
            </div>
            <span className="text-xl font-semibold tracking-[-0.03em] text-foreground">
              Lulu AI
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Get help" className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
              
              <HelpCircle size={15} /> <span>Help</span>
            </button>
            <div aria-label="Account" className="grid h-8 w-8 place-items-center rounded-full border border-border bg-secondary">
              
              <User size={14} className="text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>
      {phase !== "analysis_started" && phase !== "analysis_complete" && phase !== "analysis_error" && <nav aria-label="Setup progress" className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-[.18em] text-foreground">
                Company setup
              </span>
              <span className="text-xs font-medium text-foreground">
                Step 5 of 5
              </span>
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {steps.map(step => <div key={step} className="h-1.5 rounded-full bg-primary" title={step} />)}
            </div>
          </nav>}
      <main className="mx-auto max-w-2xl px-4 py-10 md:py-12">
        <AnimatePresence mode="wait">
          {phase === "setup_complete" && <SetupView key="setup" onStart={() => setPhase("confirm_analysis")} />}
          {phase === "analysis_started" && <AnalysisView key="analysis" progress={progress} elapsed={elapsed} />}
          {phase === "analysis_complete" && <CompleteView key="complete" />}
          {phase === "analysis_error" && <ErrorView key="error" onRetry={startAnalysis} />}
        </AnimatePresence>
      </main>
      <AnimatePresence>
        {phase === "confirm_analysis" && <ConfirmModal onBack={() => setPhase("setup_complete")} onStart={startAnalysis} />}
      </AnimatePresence>
    </div>;
};
const SetupView = ({
  onStart
}: {
  onStart: () => void;
}) => <motion.div initial={{
  opacity: 0,
  y: 24
}} animate={{
  opacity: 1,
  y: 0
}} exit={{
  opacity: 0,
  y: -10
}} transition={{
  duration: 0.45
}}>
  
    <section className="text-center">
      <p className="text-xs font-medium uppercase tracking-[.18em] text-foreground">
        05 / 05 · Company Setup
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
        You're all set.
      </h1>
      <p className="mt-3 text-lg text-foreground">
        Your Lulu AI workspace is ready.
      </p>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">
        You've completed your initial company setup. Lulu AI now has the
        information it needs to begin building your business intelligence
        foundation.
      </p>
      <FlowDiagram />
    </section>
    <section className="mt-8 rounded-xl border border-border bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Setup</h2>
        <span className="rounded-full border border-chart-4/20 bg-chart-4/10 px-2 py-0.5 text-xs text-chart-4">
          All complete
        </span>
      </div>
      <div className="mt-3">
        {setupRows.map(row => <div key={row.name} className="flex items-center justify-between gap-3 border-b border-border py-3.5 last:border-0">
        
            <div className="flex min-w-0 items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-foreground" />
              <span className="truncate text-sm font-medium text-foreground">
                {row.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden rounded-full bg-secondary/10 px-2 py-0.5 text-xs text-foreground sm:inline">
                {row.status}
              </span>
              <button className="text-xs text-foreground underline underline-offset-2 transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">
                Edit
              </button>
            </div>
          </div>)}
      </div>
    </section>
    <section className="mt-4 flex items-start gap-4 rounded-xl border border-border bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
      <CheckCircle2 size={32} className="shrink-0 text-foreground" />
      <div>
        <h2 className="text-lg font-semibold">Ready for Analysis</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Lulu AI has enough information to begin your initial business
          analysis.
        </p>
        <span className="mt-3 inline-block rounded-full bg-secondary/15 px-2 py-0.5 text-xs text-foreground">
          AI Readiness: High
        </span>
      </div>
    </section>
    <h2 className="mt-8 text-lg font-semibold">What happens next?</h2>
    <div className="mt-3 grid gap-3 md:grid-cols-3">
      {[{
      n: "01",
      title: "Analyze",
      icon: Brain,
      text: "Lulu AI analyzes your business information and connected platforms."
    }, {
      n: "02",
      title: "Understand",
      icon: Activity,
      text: "AI identifies important business signals, opportunities, risks and growth areas."
    }, {
      n: "03",
      title: "Recommend",
      icon: Sparkles,
      text: "Lulu AI prepares personalized insights, recommendations and priority actions."
    }].map(item => {
      const Icon = item.icon;
      return <motion.article key={item.n} initial={{
        opacity: 0,
        y: 10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: Number(item.n) * 0.08
      }} className="rounded-xl border border-border bg-[var(--card)] p-5">
          
            <Icon size={18} className="text-foreground" />
            <span className="mt-3 inline-block rounded bg-secondary/15 px-2 py-1 font-mono text-xs text-foreground">
              {item.n}
            </span>
            <h3 className="mt-3 text-sm font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {item.text}
            </p>
          </motion.article>;
    })}
    </div>
    <section className="mt-4 rounded-xl border border-border bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-6">
      <h2 className="text-lg font-semibold">Initial AI Analysis</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Lulu AI will analyze these connected data sources:
      </p>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {categories.map(category => {
        const Icon = category.icon;
        return <div key={category.label} className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-2.5 text-sm text-foreground">
            
              <Icon size={15} className="shrink-0 text-foreground" />
              <span>{category.label}</span>
            </div>;
      })}
      </div>
      <p className="mt-4 text-xs italic text-muted-foreground">
        Only sources you have provided or authorized are included.
      </p>
    </section>
    <section className="mt-4 rounded-xl border border-border bg-secondary p-4">
      <div className="flex items-start gap-3">
        <Shield size={16} className="mt-0.5 shrink-0 text-muted-foreground" />
        <div>
          <h2 className="text-sm font-semibold text-foreground">
            You're in control.
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">
            Lulu AI only uses the information and platforms you have provided or
            authorized. You can manage your integrations, permissions and AI
            settings at any time.
          </p>
          <div className="mt-3 flex gap-4">
            <button className="flex items-center gap-1 text-xs text-foreground hover:text-foreground">
              Manage Integrations <ExternalLink size={10} />
            </button>
            <button className="flex items-center gap-1 text-xs text-foreground hover:text-foreground">
              AI Settings <ExternalLink size={10} />
            </button>
          </div>
        </div>
      </div>
    </section>
    <div className="mt-8 flex flex-col items-center gap-3">
      <motion.button whileHover={{
      scale: 1.02
    }} whileTap={{
      scale: 0.98
    }} onClick={onStart} className="flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-10 py-4 text-base font-semibold text-primary-foreground shadow-lg shadow-black/25 transition-colors hover:bg-primary focus-visible:ring-2 focus-visible:ring-ring sm:w-auto">
      
        <Sparkles size={18} /> Start AI Analysis
      </motion.button>
      <div className="flex items-center gap-5 text-sm">
        <button className="text-foreground underline hover:text-foreground">
          Review Setup
        </button>
        <button className="flex items-center gap-1 text-foreground hover:text-foreground">
          Go to Dashboard <ArrowRight size={14} />
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Analysis can be started at any time from your dashboard.
      </p>
    </div>
  </motion.div>;
const FlowDiagram = () => <div aria-label="AI intelligence pipeline" className="mx-auto mt-9 w-full max-w-2xl px-0.5">
  <div className="flex w-full items-center gap-1 sm:gap-2">
    <FlowNode label="Your Business" />
    <FlowLine />
    <FlowNode label="Company Data" />
    <FlowLine />
    <FlowNode label="Lulu AI" ai />
    <FlowLine />
    <FlowNode label="AI Analysis" violet />
    <FlowLine />
    <FlowNode label="Business Intelligence" success />
  </div>
</div>;
const FlowNode = ({
  label,
  violet = false,
  success = false,
  ai = false
}: {
  label: string;
  violet?: boolean;
  success?: boolean;
  ai?: boolean;
}) => <motion.div initial={{
  opacity: 0,
  y: 8
}} animate={{
  opacity: 1,
  y: 0
}} transition={{
  duration: 0.35
}} className={`flex min-h-[70px] min-w-0 flex-[1.45] items-center justify-center rounded-2xl border px-1.5 py-2 text-center text-[10px] font-semibold leading-4 sm:min-h-[76px] sm:px-3 sm:text-xs sm:leading-5 ${success ? "border-chart-4/30 bg-chart-4/[0.05] text-chart-4" : ai ? "border-border bg-[var(--foreground)] text-[var(--background)] shadow-[0_0_24px_rgba(0,0,0,0.18)]" : violet ? "border-border/30 bg-secondary/[0.06] text-foreground" : "border-border bg-[var(--card)] text-foreground"}`}>
  {ai ? <span className="flex items-center gap-1.5"><Sparkles size={14} aria-hidden="true" />{label}</span> : label}
</motion.div>;
const FlowLine = () => <div className="relative h-px min-w-1 flex-1 bg-gradient-to-r from-border/40 to-border">
  <motion.span animate={{
    x: [0, 28],
    opacity: [0, 1, 0]
  }} transition={{
    repeat: Infinity,
    duration: 1.4
  }} className="absolute -top-[2px] left-0 h-1 w-1 rounded-full bg-primary" />
</div>;
const ConfirmModal = ({
  onBack,
  onStart
}: {
  onBack: () => void;
  onStart: () => void;
}) => {
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    first.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);
  return <motion.div initial={{
    opacity: 0
  }} animate={{
    opacity: 1
  }} exit={{
    opacity: 0
  }} className="fixed inset-0 z-50 overflow-y-auto bg-primary/60 px-4 py-8 backdrop-blur-sm">
      
      <motion.div role="dialog" aria-modal="true" aria-labelledby="confirm-title" initial={{
      opacity: 0,
      y: -16
    }} animate={{
      opacity: 1,
      y: 0
    }} className="mx-auto mt-16 max-w-lg rounded-2xl border border-border bg-[var(--card)] p-6 md:p-8">
        
        <div className="flex items-start justify-between">
          <div>
            <h2 id="confirm-title" className="text-xl font-semibold">
              Start Your AI Analysis?
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Lulu AI will analyze the business information and connected
              platforms you have authorized to create your initial business
              intelligence foundation.
            </p>
          </div>
          <button aria-label="Close dialog" onClick={onBack} className="rounded-lg p-1 text-foreground hover:bg-secondary hover:text-foreground">
            
            <X size={18} />
          </button>
        </div>
        <p className="mt-5 text-xs uppercase tracking-widest text-muted-foreground">
          Data Sources
        </p>
        <div className="mt-2 space-y-2">
          {sources.map(source => <div key={source} className="flex items-center gap-2 text-sm text-foreground">
            
              <Check size={15} className="text-foreground" />
              {source}
            </div>)}
        </div>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button ref={first} onClick={onBack} className="rounded-xl border border-border px-4 py-3 text-sm text-foreground hover:bg-secondary">
            
            Go Back
          </button>
          <button onClick={onStart} className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold hover:bg-primary text-primary-foreground">
            
            <Sparkles size={16} /> Start Analysis
          </button>
        </div>
      </motion.div>
    </motion.div>;
};
const AnalysisView = ({
  progress,
  elapsed
}: {
  progress: Progress;
  elapsed: number;
}) => <motion.div initial={{
  opacity: 0,
  y: 20
}} animate={{
  opacity: 1,
  y: 0
}} exit={{
  opacity: 0,
  y: -10
}} className="pt-8 text-center">
  
    <div className="relative mx-auto grid h-28 w-28 place-items-center">
      <div className="absolute inset-0 rounded-full border border-border/30 animate-ping opacity-20" />
      <div className="grid h-24 w-24 place-items-center rounded-full border-2 border-border animate-spin [animation-duration:3s]">
        <Sparkles size={30} className="text-foreground animate-pulse" />
      </div>
    </div>
    <h1 className="mt-8 text-2xl font-semibold">
      Your AI analysis has started.
    </h1>
    <p className="mt-2 text-muted-foreground">
      Lulu AI is now analyzing your business information
      <br className="hidden sm:block" /> and authorized data sources.
    </p>
    <section role="status" aria-live="polite" className="mx-auto mt-6 max-w-md rounded-2xl border border-border bg-[var(--card)] p-6 text-left">
    
      <h2 className="mb-4 text-xs uppercase tracking-widest text-muted-foreground">
        Analysis Progress
      </h2>
      {analysisStages.map(stage => {
      const Icon = stage.icon;
      const state = progress[stage.id];
      return <div key={stage.id} className="flex items-center gap-3 border-b border-border py-3 last:border-0">
          
            <Icon size={16} className="text-muted-foreground" />
            <span className="flex-1 text-sm text-foreground">
              {stage.label}
            </span>
            {state === "pending" && <span className="h-3 w-3 rounded-full border border-border" aria-label="Pending" />}
            {state === "running" && <span className="flex items-center gap-1.5 text-xs text-foreground">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary text-primary-foreground" />
                Analyzing...
              </span>}
            {state === "complete" && <span className="flex items-center gap-1 text-xs text-chart-4">
                <CheckCircle2 size={16} /> Complete
              </span>}
          </div>;
    })}
    </section>
    <p className="mt-5 text-xs text-muted-foreground">
      Elapsed {elapsed.toFixed(1)}s · Estimated time: less than a minute
    </p>
  </motion.div>;
const CompleteView = () => <motion.div initial={{
  opacity: 0,
  y: 20
}} animate={{
  opacity: 1,
  y: 0
}} exit={{
  opacity: 0,
  y: -10
}} className="pt-8 text-center">
  
    <motion.div initial={{
    scale: 0
  }} animate={{
    scale: 1
  }} transition={{
    type: "spring",
    stiffness: 220
  }}>
    
      <CheckCircle2 size={64} className="mx-auto text-chart-4" />
    </motion.div>
    <h1 className="mt-7 text-3xl font-semibold">
      Your AI analysis is complete.
    </h1>
    <p className="mt-2 text-muted-foreground">
      Lulu AI has finished analyzing your business
      <br className="hidden sm:block" /> and prepared your initial insights.
    </p>
    <section className="mx-auto mt-7 max-w-md rounded-2xl border border-chart-4/20 bg-chart-4/[0.05] p-5 text-left">
      {analysisStages.map(stage => <div key={stage.id} className="flex items-center gap-3 py-2 text-sm text-foreground">
      
          <CheckCircle2 size={17} className="text-chart-4" />
          {stage.label}
          <span className="ml-auto text-xs text-chart-4">Complete</span>
        </div>)}
      <p className="mt-3 text-xs text-muted-foreground">
        Analysis complete in 7.5s
      </p>
    </section>
    <button onClick={() => navigateApp(routes.onboarding.billing)} className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl bg-primary px-10 py-4 text-base font-semibold shadow-lg shadow-black/25 hover:bg-primary sm:mx-auto sm:w-auto text-primary-foreground">
      Choose your plan <ArrowRight size={18} />
    </button>
    <div className="mt-8 grid grid-cols-3 gap-2 text-center">
      {[{
      icon: Sparkles,
      title: "Insights Ready",
      tone: "text-foreground"
    }, {
      icon: Target,
      title: "Opportunities Identified",
      tone: "text-foreground"
    }, {
      icon: Shield,
      title: "Risks Assessed",
      tone: "text-foreground"
    }].map(item => {
      const Icon = item.icon;
      return <div key={item.title} className="rounded-xl border border-border bg-[var(--secondary)] p-4">
          
            <Icon size={18} className={`mx-auto ${item.tone}`} />
            <p className="mt-2 text-xs leading-4 text-foreground">
              {item.title}
            </p>
          </div>;
    })}
    </div>
  </motion.div>;
const ErrorView = ({
  onRetry
}: {
  onRetry: () => void;
}) => <motion.div initial={{
  opacity: 0,
  y: 20
}} animate={{
  opacity: 1,
  y: 0
}} className="pt-12 text-center">
  
    <AlertTriangle size={58} className="mx-auto text-foreground" />
    <h1 className="mt-7 text-2xl font-semibold">
      Analysis Couldn't Be Completed
    </h1>
    <p className="mt-2 text-muted-foreground">
      Lulu AI couldn't complete the initial analysis.
      <br />
      Your setup information is still saved.
    </p>
    <div className="mt-8 flex flex-col items-center gap-3">
      <button onClick={onRetry} className="flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold hover:bg-primary text-primary-foreground">
      
        <RefreshCcw size={17} /> Retry Analysis
      </button>
      <button className="rounded-xl border border-border px-6 py-3 text-sm text-foreground hover:bg-secondary">
        Review Connections
      </button>
      <button onClick={() => navigateApp(routes.onboarding.billing)} className="text-sm text-foreground underline">
        Continue to plan selection
      </button>
      <p className="text-xs text-muted-foreground">
        Analysis can be started again from your dashboard.
      </p>
    </div>
  </motion.div>;
