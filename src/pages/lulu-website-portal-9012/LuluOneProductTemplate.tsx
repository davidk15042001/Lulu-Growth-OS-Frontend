import type {
  TemplateBranding,
  TemplateCatalogItem,
} from "./LuluIndustrialTemplate";

export type TemplateLocale = "de" | "en" | "zh";

const PLACEHOLDER_CUSTOMER = "CUSTOMER NAME";
const PLACEHOLDER_EMAIL = "hello@yourbrand.com";

export type OneProductTemplateData = {
  name: string;
  kicker: string;
  headline: string;
  description: string;
  price: string;
  buyLine: string;
  heroImageUrl?: string | null;
  heroImageAlt: string;
  detailImageUrl?: string | null;
  detailImageAlt: string;
  features: Array<{
    id: string;
    title: string;
    copy: string;
    variant?: "volt";
  }>;
  specs: Array<{ label: string; value: string }>;
  reviews: Array<{ quote: string; author: string }>;
  faq: Array<{ question: string; answer: string }>;
  footerEmail: string;
};

type Props = {
  data: OneProductTemplateData;
  locale: TemplateLocale;
  setLocale: (locale: TemplateLocale) => void;
  branding?: TemplateBranding;
  previewLabel?: string;
};

const TEMPLATE_UI: Record<
  TemplateLocale,
  {
    language: string;
    features: string;
    specs: string;
    reviews: string;
    faq: string;
    buy: string;
    seeTech: string;
    preview: string;
    imagePlaceholder: string;
    productPlaceholder: string;
  }
> = {
  de: {
    language: "Sprache",
    features: "Vorteile",
    specs: "Details",
    reviews: "Stimmen",
    faq: "FAQ",
    buy: "Jetzt anfragen",
    seeTech: "Details ansehen",
    preview: "Vorschau",
    imagePlaceholder: "Produktbild platzieren",
    productPlaceholder: "Produktname",
  },
  en: {
    language: "Language",
    features: "Features",
    specs: "Specs",
    reviews: "Reviews",
    faq: "FAQ",
    buy: "Request now",
    seeTech: "See the details",
    preview: "Preview",
    imagePlaceholder: "Place product image",
    productPlaceholder: "Product name",
  },
  zh: {
    language: "语言",
    features: "优势",
    specs: "详情",
    reviews: "评价",
    faq: "常见问题",
    buy: "立即咨询",
    seeTech: "查看详情",
    preview: "预览",
    imagePlaceholder: "添加产品图片",
    productPlaceholder: "产品名称",
  },
};

