import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, BarChart2, Bell, Brain, Check, ChevronDown, ChevronUp, Clock, DollarSign, Globe, GripVertical, HelpCircle, Megaphone, MessageSquare, RotateCcw, Search, Settings, Shield, Sparkles, Target, TrendingUp, Users, X, Zap } from "lucide-react";
import { navigateApp, routes } from '../../../../routing';
const steps = ["Company Information", "Business Description", "Products & Services", "Existing Platforms", "Integrations", "AI Preferences", "Setup Complete"];
const priorities = ["Revenue Growth", "Customer Acquisition", "Customer Retention", "Profitability", "Marketing Performance", "Advertising Performance", "SEO", "GEO", "AEO", "Brand Visibility", "Market Expansion", "Operational Efficiency", "Product Growth", "Customer Experience"];
const priorityIcons: Record<string, typeof TrendingUp> = {
  "Revenue Growth": TrendingUp,
  "Customer Acquisition": Users,
  "Customer Retention": Users,
  Profitability: DollarSign,
  "Marketing Performance": Megaphone,
  "Advertising Performance": BarChart2,
  SEO: Search,
  GEO: Globe,
  AEO: Search,
  "Brand Visibility": Globe,
  "Market Expansion": Globe,
  "Operational Efficiency": Settings,
  "Product Growth": TrendingUp,
  "Customer Experience": Users
};
const approvalItems = [{
  id: "marketing",
  label: "Marketing"
}, {
  id: "advertising",
  label: "Advertising"
}, {
  id: "content",
  label: "Content"
}, {
  id: "website",
  label: "Website"
}, {
  id: "product",
  label: "Product"
}, {
  id: "customer_comms",
  label: "Customer communications"
}, {
  id: "automation",
  label: "Automation"
}, {
  id: "financial",
  label: "Financial"
}];
const notificationItems = [{
  id: "critical_risks",
  label: "Critical Risks",
  desc: "Notify me when an urgent business risk is detected."
}, {
  id: "important_opportunities",
  label: "Important Opportunities",
  desc: "Notify me about high-value opportunities."
}, {
  id: "ai_recommendations",
  label: "AI Recommendations",
  desc: "Notify me when Lulu AI has a recommendation."
}, {
  id: "ai_tasks",
  label: "AI Tasks",
  desc: "Notify me when tasks are created or need approval."
}, {
  id: "integration_issues",
  label: "Integration Issues",
  desc: "Notify me when a connected platform needs attention."
}, {
  id: "performance_changes",
  label: "Performance Changes",
  desc: "Notify me about notable performance changes."
}];
const channelItems = [{
  id: "in_app",
  label: "In-app"
}, {
  id: "email",
  label: "Email"
}, {
  id: "push",
  label: "Push"
}];
const languages = [{
  id: "en",
  label: "English"
}, {
  id: "es",
  label: "Spanish"
}, {
  id: "fr",
  label: "French"
}, {
  id: "de",
  label: "German"
}, {
  id: "it",
  label: "Italian"
}, {
  id: "pt",
  label: "Portuguese"
}, {
  id: "nl",
  label: "Dutch"
}, {
  id: "pl",
  label: "Polish"
}, {
  id: "sv",
  label: "Swedish"
}, {
  id: "da",
  label: "Danish"
}, {
  id: "no",
  label: "Norwegian"
}, {
  id: "fi",
  label: "Finnish"
}, {
  id: "ja",
  label: "Japanese"
}, {
  id: "zh",
  label: "Chinese (Simplified)"
}, {
  id: "ar",
  label: "Arabic"
}];
const inputClass = "w-full rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-border focus:ring-2 focus:ring-ring/20";
const titleCase = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
type Choice = {
  id: string;
  label: string;
  desc?: string;
};
const choices: Record<string, Choice[]> = {
  recommendation: [{
    id: "conservative",
    label: "Conservative",
    desc: "Prioritise stability and proven approaches."
  }, {
    id: "balanced",
    label: "Balanced",
    desc: "Balance opportunity with sensible caution."
  }, {
    id: "aggressive",
    label: "Aggressive",
    desc: "Prioritise ambitious growth opportunities."
  }],
  risk: [{
    id: "low",
    label: "Low",
    desc: "Prefer predictable, lower-risk opportunities."
  }, {
    id: "moderate",
    label: "Moderate",
    desc: "Balance potential reward and risk."
  }, {
    id: "high",
    label: "High",
    desc: "Consider bolder opportunities and outcomes."
  }],
  communication: [{
    id: "concise",
    label: "Concise",
    desc: "Short, focused updates with the essentials."
  }, {
    id: "balanced",
    label: "Balanced",
    desc: "A clear summary with useful context."
  }, {
    id: "detailed",
    label: "Detailed",
    desc: "Thorough explanations and supporting detail."
  }],
  insight: [{
    id: "executive",
    label: "Executive",
    desc: "High-level decisions and outcomes."
  }, {
    id: "standard",
    label: "Standard",
    desc: "A practical view with relevant context."
  }, {
    id: "detailed",
    label: "Detailed",
    desc: "Deep analysis, sources and supporting data."
  }]
};
export function LuluAIPreferences() {
  const [selected, setSelected] = useState(["Revenue Growth", "Customer Acquisition", "SEO", "Marketing Performance"]);
  const [order, setOrder] = useState(["Revenue Growth", "Customer Acquisition", "SEO", "Marketing Performance"]);
  const [recommendation, setRecommendation] = useState("balanced");
  const [risk, setRisk] = useState("moderate");
  const [action, setAction] = useState("advisory");
  const [communication, setCommunication] = useState("balanced");
  const [insight, setInsight] = useState("standard");
  const [frequency, setFrequency] = useState("only_important");
  const [task, setTask] = useState("recommend");
  const [detect, setDetect] = useState({
    opportunity: true,
    risk: true,
    anomaly: true,
    content: true
  });
  const [searchPriority, setSearchPriority] = useState({
    SEO: "medium",
    GEO: "medium",
    AEO: "medium"
  });
  const [approvals, setApprovals] = useState<Record<string, string>>({
    marketing: "ask_high_impact",
    advertising: "ask_high_impact",
    content: "always_ask",
    website: "always_ask",
    product: "always_ask",
    customer_comms: "always_ask",
    automation: "ask_high_impact",
    financial: "always_ask"
  });
  const [threshold, setThreshold] = useState("500");
  const [notifications, setNotifications] = useState({
    critical_risks: true,
    important_opportunities: true,
    ai_recommendations: true,
    ai_tasks: true,
    integration_issues: true,
    performance_changes: false
  });
  const [channels, setChannels] = useState({
    in_app: true,
    email: true,
    push: false
  });
  const [businessHours, setBusinessHours] = useState(false);
  const [timezone, setTimezone] = useState("Europe/London");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("18:00");
  const [days, setDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [language, setLanguage] = useState("en");
  const [transparency, setTransparency] = useState({
    insights: true,
    recommendations: true,
    content: true,
    labels: true,
    data: true
  });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    priorities: true,
    behavior: true,
    communication: true,
    capabilities: true,
    visibility: true,
    notifications: true,
    language: true
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(true);
  const [toast, setToast] = useState("");
  const [resetModal, setResetModal] = useState(false);
  const [saveError, setSaveError] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 800);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(""), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);
  const touch = useCallback(() => {
    setSaving(true);
    setSaved(false);
    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
    }, 1000);
  }, []);
  const toggle = (key: keyof typeof detect) => {
    setDetect(v => ({
      ...v,
      [key]: !v[key]
    }));
    touch();
  };
  const toggleMap = (key: string, setter: (v: any) => void) => {
    setter((v: Record<string, boolean>) => ({
      ...v,
      [key]: !v[key]
    }));
    touch();
  };
  const reset = () => {
    setSelected(["Revenue Growth", "Customer Acquisition", "SEO", "Marketing Performance"]);
    setOrder(["Revenue Growth", "Customer Acquisition", "SEO", "Marketing Performance"]);
    setRecommendation("balanced");
    setRisk("moderate");
    setAction("advisory");
    setCommunication("balanced");
    setInsight("standard");
    setFrequency("only_important");
    setTask("recommend");
    setDetect({
      opportunity: true,
      risk: true,
      anomaly: true,
      content: true
    });
    setSearchPriority({
      SEO: "medium",
      GEO: "medium",
      AEO: "medium"
    });
    setResetModal(false);
    setToast("Preferences reset to recommended");
    touch();
  };
  const move = (i: number, dir: number) => {
    const next = [...order];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    touch();
  };
  const Section = ({
    id,
    icon: Icon,
    title,
    summary,
    children
  }: {
    id: string;
    icon: typeof Brain;
    title: string;
    summary: string;
    children: React.ReactNode;
  }) => <section className="overflow-hidden rounded-xl border border-border bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-6">
      <button type="button" onClick={() => setExpanded(v => ({
      ...v,
      [id]: !v[id]
    }))} className="flex w-full items-center justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-secondary/15 text-foreground">
            <Icon size={18} />
          </span>
          <span>
            <strong className="block text-base font-semibold text-foreground">
              {title}
            </strong>
            <span className="mt-1 block truncate text-xs text-muted-foreground">
              {expanded[id] ? "" : summary}
            </span>
          </span>
        </span>
        {expanded[id] ? <ChevronUp size={17} className="text-muted-foreground" /> : <ChevronDown size={17} className="text-muted-foreground" />}
      </button>
      <AnimatePresence initial={false}>
        {expanded[id] && <motion.div initial={{
        height: 0,
        opacity: 0
      }} animate={{
        height: "auto",
        opacity: 1
      }} exit={{
        height: 0,
        opacity: 0
      }} className="overflow-hidden">
        
            <div className="mt-6 border-t border-border pt-6">{children}</div>
          </motion.div>}
      </AnimatePresence>
    </section>;
  const Toggle = ({
    on,
    label
  }: {
    on: boolean;
    label: string;
  }) => <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => touch()} className={`relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${on ? "bg-primary" : "bg-secondary"}`}>
    
      <span className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-card transition-transform ${on ? "translate-x-5" : ""}`} />
    
    </button>;
  const OptionCards = ({
    kind,
    value,
    setValue
  }: {
    kind: string;
    value: string;
    setValue: (v: string) => void;
  }) => <div className="grid gap-3 md:grid-cols-3" role="radiogroup">
      {choices[kind].map(option => <button type="button" key={option.id} role="radio" aria-checked={value === option.id} onClick={() => {
      setValue(option.id);
      touch();
    }} className={`rounded-xl border p-4 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${value === option.id ? "border-border bg-secondary/[0.08]" : "border-border bg-secondary hover:border-border/30"}`}>
      
          <span className="flex items-center justify-between text-sm font-medium text-foreground">
            {option.label}
            {value === option.id && <Check size={15} className="text-foreground" />}
          </span>
          <span className="mt-2 block text-xs leading-5 text-muted-foreground">
            {option.desc}
          </span>
        </button>)}
    </div>;
  if (loading) return <main className="min-h-screen bg-[var(--background)] px-5 text-foreground">
        <div className="mx-auto max-w-[1100px] animate-pulse py-6">
          <div className="h-8 w-28 rounded bg-secondary" />
          <div className="mt-10 h-3 rounded bg-secondary" />
          <div className="mt-14 h-12 w-2/5 rounded bg-secondary" />
          <div className="mt-5 h-4 w-3/5 rounded bg-secondary" />
          {[1, 2, 3, 4].map(n => <div key={n} className="mt-8 h-48 rounded-xl bg-secondary" />)}
        </div>
      </main>;
  if (saveError) return <main className="grid min-h-screen place-items-center bg-[var(--background)] p-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            AI Preferences Couldn't Be Saved
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We couldn't save your configuration. Your current settings have been
            preserved.
          </p>
          <button onClick={() => {
        setSaveError(false);
        touch();
      }} className="mt-6 rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
          
            Try Again
          </button>
        </div>
      </main>;
  return <main className="min-h-screen bg-[var(--background)] text-foreground selection:bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-[var(--background)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-5 md:px-8">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
              L
            </div>
            <span className="text-xl font-semibold tracking-[-0.03em] text-foreground">
              Lulu AI
            </span>
          </div>
          <div role="status" className="flex items-center gap-2 text-xs text-muted-foreground">
            
            {saving ? <Clock size={13} className="animate-spin text-foreground" /> : <Check size={13} className="text-foreground" />}
            <span>
              {saving ? "Saving..." : saved ? "Saved" : "Unsaved changes"}
            </span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-5 pb-16 md:px-8">
        <nav aria-label="Setup progress" className="py-6">
          <div className="mb-3 flex justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
              Company setup
            </span>
            <span className="text-xs font-medium text-foreground">
              Step 6 of 7
            </span>
          </div>
          <ol className="grid grid-cols-7 gap-1.5">
            {steps.map((step, i) => <li key={step} className="min-w-0">
                <span className={`block h-1.5 rounded-full ${i <= 5 ? "bg-primary" : "bg-secondary"}`} title={step} />
              
                <span className="sr-only">{step}</span>
              </li>)}
          </ol>
        </nav>
        <section className="py-10">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">
                06 / 07 · Intelligent configuration
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              Configure Lulu AI
            </h1>
            <p className="mt-3 text-base leading-7 text-muted-foreground">
              Choose how Lulu AI should prioritize insights, recommendations and
              actions for your business.
            </p>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:p-6">
          <div className="flex gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary/15 text-foreground">
              <Brain size={19} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Make Lulu AI work the way you need
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                These preferences help Lulu AI understand what matters most to
                your business. You can change them at any time in Settings.
              </p>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-border/20 bg-secondary/[0.06] p-3 text-sm text-foreground">
            <span aria-hidden="true">✓ </span>Recommended defaults are already
            configured for you.
          </div>
        </section>
        <section className="mt-5 rounded-xl border border-border bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-foreground" />
            <h2 className="text-base font-semibold text-foreground">
              Recommended Configuration
            </h2>
            <span className="rounded-full bg-secondary/15 px-2 py-1 text-[11px] text-foreground">
              Default
            </span>
          </div>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {["Balanced recommendations", "Moderate risk tolerance", "Advisory AI actions", "Important notifications", "Opportunity detection on", "Risk detection on", "Anomaly detection on"].map(item => <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-sm text-foreground">
              
                <Check size={14} className="text-foreground" />
                {item}
              </div>)}
          </div>
          <button onClick={reset} className="mt-4 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-border">
            
            Use Recommended Settings
          </button>
        </section>
        <div className="mt-8 space-y-5">
          <Section id="priorities" icon={Target} title="Business Priorities" summary={`${selected.length} priorities selected`}>
            
            <h3 className="text-sm font-medium text-foreground">
              What matters most to your business?
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Select your top business priorities. Lulu AI will weight its
              recommendations accordingly.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
              {priorities.map(item => {
              const Icon = priorityIcons[item];
              const isOn = selected.includes(item);
              return <button key={item} type="button" onClick={() => {
                const next = isOn ? selected.filter(v => v !== item) : [...selected, item];
                setSelected(next);
                setOrder(next);
                touch();
              }} className={`relative rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${isOn ? "border-border bg-secondary/[0.08] text-foreground" : "border-border bg-secondary text-foreground hover:border-border/30 hover:text-foreground"}`}>
                    
                    <Icon size={15} className="mb-2 text-foreground" />
                    <span className="block text-xs leading-4">{item}</span>
                    {isOn && <Check size={12} className="absolute right-2 top-2 text-foreground" />}
                  </button>;
            })}
            </div>
            {order.length > 1 && <div className="mt-7">
                <h3 className="text-sm font-medium text-foreground">
                  Priority ranking
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Drag to reorder, or use arrows. Lulu AI uses this order to
                  prioritize recommendations.
                </p>
                <div className="mt-3 space-y-2">
                  {order.map((item, i) => <div key={item} className="flex items-center gap-3 rounded-xl border border-border bg-secondary p-3">
                  
                      <GripVertical size={16} aria-label="Drag to reorder" className="text-muted-foreground" />
                  
                      <span className="rounded bg-secondary/15 px-2 py-1 font-mono text-xs text-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1 text-sm text-foreground">
                        {item}
                      </span>
                      <button aria-label="Move up" onClick={() => move(i, -1)} className="rounded border border-border p-1.5 text-foreground hover:text-foreground">
                    
                        <ArrowUp size={14} />
                      </button>
                      <button aria-label="Move down" onClick={() => move(i, 1)} className="rounded border border-border p-1.5 text-foreground hover:text-foreground">
                    
                        <ArrowDown size={14} />
                      </button>
                    </div>)}
                </div>
              </div>}
          </Section>
          <Section id="behavior" icon={Zap} title="AI Behavior" summary={`${titleCase(recommendation)} recommendations · ${titleCase(action)} actions`}>
            
            <div className="space-y-7">
              <div>
                <h3 className="mb-3 text-sm font-medium text-foreground">
                  Recommendation Style
                </h3>
                <OptionCards kind="recommendation" value={recommendation} setValue={setRecommendation} />
                
                <p className="mt-3 text-xs text-muted-foreground">
                  Recommendations describe potential opportunities. Outcomes are
                  not guaranteed.
                </p>
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-foreground">
                  Risk Tolerance
                </h3>
                <OptionCards kind="risk" value={risk} setValue={setRisk} />
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-foreground">
                  AI Action Level
                </h3>
                <div className="space-y-2" role="radiogroup">
                  {[{
                  id: "advisory",
                  label: "Advisory",
                  desc: "Lulu AI provides insights and recommendations. You decide what happens next."
                }, {
                  id: "assisted",
                  label: "Assisted",
                  desc: "Lulu AI can prepare tasks, campaigns and actions for your approval."
                }, {
                  id: "automated",
                  label: "Automated",
                  desc: "Lulu AI may execute supported actions automatically within configured permissions and safeguards."
                }].map(item => <button key={item.id} type="button" role="radio" aria-checked={action === item.id} onClick={() => {
                  setAction(item.id);
                  touch();
                }} className={`w-full rounded-xl border p-4 text-left ${action === item.id ? "border-border bg-secondary/[0.08]" : "border-border bg-secondary"}`}>
                    
                      <span className="flex items-center gap-2 text-sm font-medium text-foreground">
                        {item.label}
                        {item.id === "advisory" && <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] text-foreground">
                            Default
                          </span>}
                        {action === item.id && <Check size={15} className="ml-auto text-foreground" />}
                      </span>
                      <span className="mt-2 block text-sm text-muted-foreground">
                        {item.desc}
                      </span>
                    </button>)}
                </div>
                {action === "automated" && <div className="mt-3 rounded-lg bg-secondary/10 p-3 text-sm text-foreground">
                    Automated actions are only available for integrations that
                    support write access. All actions are logged and auditable.
                  </div>}
              </div>
              <AnimatePresence>
                {action !== "advisory" && <motion.div initial={{
                opacity: 0,
                height: 0
              }} animate={{
                opacity: 1,
                height: "auto"
              }} exit={{
                opacity: 0,
                height: 0
              }} className="overflow-hidden">
                  
                    <h3 className="mb-3 text-sm font-medium text-foreground">
                      Approval Preferences
                    </h3>
                    <div className="divide-y divide-white/[0.07] rounded-xl border border-border">
                      {approvalItems.map(item => <div key={item.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
                      
                          <span className="text-sm text-foreground">
                            {item.label}
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {[["always_ask", "Always ask"], ["ask_high_impact", "Ask high-impact"], ["auto", "Allow automatic"]].map(([id, label]) => <button key={id} role="radio" aria-checked={approvals[item.id] === id} onClick={() => {
                        setApprovals(v => ({
                          ...v,
                          [item.id]: id
                        }));
                        touch();
                      }} className={`rounded-full border px-2.5 py-1 text-[11px] ${approvals[item.id] === id ? "border-border bg-secondary/15 text-foreground" : "border-border text-foreground"}`}>
                          
                                {label}
                              </button>)}
                          </div>
                        </div>)}
                    </div>
                    <div className="mt-5">
                      <label className="text-sm text-foreground">
                        Require approval for actions estimated to affect more
                        than:
                      </label>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {["100", "500", "1000", "5000", "custom", "none"].map(value => <button key={value} onClick={() => {
                      setThreshold(value);
                      touch();
                    }} className={`rounded-lg border px-3 py-2 text-xs ${threshold === value ? "border-border bg-secondary/15 text-foreground" : "border-border text-foreground"}`}>
                          
                              {value === "none" ? "No threshold" : value === "custom" ? "Custom" : `€${Number(value).toLocaleString()}`}
                            </button>)}
                      </div>
                      {threshold === "custom" && <input aria-label="Custom threshold" className={`${inputClass} mt-3 max-w-xs`} value={threshold} onChange={e => setThreshold(e.target.value)} placeholder="Amount" />}
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Estimated impact values are indicative only.
                    </p>
                  </motion.div>}
              </AnimatePresence>
            </div>
          </Section>
          <Section id="communication" icon={MessageSquare} title="Communication & Reporting" summary={`${titleCase(communication)} communication · ${titleCase(frequency)} updates`}>
            
            <div className="space-y-7">
              <div>
                <h3 className="mb-3 text-sm font-medium text-foreground">
                  Communication Style
                </h3>
                <OptionCards kind="communication" value={communication} setValue={setCommunication} />
                
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-foreground">
                  Insight Detail Level
                </h3>
                <OptionCards kind="insight" value={insight} setValue={setInsight} />
                
              </div>
              <div>
                <h3 className="mb-3 text-sm font-medium text-foreground">
                  Recommendation Frequency
                </h3>
                <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4" role="radiogroup">
                  
                  {[["only_important", "Only when important"], ["daily", "Daily"], ["weekly", "Weekly"], ["as_insights_occur", "As insights occur"]].map(([id, label]) => <button key={id} role="radio" aria-checked={frequency === id} onClick={() => {
                  setFrequency(id);
                  touch();
                }} className={`rounded-xl border p-3 text-left text-sm ${frequency === id ? "border-border bg-secondary/[0.08] text-foreground" : "border-border text-foreground"}`}>
                    
                      {label}
                    </button>)}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  You can change notification behavior in Settings.
                </p>
              </div>
            </div>
          </Section>
          <Section id="capabilities" icon={Sparkles} title="AI Capabilities" summary="Detection and content generation controls">
            
            <div>
              <h3 className="text-sm font-medium text-foreground">
                AI Task Creation
              </h3>
              <div className="mt-3 grid gap-2 md:grid-cols-3">
                {[["off", "Off"], ["recommend", "Recommend Tasks"], ["auto", "Create Tasks Automatically"]].map(([id, label]) => <button key={id} onClick={() => {
                setTask(id);
                touch();
              }} className={`rounded-xl border p-3 text-left text-sm ${task === id ? "border-border bg-secondary/[0.08] text-foreground" : "border-border text-foreground"}`}>
                  
                    {label}
                  </button>)}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {task === "off" ? "Lulu AI will not create tasks." : task === "auto" ? "Tasks can be created automatically within your permissions." : "Lulu AI recommends tasks for your review."}
              </p>
            </div>
            <div className="mt-6 divide-y divide-white/[0.07]">
              {[{
              key: "opportunity",
              label: "Opportunity Detection",
              desc: "Allow Lulu AI to identify potential growth, marketing and operational opportunities."
            }, {
              key: "risk",
              label: "Risk Detection",
              desc: "Allow Lulu AI to identify potential business, marketing and operational risks."
            }, {
              key: "anomaly",
              label: "Anomaly Detection",
              desc: "Identify unusual changes in business performance and connected data."
            }, {
              key: "content",
              label: "AI Content Generation",
              desc: "Generate content suggestions for marketing, SEO, GEO and AEO workflows. Subject to your approval and publishing permissions."
            }].map(item => <div key={item.key} className="flex items-start justify-between gap-5 py-4">
                
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {item.label}
                    </h3>
                    <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <div onClick={() => toggle(item.key as keyof typeof detect)}>
                    <Toggle on={detect[item.key as keyof typeof detect]} label={item.label} />
                  
                  </div>
                </div>)}
            </div>
          </Section>
          <Section id="visibility" icon={Search} title="Search Visibility" summary="SEO, GEO and AEO priorities configured">
            
            <div className="space-y-2">
              {[{
              id: "SEO",
              desc: "Traditional search engine visibility and organic ranking."
            }, {
              id: "GEO",
              desc: "Visibility and discoverability within generative AI experiences."
            }, {
              id: "AEO",
              desc: "Optimization for answer engines and direct-answer experiences."
            }].map(item => <div key={item.id} className="flex flex-col gap-3 border-b border-border py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
                
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      {item.id}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {["low", "medium", "high"].map(value => <button key={value} onClick={() => {
                  setSearchPriority(v => ({
                    ...v,
                    [item.id]: value
                  }));
                  touch();
                }} className={`rounded-full border px-3 py-1 text-xs capitalize ${searchPriority[item.id as keyof typeof searchPriority] === value ? "border-border bg-primary text-primary-foreground" : "border-border bg-secondary text-primary-foreground"} text-primary-foreground`}>
                    
                        {value}
                      </button>)}
                  </div>
                </div>)}
            </div>
          </Section>
          <Section id="notifications" icon={Bell} title="Notifications" summary="Important events via in-app and email">
            
            <h3 className="text-sm font-medium text-foreground">
              Notification Preferences
            </h3>
            <div className="mt-2 divide-y divide-white/[0.07]">
              {notificationItems.map(item => <div key={item.id} className="flex items-start justify-between gap-5 py-4">
                
                  <div>
                    <p className="text-sm text-foreground">{item.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <div onClick={() => toggleMap(item.id, setNotifications)}>
                    <Toggle on={notifications[item.id as keyof typeof notifications]} label={item.label} />
                  
                  </div>
                </div>)}
            </div>
            <h3 className="mt-6 text-sm font-medium text-foreground">
              Notification Channels
            </h3>
            <div className="mt-2 divide-y divide-white/[0.07]">
              {channelItems.map(item => <div key={item.id} className="flex items-center justify-between py-3">
                
                  <span className="text-sm text-foreground">{item.label}</span>
                  <div onClick={() => toggleMap(item.id, setChannels)}>
                    <Toggle on={channels[item.id as keyof typeof channels]} label={item.label} />
                  
                  </div>
                </div>)}
            </div>
            <div className="mt-6 rounded-xl border border-border bg-secondary p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    Configure when non-critical notifications are delivered
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Business hours
                  </p>
                </div>
                <Toggle on={businessHours} label="Enable Business Hours" />
              </div>
              <button type="button" onClick={() => {
              setBusinessHours(v => !v);
              touch();
            }} className="sr-only">
                
                Toggle business hours
              </button>
              {businessHours && <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs text-muted-foreground">
                    Timezone
                    <select className={`${inputClass} mt-1`} value={timezone} onChange={e => {
                  setTimezone(e.target.value);
                  touch();
                }}>
                    
                      <option>Europe/London</option>
                      <option>America/New_York</option>
                      <option>America/Los_Angeles</option>
                      <option>Asia/Tokyo</option>
                    </select>
                  </label>
                  <label className="text-xs text-muted-foreground">
                    Start time
                    <input type="time" className={`${inputClass} mt-1`} value={start} onChange={e => setStart(e.target.value)} />
                  
                  </label>
                  <label className="text-xs text-muted-foreground">
                    End time
                    <input type="time" className={`${inputClass} mt-1`} value={end} onChange={e => setEnd(e.target.value)} />
                  
                  </label>
                  <div className="text-xs text-muted-foreground">
                    Working days
                    <div className="mt-2 flex flex-wrap gap-1">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => <button key={day} onClick={() => setDays(v => v.includes(day) ? v.filter(d => d !== day) : [...v, day])} className={`rounded-full px-2.5 py-1 ${days.includes(day) ? "bg-primary text-primary-foreground" : "bg-secondary text-primary-foreground"}`}>
                        
                            {day}
                          </button>)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground sm:col-span-2">
                    Critical events may still require immediate notification.
                  </p>
                </div>}
            </div>
          </Section>
          <Section id="language" icon={Globe} title="Language & Transparency" summary={`${languages.find(v => v.id === language)?.label} responses · labels on`}>
            
            <label className="block text-sm text-foreground">
              AI Response Language
              <select className={`${inputClass} mt-2 max-w-md`} value={language} onChange={e => {
              setLanguage(e.target.value);
              touch();
            }}>
                
                {languages.map(item => <option key={item.id} value={item.id}>
                    {item.label}
                  </option>)}
              </select>
            </label>
            <div className="mt-6 divide-y divide-white/[0.07]">
              {[{
              key: "insights",
              label: "Business insights",
              desc: "Use connected data to generate business analysis and insights."
            }, {
              key: "recommendations",
              label: "AI recommendations",
              desc: "Use connected data to personalise AI recommendations."
            }, {
              key: "content",
              label: "AI-generated content",
              desc: "Use connected data to inform AI content suggestions."
            }, {
              key: "labels",
              label: "Show AI-generated labels",
              desc: "Label AI-generated content, recommendations and summaries."
            }, {
              key: "data",
              label: "Show supporting data",
              desc: "Display the data sources Lulu AI uses to generate insights."
            }].map(item => <div key={item.key} className="flex items-start justify-between gap-5 py-4">
                
                  <div>
                    <p className="text-sm text-foreground">{item.label}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                  <div onClick={() => toggleMap(item.key, setTransparency)}>
                    <Toggle on={transparency[item.key as keyof typeof transparency]} label={item.label} />
                  
                  </div>
                </div>)}
            </div>
          </Section>
        </div>
        <section className="mt-5 rounded-xl border border-border bg-[var(--card)] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-3">
            <Sparkles size={18} className="text-foreground" />
            <h2 className="text-base font-semibold text-foreground">
              Your AI Configuration
            </h2>
            <span className="rounded-full bg-secondary px-2 py-1 text-[11px] text-muted-foreground">
              Live summary
            </span>
          </div>
          <div className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {[["Primary Focus", order[0] || "Not set"], ["Priorities", `${selected.length} · ${selected.join(", ") || "Not set"}`], ["Recommendation Style", titleCase(recommendation)], ["Risk Tolerance", titleCase(risk)], ["AI Action Level", titleCase(action)], ["Task Creation", task === "recommend" ? "Recommend Tasks" : titleCase(task)], ["Opportunity Detection", detect.opportunity ? "On" : "Off"], ["Risk Detection", detect.risk ? "On" : "Off"], ["Anomaly Detection", detect.anomaly ? "On" : "Off"], ["Content Generation", detect.content ? "On" : "Off"], ["SEO / GEO / AEO", `${searchPriority.SEO} / ${searchPriority.GEO} / ${searchPriority.AEO}`], ["Communication Style", titleCase(communication)], ["Language", languages.find(v => v.id === language)?.label || "English"]].map(item => <div key={item[0]}>
                <p className="text-xs text-muted-foreground">{item[0]}</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {item[1]}
                </p>
              </div>)}
          </div>
        </section>
        <button onClick={() => setResetModal(true)} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-foreground hover:border-border hover:text-foreground">
          
          <RotateCcw size={15} />
          Reset to Recommended
        </button>
        <section className="mt-8 grid gap-5 md:grid-cols-2">
          <article className="rounded-xl border border-border bg-secondary p-5">
            <div className="flex gap-3">
              <HelpCircle size={19} className="text-muted-foreground" />
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  How do AI Preferences affect Lulu AI?
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your preferences influence which insights Lulu AI prioritizes,
                  how recommendations are presented and how much autonomy
                  supported AI actions can have.
                </p>
              </div>
            </div>
          </article>
          <article className="rounded-xl border border-border/20 bg-secondary/[0.05] p-5">
            <div className="flex gap-3">
              <Shield size={19} className="text-foreground" />
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  You're in Control
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  AI Preferences can be changed at any time. Higher-autonomy
                  settings should only be enabled when you are comfortable
                  allowing supported actions to be performed automatically.
                </p>
              </div>
            </div>
          </article>
        </section>
        <footer className="mt-10 flex flex-col-reverse items-stretch gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={() => navigateApp(routes.onboarding.existingPlatforms)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm text-foreground hover:border-border">
            <ArrowLeft size={16} />
            Back
          </button>
          <button onClick={() => navigateApp(routes.app.dashboard)} className="text-sm text-foreground hover:text-foreground">
            
            Skip Setup
          </button>
          <button onClick={() => navigateApp(routes.onboarding.setupComplete)} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary">
            
            Continue
            <ArrowRight size={16} />
          </button>
        </footer>
      </div>
      <AnimatePresence>
        {toast && <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 20
      }} role="status" className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-border/30 bg-[var(--card)] px-4 py-2.5 text-sm text-foreground shadow-xl">
          
            <Check size={15} className="text-foreground" />
            {toast}
          </motion.div>}
      </AnimatePresence>
      <AnimatePresence>
        {resetModal && <motion.div className="fixed inset-0 z-50 grid place-items-center bg-primary/70 p-5" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }}>
          
            <div role="dialog" aria-modal="true" aria-labelledby="reset-title" className="w-full max-w-md rounded-2xl border border-border bg-[var(--secondary)] p-6">
            
              <div className="flex justify-between">
                <h2 id="reset-title" className="text-xl font-semibold text-foreground">
                
                  Reset AI Preferences?
                </h2>
                <button aria-label="Close" onClick={() => setResetModal(false)} className="text-foreground hover:text-foreground">
                
                  <X size={18} />
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your current preferences will be replaced with Lulu AI's
                recommended configuration.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setResetModal(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm text-foreground">
                
                  Cancel
                </button>
                <button onClick={reset} className="rounded-lg bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                
                  Reset
                </button>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
    </main>;
}
