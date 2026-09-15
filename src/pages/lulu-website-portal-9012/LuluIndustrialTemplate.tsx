import type { TemplateCopy, TemplateLocale } from "./ManagedStorefrontApp";

type Props = {
  copy: TemplateCopy;
  locale: TemplateLocale;
  setLocale: (locale: TemplateLocale) => void;
  hasServices: boolean;
  hasProducts: boolean;
};

const imageRoot = "/templates/lulu-industrial";

function Placeholder({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return <div className={`relative overflow-hidden bg-[#eef0f3] ${className}`}>
    <img src={`${imageRoot}/${src}`} alt={alt} className="h-full w-full object-cover" />
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#102b50]/35 via-transparent to-[#f26904]/20" />
  </div>;
}

function Field({ label, type = "text", wide = false }: { label: string; type?: "text" | "email" | "file"; wide?: boolean }) {
  return <label className={`text-xs font-semibold uppercase tracking-[.12em] text-[#5e646c] ${wide ? "sm:col-span-2" : ""}`}>
    {label}
    <input disabled type={type} className="mt-2 h-11 w-full border border-[#dbdee2] bg-white px-3 text-sm normal-case tracking-normal text-[#5e646c] outline-none" placeholder={label} />
  </label>;
}

export function LuluIndustrialTemplate({ copy, locale, setLocale, hasServices, hasProducts }: Props) {
  const navigation = [copy.home, copy.solutions, ...(hasServices ? [copy.services] : []), ...(hasProducts ? [copy.products] : []), copy.about, copy.contact];
  const solutionCards = [
    { number: "01", title: copy.company, body: copy.companyBody },
    ...(hasServices || hasProducts ? [{ number: "02", title: hasServices && hasProducts ? `${copy.products} & ${copy.services}` : hasServices ? copy.services : copy.products, body: copy.offerBody }] : []),
    { number: "03", title: copy.trustTitle, body: copy.trustBody },
    { number: "04", title: copy.contactTitle, body: copy.contactBody },
  ];

  return <div className="mt-6 overflow-hidden border border-[#dbdee2] bg-[#fdfdfe] text-[#121921] shadow-sm">
    <div className="bg-[#181f27] px-5 py-2 text-[10px] font-semibold uppercase tracking-[.14em] text-white/75 sm:px-10">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2"><span>{copy.templateKicker}</span><span>{copy.templateMode}</span></div>
    </div>
    <header className="border-b border-[#dbdee2] bg-white px-5 py-5 sm:px-10">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-5">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center bg-[#1a3a68] text-lg font-bold text-white">L</span><div><p className="text-sm font-bold tracking-[.12em] text-[#1a3a68]">{copy.brand}</p><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-[#5e646c]">{copy.templateSubline}</p></div></div>
        <nav className="hidden flex-wrap items-center gap-5 text-xs font-semibold uppercase tracking-[.08em] text-[#5e646c] lg:flex">{navigation.map((item) => <span key={item}>{item}</span>)}</nav>
        <div className="flex items-center gap-2"><label className="sr-only" htmlFor="lulu-industrial-language">{copy.language}</label><select id="lulu-industrial-language" value={locale} onChange={(event) => setLocale(event.target.value as TemplateLocale)} className="h-9 border border-[#dbdee2] bg-white px-2 text-xs font-semibold text-[#1a3a68] outline-none"><option value="de">{copy.languageDe}</option><option value="en">{copy.languageEn}</option><option value="zh">{copy.languageZh}</option></select><span className="hidden border border-[#1a3a68] px-3 py-2 text-[10px] font-bold uppercase tracking-[.12em] text-[#1a3a68] sm:inline-flex">{copy.contact}</span></div>
      </div>
    </header>

    <section className="bg-[#1a3a68] px-5 py-10 text-white sm:px-10 sm:py-16">
      <div className="mx-auto grid max-w-[1280px] items-stretch gap-8 lg:grid-cols-[1.04fr_.96fr]">
        <div className="flex flex-col justify-center"><p className="text-xs font-semibold uppercase tracking-[.22em] text-[#f7a466]">{copy.heroEyebrow}</p><h3 className="mt-4 max-w-3xl text-4xl font-bold leading-[.95] tracking-[-.04em] sm:text-6xl">{copy.heroTitle}</h3><p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg">{copy.starterCopy}</p><div className="mt-8 flex flex-wrap gap-3"><span className="inline-flex h-11 items-center bg-[#f26904] px-5 text-sm font-bold text-white">{copy.speak}</span>{hasServices ? <span className="inline-flex h-11 items-center border border-white/40 px-5 text-sm font-bold text-white">{copy.viewServices}</span> : null}</div></div>
        <Placeholder src="hero-fasteners.jpg" alt={copy.heroImage} className="min-h-64 border-8 border-white/10 sm:min-h-80" />
      </div>
    </section>

    <section className="border-b border-[#dbdee2] bg-[#eef0f3] px-5 py-5 sm:px-10"><div className="mx-auto grid max-w-[1280px] gap-4 text-center text-xs font-bold uppercase tracking-[.12em] text-[#1a3a68] sm:grid-cols-3">{copy.trust.slice(0, 3).map((item) => <span key={item} className="border-l-2 border-[#f26904] px-3">{item}</span>)}</div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-[1280px]"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f26904]">{copy.solutions}</p><h4 className="mt-3 text-3xl font-bold leading-tight tracking-[-.03em] text-[#121921] sm:text-5xl">{copy.solutionsTitle}</h4><p className="mt-4 text-sm leading-7 text-[#5e646c]">{copy.solutionsDescription}</p></div><div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{solutionCards.map((card) => <article key={card.number} className="flex min-h-52 flex-col border border-[#dbdee2] bg-white p-5"><span className="text-xs font-bold tracking-[.12em] text-[#f26904]">{card.number}</span><h5 className="mt-8 text-xl font-bold text-[#1a3a68]">{card.title}</h5><p className="mt-3 flex-1 text-sm leading-6 text-[#5e646c]">{card.body}</p><span className="mt-5 text-xs font-bold uppercase tracking-[.1em] text-[#f26904]">{copy.more}</span></article>)}</div></div></section>

    {hasServices ? <section className="bg-[#eef0f3] px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-[1280px]"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f26904]">{copy.services}</p><h4 className="mt-3 text-3xl font-bold leading-tight text-[#1a3a68] sm:text-4xl">{copy.servicesTitle}</h4><p className="mt-3 max-w-2xl text-sm leading-7 text-[#5e646c]">{copy.servicesBody}</p><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{copy.serviceCards.map((title, index) => <article key={title} className="border border-[#dbdee2] bg-white p-5"><Placeholder src={["custom-drawing.jpg", "solar-fasteners.jpg", "large-bolts.jpg", "hero-fasteners.jpg"][index]} alt={copy.serviceImage} className="h-36" /><p className="mt-5 text-[10px] font-bold uppercase tracking-[.14em] text-[#5e646c]">{copy.serviceArea}</p><h5 className="mt-2 text-lg font-bold text-[#1a3a68]">{title}</h5><span className="mt-4 inline-flex text-xs font-bold uppercase tracking-[.1em] text-[#f26904]">{copy.view}</span></article>)}</div></div></section> : null}

    {hasProducts ? <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-[1280px]"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f26904]">{copy.products}</p><h4 className="mt-3 text-3xl font-bold leading-tight text-[#1a3a68] sm:text-4xl">{copy.productsTitle}</h4><p className="mt-3 max-w-2xl text-sm leading-7 text-[#5e646c]">{copy.productsBody}</p><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{["large-bolts.jpg", "solar-fasteners.jpg", "custom-drawing.jpg", "hero-fasteners.jpg"].map((src, index) => <article key={src} className="overflow-hidden border border-[#dbdee2] bg-white"><Placeholder src={src} alt={copy.productImage} className="h-44" /><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-[#5e646c]">{copy.productLabel}</p><h5 className="mt-2 font-bold text-[#1a3a68]">{copy.productLabel} 0{index + 1}</h5><p className="mt-3 text-sm text-[#5e646c]">{copy.priceOnRequest}</p></div></article>)}</div></div></section> : null}

    <section className="bg-[#181f27] px-5 py-12 text-white sm:px-10 sm:py-16"><div className="mx-auto grid max-w-[1280px] items-center gap-9 lg:grid-cols-[.8fr_1.2fr]"><Placeholder src="custom-drawing.jpg" alt={copy.companyImage} className="min-h-64 border border-white/15" /><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f7a466]">{copy.strengthsLabel}</p><h4 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{copy.strengthsTitle}</h4><p className="mt-4 max-w-2xl text-sm leading-7 text-white/70">{copy.strengthsBody}</p><div className="mt-7 grid gap-3 sm:grid-cols-3">{copy.strengths.map((item) => <div key={item} className="border border-white/15 bg-white/5 p-4 text-sm font-semibold">{item}</div>)}</div></div></div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-2"><Placeholder src="solar-fasteners.jpg" alt={copy.galleryImage} className="min-h-72" /><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f26904]">{copy.aboutLabel}</p><h4 className="mt-3 text-3xl font-bold leading-tight text-[#1a3a68] sm:text-4xl">{copy.aboutTitle}</h4><p className="mt-4 text-sm leading-7 text-[#5e646c]">{copy.aboutBody}</p><ul className="mt-6 grid gap-3 sm:grid-cols-2">{copy.aboutItems.map((item) => <li key={item} className="flex items-center gap-3 text-sm font-semibold text-[#1a3a68]"><span className="h-2 w-2 bg-[#f26904]" />{item}</li>)}</ul></div></div></section>

    <section className="bg-[#eef0f3] px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-[1280px]"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f26904]">{copy.processLabel}</p><h4 className="mt-3 text-3xl font-bold text-[#1a3a68] sm:text-4xl">{copy.processTitle}</h4><p className="mt-3 max-w-2xl text-sm leading-7 text-[#5e646c]">{copy.processBody}</p><div className="mt-8 grid gap-4 md:grid-cols-3">{copy.process.map((title, index) => <article key={title} className="border border-[#dbdee2] bg-white p-5"><span className="text-xs font-bold text-[#f26904]">0{index + 1}</span><h5 className="mt-5 text-xl font-bold text-[#1a3a68]">{title}</h5><p className="mt-3 text-sm leading-6 text-[#5e646c]">{copy.processStepBody}</p></article>)}</div></div></section>

    <section className="bg-[#1a3a68] px-5 py-12 text-white sm:px-10 sm:py-16"><div className="mx-auto grid max-w-[1280px] gap-9 lg:grid-cols-[1fr_.8fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f7a466]">{copy.contactLabel}</p><h4 className="mt-3 text-3xl font-bold sm:text-4xl">{copy.contactPrompt}</h4><p className="mt-4 max-w-xl text-sm leading-7 text-white/75">{copy.contactDescription}</p></div><div className="border border-white/20 bg-white/10 p-5"><p className="text-sm font-bold">{copy.helpful}</p><ul className="mt-4 grid gap-3 text-sm text-white/75">{copy.helpfulItems.map((item) => <li key={item} className="border-b border-white/15 pb-2 last:border-0">{item}</li>)}</ul></div></div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto grid max-w-[1280px] gap-10 lg:grid-cols-[.75fr_1.25fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#f26904]">{copy.messageLabel}</p><h4 className="mt-3 text-3xl font-bold text-[#1a3a68]">{copy.formTitle}</h4><p className="mt-3 text-sm leading-7 text-[#5e646c]">{copy.formBody}</p></div><div className="grid gap-4 border border-[#dbdee2] bg-white p-5 sm:grid-cols-2"><Field label={copy.name} /><Field label={copy.email} type="email" /><Field label={copy.website} /><Field label={copy.whatsapp} /><Field label={copy.file} type="file" /><label className="text-xs font-semibold uppercase tracking-[.12em] text-[#5e646c] sm:col-span-2">{copy.message}<textarea disabled rows={4} className="mt-2 w-full resize-none border border-[#dbdee2] bg-white p-3 text-sm normal-case tracking-normal text-[#5e646c] outline-none" placeholder={copy.message} /></label><span className="inline-flex h-11 w-fit items-center bg-[#f26904] px-5 text-sm font-bold text-white">{copy.send}</span></div></div></section>

    <footer className="flex flex-col gap-3 border-t border-[#dbdee2] bg-[#181f27] px-5 py-7 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-10"><span className="font-bold tracking-[.1em] text-white">{copy.footerBrand}</span><span>{copy.legal}</span><span>Powered by Lulu AI</span></footer>
  </div>;
}
