import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Bot, Check, ChevronRight, CircleDollarSign, Gauge, Globe2, Layers3, LockKeyhole, Network, Sparkles, Target, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { routes } from "../../routing";
import { agentSummaryApi, type AgentRegistrySummary } from "../../api/agent-summary";
import "./lulu-landing.css";

type Pillar = {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: typeof Bot;
  accent: "violet" | "cyan" | "mint";
  proof: string[];
};

const pillars: Pillar[] = [
  {
    id: "company-brain",
    label: "Company Brain",
    title: "Turn context into direction.",
    description: "A living operating picture connects goals, signals, knowledge and decisions before work begins.",
    icon: Network,
    accent: "violet",
    proof: ["Evidence-backed signals", "Bounded forecasts", "Shared company memory"],
  },
  {
    id: "digital-employees",
    label: "Digital Employees",
    title: "Give every function a capable operator.",
    description: "Specialists plan, collaborate and execute across the same canonical business systems your team already uses.",
    icon: Bot,
    accent: "cyan",
    proof: ["Role-based specialists", "Durable work history", "Human approval boundaries"],
  },
  {
    id: "growth-engine",
    label: "Growth Engine",
    title: "Move from activity to momentum.",
    description: "CRM, marketing, commerce and finance work together so the next best action is grounded in the whole business.",
    icon: Target,
    accent: "mint",
    proof: ["Goals and outcomes", "Cross-domain workflows", "Verified learning loops"],
  },
];

const operatingSteps = [
  { number: "01", label: "Observe", detail: "Read the real state of the business.", icon: Gauge },
  { number: "02", label: "Decide", detail: "Prioritize the highest-leverage move.", icon: Target },
  { number: "03", label: "Execute", detail: "Route work to the right specialist.", icon: Workflow },
  { number: "04", label: "Verify", detail: "Keep outcomes, evidence and learning.", icon: Check },
];

function useActiveSection() {
  const [active, setActive] = useState("vision");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-lulu-section]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) setActive(visible.target.dataset.luluSection ?? "vision");
      },
      { rootMargin: "-35% 0px -48%", threshold: [0.12, 0.35, 0.65] },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return active;
}

