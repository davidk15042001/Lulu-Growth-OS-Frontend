import { useEffect, useState } from "react";
import { ArrowDown, ArrowRight, Bot, Check, ChevronRight, CircleDollarSign, Gauge, Globe2, Layers3, LockKeyhole, Network, Sparkles, Target, Workflow } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { routes } from "../../routing";
import "./lulu-landing.css";

type Pillar = {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: typeof Bot;
  accent: string;
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
      { rootMargin: "-34% 0px -48%", threshold: [0.12, 0.35, 0.65] },
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
  const activePillar = pillars.find((pillar) => pillar.id === selectedPillar) ?? pillars[0];
  const ActivePillarIcon = activePillar.icon;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="lulu-landing lulu-nova-landing" aria-label={t("Lulu Growth OS public website")}>
      <div className="lulu-landing__noise" aria-hidden="true" />
      <header className="lulu-landing__nav">
        <button className="lulu-landing__brand" type="button" onClick={() => scrollTo("vision")} aria-label={t("Back to Lulu Growth OS home")}>
          <span className="lulu-landing__brand-mark"><Sparkles size={15} strokeWidth={2.4} /></span>
          <span>LULU <em>GROWTH OS</em></span>
        </button>
        <nav aria-label={t("Landing page sections")}>
          {["vision", "system", "operation"].map((section) => (
            <button key={section} className={activeSection === section ? "is-active" : ""} type="button" onClick={() => scrollTo(section)}>
              {t(section === "vision" ? "The approach" : section === "system" ? "The system" : "The loop")}
            </button>
          ))}
        </nav>
        <div className="lulu-landing__nav-actions">
          <Link className="lulu-landing__text-link" to={routes.auth.login}>{t("Sign in")}</Link>
          <Link className="lulu-landing__nav-cta" to={routes.auth.signUp}>{t("Enter Lulu")} <ArrowRight size={15} /></Link>
        </div>
      </header>

      <section id="vision" data-lulu-section="vision" className="lulu-landing__hero">
        <div className="lulu-landing__hero-copy">
          <p className="lulu-landing__eyebrow">{t("The autonomous company operating system")}</p>
          <h1>{t("Build the company")}<br /><em>{t("that keeps moving.")}</em></h1>
          <p className="lulu-landing__hero-lede">{t("Lulu brings your goals, people, systems and digital employees into one clear operating rhythm.")}</p>
          <div className="lulu-landing__hero-actions">
            <Link className="lulu-landing__primary-cta" to={routes.auth.signUp}>{t("Start building")} <ArrowRight size={17} /></Link>
            <button className="lulu-landing__quiet-cta" type="button" onClick={() => scrollTo("system")}>{t("See the system")} <ArrowDown size={16} /></button>
          </div>
        </div>
        <div className="lulu-landing__hero-art" aria-label={t("Lulu executive operating constellation")} role="img">
          <div className="lulu-landing__hero-glow lulu-landing__hero-glow--one" />
          <div className="lulu-landing__hero-glow lulu-landing__hero-glow--two" />
          <img src="/landing/lulu-executive-constellation-v1.png" alt="" />
          <div className="lulu-landing__hero-orbit" aria-hidden="true"><span /><span /><span /></div>
          <div className="lulu-landing__hero-status"><span className="lulu-landing__status-dot" /> {t("Operating with evidence")}</div>
        </div>
        <div className="lulu-landing__scroll-cue"><span>{t("Scroll to enter")}</span><ArrowDown size={15} /></div>
      </section>

      <section id="system" data-lulu-section="system" className="lulu-landing__system">
        <div className="lulu-landing__section-intro">
          <p className="lulu-landing__eyebrow">{t("One system. Every signal.")}</p>
          <h2>{t("Your business, seen as a whole.")}</h2>
          <p>{t("From the first customer signal to the verified outcome, Lulu turns disconnected work into a coordinated operating system.")}</p>
        </div>
        <div className="lulu-landing__system-stage">
          <div className="lulu-landing__system-visual">
            <img src="/landing/lulu-growth-os-product-lineup-v1-1400.webp" alt={t("Lulu product surfaces represented as connected operating layers")} />
            <span className="lulu-landing__visual-label lulu-landing__visual-label--top">{t("Context")}</span>
            <span className="lulu-landing__visual-label lulu-landing__visual-label--right">{t("Action")}</span>
            <span className="lulu-landing__visual-label lulu-landing__visual-label--bottom">{t("Outcome")}</span>
          </div>
          <div className="lulu-landing__system-note">
            <span className="lulu-landing__note-line" />
            <p>{t("Designed for the moment when growth stops being a collection of tools and becomes a company-wide rhythm.")}</p>
          </div>
        </div>
        <div className="lulu-landing__pillars" aria-label={t("Lulu system capabilities")}>
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <button key={pillar.id} className={`lulu-landing__pillar ${selectedPillar === pillar.id ? "is-selected" : ""}`} type="button" onClick={() => setSelectedPillar(pillar.id)}>
                <Icon size={19} />
                <span>{t(pillar.label)}</span>
                <ChevronRight size={16} />
              </button>
            );
          })}
        </div>
        <article className={`lulu-landing__pillar-detail lulu-landing__pillar-detail--${activePillar.accent}`}>
          <div className="lulu-landing__pillar-detail-icon"><ActivePillarIcon size={25} /></div>
          <div>
            <p className="lulu-landing__eyebrow">{t(activePillar.label)}</p>
            <h3>{t(activePillar.title)}</h3>
            <p>{t(activePillar.description)}</p>
          </div>
          <ul>{activePillar.proof.map((item) => <li key={item}><Check size={14} /> {t(item)}</li>)}</ul>
        </article>
      </section>

      <section id="operation" data-lulu-section="operation" className="lulu-landing__operation">
        <div className="lulu-landing__operation-copy">
          <p className="lulu-landing__eyebrow">{t("The operating loop")}</p>
          <h2>{t("From signal")}<br /><em>{t("to momentum.")}</em></h2>
          <p>{t("Autonomy should feel less like a black box and more like a trusted operating partner. Every move has context, boundaries and a visible outcome.")}</p>
          <div className="lulu-landing__trust-line"><LockKeyhole size={15} /> {t("Workspace-scoped. Permission-aware. Evidence-led.")}</div>
        </div>
        <div className="lulu-landing__operation-board">
          <div className="lulu-landing__board-header"><span>{t("LIVE COMPANY POSITION")}</span><span><span className="lulu-landing__status-dot" /> {t("SYNCED")}</span></div>
          <div className="lulu-landing__board-core"><div className="lulu-landing__board-ring lulu-landing__board-ring--outer" /><div className="lulu-landing__board-ring lulu-landing__board-ring--inner" /><div className="lulu-landing__board-core-mark"><Sparkles size={22} /></div><span className="lulu-landing__board-core-label">COMPANY<br />BRAIN</span></div>
          <div className="lulu-landing__board-node lulu-landing__board-node--top"><Globe2 size={15} /><span>{t("Market signal")}</span></div>
          <div className="lulu-landing__board-node lulu-landing__board-node--right"><CircleDollarSign size={15} /><span>{t("Unit economics")}</span></div>
          <div className="lulu-landing__board-node lulu-landing__board-node--bottom"><Layers3 size={15} /><span>{t("Execution graph")}</span></div>
          <div className="lulu-landing__board-node lulu-landing__board-node--left"><Bot size={15} /><span>{t("Digital team")}</span></div>
          <div className="lulu-landing__board-footer"><span>{t("Next best action")}</span><strong>{t("Review qualified opportunity")} <ArrowRight size={15} /></strong></div>
        </div>
        <div className="lulu-landing__steps">
          {operatingSteps.map(({ number, label, detail, icon: Icon }) => <div className="lulu-landing__step" key={label}><span>{number}</span><Icon size={17} /><div><strong>{t(label)}</strong><p>{t(detail)}</p></div></div>)}
        </div>
      </section>

      <section className="lulu-landing__closing">
        <div className="lulu-landing__closing-grid" aria-hidden="true" />
        <div className="lulu-landing__closing-copy">
          <p className="lulu-landing__eyebrow">{t("A calmer way to grow")}</p>
          <h2>{t("Ready to rise?")}</h2>
          <p>{t("Bring the whole company into focus. Then let the right work move forward.")}</p>
          <Link className="lulu-landing__primary-cta" to={routes.auth.signUp}>{t("Enter Lulu")} <ArrowRight size={17} /></Link>
        </div>
        <footer className="lulu-landing__footer"><span>{t("© Lulu Growth OS")}</span><span>{t("Built for companies with somewhere to go.")}</span><Link to={routes.auth.login}>{t("Sign in")} <ArrowRight size={14} /></Link></footer>
      </section>
    </main>
  );
}