function PlaceholderMedia({
  label,
  detail = false,
}: {
  label: string;
  detail?: boolean;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex items-center justify-center overflow-hidden border border-dashed border-white/15 bg-white/5 ${detail ? "aspect-[4/3] rounded-[28px]" : "aspect-square rounded-[40px]"}`}
    >
      <div className="absolute inset-5 rounded-[24px] border border-white/10" />
      <div className="relative flex flex-col items-center gap-2 px-6 text-center font-mono text-xs uppercase tracking-[0.16em] text-[#9db4c4]">
        <span className="text-3xl text-[#d4ff3d]/70">+</span>
        <span>{label}</span>
      </div>
    </div>
  );
}

function ProductMedia({
  url,
  alt,
  label,
  detail = false,
}: {
  url?: string | null;
  alt: string;
  label: string;
  detail?: boolean;
}) {
  if (!url) return <PlaceholderMedia detail={detail} label={label} />;
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      className={`w-full object-cover ${detail ? "aspect-[4/3] rounded-[28px]" : "aspect-square rounded-[40px]"}`}
    />
  );
}

function languageLabel(locale: TemplateLocale) {
  return locale === "de" ? "DE" : locale === "zh" ? "中文" : "EN";
}

export function LuluOneProductTemplate({
  data,
  locale,
  setLocale,
  branding,
  previewLabel,
}: Props) {
  const labels = TEMPLATE_UI[locale];
  const brand = branding?.companyName || "YOUR BRAND";
  const nav = [
    [labels.features, "features"],
    [labels.specs, "specs"],
    [labels.reviews, "reviews"],
    [labels.faq, "faq"],
  ] as const;

  return (
    <div className="overflow-hidden bg-[#0a0f14] text-[#eaf3f8]">
      <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0f14]/75 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-5">
          <a
            href="#top"
            className="font-display text-xl tracking-wide text-[#eaf3f8]"
          >
            {brand.toUpperCase()}
          </a>
          <div className="hidden gap-7 text-sm text-[#9db4c4] md:flex">
            {nav.map(([item, target]) => (
              <a
                key={target}
                href={`#${target}`}
                className="transition-colors hover:text-[#eaf3f8]"
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {previewLabel ? (
              <span className="hidden rounded-full border border-white/10 px-3 py-1.5 text-xs text-[#9db4c4] sm:inline-flex">
                {previewLabel}
              </span>
            ) : null}
            <label className="sr-only" htmlFor="one-product-language">
              {labels.language}
            </label>
            <select
              id="one-product-language"
              value={locale}
              onChange={(event) =>
                setLocale(event.target.value as TemplateLocale)
              }
              className="h-8 rounded-full border border-white/15 bg-white/5 px-2 text-xs font-semibold text-[#eaf3f8] outline-none focus:border-[#d4ff3d]"
            >
              <option className="text-[#0a0f14]" value="de">
                {languageLabel("de")}
              </option>
              <option className="text-[#0a0f14]" value="en">
                {languageLabel("en")}
              </option>
              <option className="text-[#0a0f14]" value="zh">
                {languageLabel("zh")}
              </option>
            </select>
            <a
              href="#buy"
              aria-label={labels.buy}
              className="hidden rounded-full bg-[#d4ff3d] px-4 py-2 font-display text-sm text-[#0a0f14] transition-[filter] hover:brightness-95 sm:inline-flex"
            >
              {labels.buy}{" "}
              <span aria-hidden="true" className="ml-1">
                →
              </span>
            </a>
          </div>
        </div>
      </nav>

      <main id="top">
        <section className="relative mx-auto max-w-6xl px-5 pb-24 pt-16">
          <div className="relative grid items-center gap-10 md:grid-cols-2">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#d4ff3d]">
                {data.kicker}
              </span>
              <h1 className="mt-4 font-display text-6xl uppercase leading-[0.9] text-[#eaf3f8] md:text-7xl">
                {data.headline}
              </h1>
              <p className="mt-6 max-w-[40ch] text-pretty text-[#9db4c4]">
                {data.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#buy"
                  className="rounded-full bg-[#d4ff3d] px-6 py-3 font-display text-[#0a0f14] transition-[filter] hover:brightness-95"
                >
                  {labels.buy}{" "}
                  <span aria-hidden="true" className="ml-1">
                    →
                  </span>
                </a>
                <a
                  href="#features"
                  className="rounded-full border border-white/10 px-6 py-3 text-[#eaf3f8] transition-colors hover:bg-white/5"
                >
                  {labels.seeTech}
                </a>
              </div>
            </div>
            <div className="relative animate-[lulu-product-drift_7s_ease-in-out_infinite]">
              <div className="absolute inset-0 -rotate-6 rounded-[40px] border border-white/10 bg-white/5 backdrop-blur-xl" />
              <div className="absolute inset-0 rotate-3 rounded-[40px] border border-white/10 bg-white/5" />
              <div className="relative">
                <ProductMedia
                  url={data.heroImageUrl}
                  alt={data.heroImageAlt}
                  label={labels.imagePlaceholder}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto max-w-6xl border-t border-white/10 px-5 py-16"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {data.features.map((feature) => (
              <article
                key={feature.id}
                className={`${feature.id === "A" || feature.id === "C" ? "md:col-span-2" : ""} rounded-[28px] border p-8 ${feature.variant === "volt" ? "border-transparent bg-[#d4ff3d] text-[#0a0f14]" : "border-white/10 bg-white/5 text-[#eaf3f8]"}`}
              >
                <span
                  className={`font-mono text-xs ${feature.variant === "volt" ? "text-[#0a0f14]/70" : "text-[#d4ff3d]"}`}
                >
                  {feature.id}
                </span>
                <h2 className="mt-2 font-display text-3xl uppercase">
                  {feature.title}
                </h2>
                <p
                  className={`mt-3 max-w-[40ch] ${feature.variant === "volt" ? "text-[#0a0f14]/80" : "text-[#9db4c4]"}`}
                >
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="specs"
          className="mx-auto grid max-w-6xl items-center gap-10 border-t border-white/10 px-5 py-16 md:grid-cols-2"
        >
          <ProductMedia
            url={data.detailImageUrl}
            alt={data.detailImageAlt}
            label={labels.imagePlaceholder}
            detail
          />
          <div className="font-mono text-sm text-[#eaf3f8]">
            {data.specs.map((spec, index) => (
              <div
                key={`${spec.label}-${index}`}
                className={`flex justify-between gap-4 py-3 ${index < data.specs.length - 1 ? "border-b border-white/10" : ""}`}
              >
                <span className="text-[#9db4c4]">{spec.label}</span>
                <span className="text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        <section
          id="reviews"
          className="mx-auto max-w-6xl border-t border-white/10 px-5 py-16"
        >
          <div className="grid gap-4 md:grid-cols-3">
            {data.reviews.map((review, index) => (
              <blockquote
                key={`${review.author}-${index}`}
                className="rounded-[24px] border border-white/10 bg-white/5 p-7 transition-colors hover:bg-white/10"
              >
                <p className="text-lg text-[#eaf3f8]">
                  &quot;{review.quote}&quot;
                </p>
                <span className="mt-4 block font-mono text-xs text-[#9db4c4]">
                  — {review.author}
                </span>
              </blockquote>
            ))}
          </div>
        </section>

        <section
          id="buy"
          className="mx-auto max-w-6xl border-t border-white/10 px-5 py-20 text-center"
        >
          <span className="font-display text-6xl uppercase text-[#eaf3f8] md:text-8xl">
            {data.name}
          </span>
          <p className="mt-3 font-mono text-[#9db4c4]">
            {data.buyLine || data.price}
          </p>
          <a
            href="#buy"
            className="mt-8 inline-block rounded-full bg-[#d4ff3d] px-10 py-4 font-display text-lg text-[#0a0f14] transition-[filter] hover:brightness-95"
          >
            {labels.buy}{" "}
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </a>
        </section>

        <section
          id="faq"
          className="mx-auto max-w-3xl border-t border-white/10 px-5 py-16"
        >
          {data.faq.map((item, index) => (
            <details
              key={`${item.question}-${index}`}
              className="group border-b border-white/10 py-4"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-display text-xl uppercase text-[#eaf3f8]">
                {item.question}
                <span className="font-sans text-[#9db4c4] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[#9db4c4]">{item.answer}</p>
            </details>
          ))}
        </section>
      </main>

      <footer className="border-t border-white/10 py-12 text-center">
        <span className="font-display text-3xl text-[#eaf3f8]">
          {brand.toUpperCase()}
        </span>
        <p className="mt-2 font-mono text-xs text-[#9db4c4]">
          © {new Date().getFullYear()} · {data.footerEmail}
        </p>
      </footer>
    </div>
  );
}

export function oneProductDataFromCatalog(
  product: TemplateCatalogItem | undefined,
  locale: TemplateLocale,
): OneProductTemplateData {
  const labels = TEMPLATE_UI[locale];
  const name = product?.name || labels.productPlaceholder;
  const description =
    product?.description ||
    (locale === "de"
      ? "Produktbeschreibung hier ergänzen."
      : locale === "zh"
        ? "请在此添加产品说明。"
        : "Add the product description here.");
  const price = product?.priceAmount
    ? `${product.priceAmount}${product.priceCurrency ? ` ${product.priceCurrency}` : ""}`
    : "—";
  const category =
    product?.category ||
    (locale === "de" ? "Produkt" : locale === "zh" ? "产品" : "Product");
  return {
    name,
    kicker: category,
    headline: name,
    description,
    price,
    buyLine: `${category} · ${price}`,
    heroImageUrl: product?.imageUrl,
    heroImageAlt: name,
    detailImageUrl: product?.imageUrl,
    detailImageAlt: `${name} detail`,
    features: [
      {
        id: "A",
        title:
          locale === "de"
            ? "Produktvorteil"
            : locale === "zh"
              ? "产品优势"
              : "Product benefit",
        copy: product?.valueProposition || description,
      },
      {
        id: "B",
        title:
          locale === "de"
            ? "Wichtige Angabe"
            : locale === "zh"
              ? "重要信息"
              : "Key detail",
        copy: price,
      },
      {
        id: "01",
        title:
          locale === "de"
            ? "Für deine Kunden"
            : locale === "zh"
              ? "适合你的客户"
              : "For your customers",
        copy: product?.useCases?.[0] || description,
        variant: "volt",
      },
      {
        id: "C",
        title:
          locale === "de"
            ? "Mehr erfahren"
            : locale === "zh"
              ? "了解更多"
              : "Learn more",
        copy: product?.useCases?.slice(1).join(" · ") || description,
      },
    ],
    specs: [
      { label: category, value: name },
      { label: labels.buy, value: price },
      {
        label: locale === "de" ? "Status" : locale === "zh" ? "状态" : "Status",
        value:
          locale === "de"
            ? "Verfügbar"
            : locale === "zh"
              ? "可用"
              : "Available",
      },
    ],
    reviews: [
      {
        quote:
          locale === "de"
            ? "Kundenstimme hier ergänzen."
            : locale === "zh"
              ? "请在此添加客户评价。"
              : "Add a customer quote here.",
        author: PLACEHOLDER_CUSTOMER,
      },
      {
        quote:
          locale === "de"
            ? "Zweite Kundenstimme hier ergänzen."
            : locale === "zh"
              ? "请在此添加第二条评价。"
              : "Add a second customer quote here.",
        author: PLACEHOLDER_CUSTOMER,
      },
      {
        quote:
          locale === "de"
            ? "Dritte Kundenstimme hier ergänzen."
            : locale === "zh"
              ? "请在此添加第三条评价。"
              : "Add a third customer quote here.",
        author: PLACEHOLDER_CUSTOMER,
      },
    ],
    faq: [
      {
        question:
          locale === "de"
            ? "Wie funktioniert das Produkt?"
            : locale === "zh"
              ? "产品如何使用？"
              : "How does the product work?",
        answer: description,
      },
      {
        question:
          locale === "de"
            ? "Wie kann ich es anfragen?"
            : locale === "zh"
              ? "如何咨询产品？"
              : "How can I request it?",
        answer: labels.buy,
      },
      {
        question:
          locale === "de"
            ? "Welche Details sind wichtig?"
            : locale === "zh"
              ? "哪些信息很重要？"
              : "Which details matter?",
        answer: price,
      },
    ],
    footerEmail: PLACEHOLDER_EMAIL,
  };
}