export default function LuluLandingPage() {
  const t = useTranslation();
  const activeSection = useActiveSection();
  const [selectedPillar, setSelectedPillar] = useState(pillars[0].id);
  const [agentSummary, setAgentSummary] = useState<AgentRegistrySummary | null>(null);
  const activePillar = pillars.find((pillar) => pillar.id === selectedPillar) ?? pillars[0];
  const ActivePillarIcon = activePillar.icon;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  useEffect(() => {
    const controller = new AbortController();
    agentSummaryApi.get(controller.signal)
      .then((response) => setAgentSummary(response.data))
      .catch((cause) => {
        if (!(cause instanceof DOMException && cause.name === "AbortError")) setAgentSummary(null);
      });
    return () => controller.abort();
  }, []);

  return (
    <main className="public-entry" aria-label={t("Lulu Growth OS public website")}>
      <div className="public-entry__atmosphere" aria-hidden="true" />
      <header className="public-entry__nav">
        <button className="public-entry__brand" type="button" onClick={() => scrollTo("vision")} aria-label={t("Back to Lulu Growth OS home")} data-lulu-local-brand="true" data-lulu-no-translate="true" translate="no">
          <img src="/branding/lulu-agentic-mark.svg" alt="" />
          <span>LULU <small>GROWTH OS</small></span>
        </button>
        <nav aria-label={t("Landing page sections")}>
          {[["vision", "The approach"], ["system", "The system"], ["operation", "The loop"]].map(([id, label]) => (
            <button key={id} type="button" className={activeSection === id ? "is-active" : ""} onClick={() => scrollTo(id)}>{t(label)}</button>
          ))}
        </nav>
        <div className="public-entry__nav-actions">
          <Link to={routes.auth.login}>{t("Sign in")}</Link>
          <Link className="public-entry__nav-cta" to={routes.auth.signUp}>{t("Enter Lulu")} <ArrowRight size={15} /></Link>
        </div>
      </header>

      <section id="vision" data-lulu-section="vision" className="public-entry__hero">
        <div className="public-entry__hero-copy">
          <p className="public-entry__eyebrow"><i /> {t("The autonomous company operating system")}</p>
          <h1>{t("Build the company")}<br /><em>{t("that keeps moving.")}</em></h1>
          <p className="public-entry__lede">{t("Lulu brings your goals, people, systems and digital employees into one clear operating rhythm.")}</p>
          <div className="public-entry__hero-actions">
            <Link className="public-entry__primary-cta" to={routes.auth.signUp}>{t("Start building")} <ArrowRight size={17} /></Link>
            <button className="public-entry__quiet-cta" type="button" onClick={() => scrollTo("system")}>{t("See the system")} <ArrowDown size={16} /></button>
          </div>
          <div className="public-entry__principles" aria-label={t("Lulu system capabilities")}>
            <span><Check size={14} /> {t("Workspace-scoped. Permission-aware. Evidence-led.")}</span>
          </div>
          {agentSummary && <div className="public-entry__agent-proof" aria-label={t("The Lulu agent ecosystem")}>
            <Bot size={16} aria-hidden="true" />
            <strong>{new Intl.NumberFormat().format(agentSummary.registeredAgents)}</strong>
            <span>{t("The Lulu agent ecosystem")}</span>
          </div>}
        </div>

        <div className="public-entry__hero-visual" role="img" aria-label={t("Lulu executive operating constellation")}>
          <img src="/landing/lulu-executive-constellation-v1.png" alt="" />
          <div className="public-entry__visual-grid" aria-hidden="true" />
          <div className="public-entry__visual-label public-entry__visual-label--top"><Sparkles size={14} /> {t("Company Brain")}<small><i /> {t("SYNCED")}</small></div>
          <div className="public-entry__visual-label public-entry__visual-label--bottom"><span /> {t("Operating with evidence")}</div>
          <div className="public-entry__visual-orbit public-entry__visual-orbit--one" aria-hidden="true" />
          <div className="public-entry__visual-orbit public-entry__visual-orbit--two" aria-hidden="true" />
        </div>
      </section>

      <section id="system" data-lulu-section="system" className="public-entry__system">
        <div className="public-entry__section-heading">
          <p className="public-entry__eyebrow"><i /> {t("One system. Every signal.")}</p>
          <h2>{t("Your business, seen as a whole.")}</h2>
          <p>{t("From the first customer signal to the verified outcome, Lulu turns disconnected work into a coordinated operating system.")}</p>
        </div>
        <div className="public-entry__capability-stage">
          <div className="public-entry__capability-rail" aria-label={t("Lulu system capabilities")}>
            {pillars.map((pillar, index) => {
              const Icon = pillar.icon;
              const selected = selectedPillar === pillar.id;
              return (
                <button key={pillar.id} aria-pressed={selected} type="button" className={selected ? "is-selected" : ""} onClick={() => setSelectedPillar(pillar.id)}>
                  <span>0{index + 1}</span><Icon size={18} /><strong>{t(pillar.label)}</strong><ChevronRight size={16} />
                </button>
              );
            })}
          </div>
          <article className={`public-entry__capability-card public-entry__capability-card--${activePillar.accent}`}>
            <div className="public-entry__capability-icon"><ActivePillarIcon size={24} /></div>
            <div>
              <p className="public-entry__eyebrow">{t(activePillar.label)}</p>
              <h3>{t(activePillar.title)}</h3>
              <p>{t(activePillar.description)}</p>
            </div>
            <ul>{activePillar.proof.map((item) => <li key={item}><Check size={14} /> {t(item)}</li>)}</ul>
          </article>
        </div>
      </section>

      <section id="operation" data-lulu-section="operation" className="public-entry__operation">
        <div className="public-entry__operation-copy">
          <p className="public-entry__eyebrow"><i /> {t("The operating loop")}</p>
          <h2>{t("From signal")}<br /><em>{t("to momentum.")}</em></h2>
          <p>{t("Autonomy should feel less like a black box and more like a trusted operating partner. Every move has context, boundaries and a visible outcome.")}</p>
          <div className="public-entry__trust-line"><LockKeyhole size={15} /> {t("Workspace-scoped. Permission-aware. Evidence-led.")}</div>
        </div>
        <div className="public-entry__loop-board" aria-label={t("The operating loop")}>
          <div className="public-entry__loop-header"><span>{t("Company Brain")}</span><span><i /> {t("LIVE COMPANY POSITION")}</span></div>
          <div className="public-entry__loop-core"><span /><span /><Sparkles size={22} /><small>{t("Company Brain")}</small></div>
          <div className="public-entry__loop-node public-entry__loop-node--top"><Globe2 size={15} />{t("Market signal")}</div>
          <div className="public-entry__loop-node public-entry__loop-node--right"><CircleDollarSign size={15} />{t("Unit economics")}</div>
          <div className="public-entry__loop-node public-entry__loop-node--bottom"><Layers3 size={15} />{t("Execution graph")}</div>
          <div className="public-entry__loop-node public-entry__loop-node--left"><Bot size={15} />{t("Digital team")}</div>
          <div className="public-entry__loop-result"><span>{t("Next best action")}</span><strong>{t("Review qualified opportunity")} <ArrowRight size={15} /></strong></div>
        </div>
        <div className="public-entry__steps">
          {operatingSteps.map(({ number, label, detail, icon: Icon }) => (
            <article key={label}><span>{number}</span><Icon size={17} /><div><strong>{t(label)}</strong><p>{t(detail)}</p></div></article>
          ))}
        </div>
      </section>

      <section className="public-entry__closing">
        <div>
          <p className="public-entry__eyebrow"><i /> {t("A calmer way to grow")}</p>
          <h2>{t("Ready to rise?")}</h2>
          <p>{t("Bring the whole company into focus. Then let the right work move forward.")}</p>
          <Link className="public-entry__primary-cta" to={routes.auth.signUp}>{t("Enter Lulu")} <ArrowRight size={17} /></Link>
        </div>
        <footer><span>{t("© Lulu Growth OS")}</span><span>{t("Built for companies with somewhere to go.")}</span><Link to={routes.auth.login}>{t("Sign in")} <ArrowRight size={14} /></Link></footer>
      </section>
    </main>
  );
}
