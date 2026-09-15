import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, ExternalLink, Globe2, Image, Loader2, Package, Plus, RefreshCw, ShoppingBag, Sparkles, XCircle } from "lucide-react";
import { getSelectedWorkspaceId } from "../../api/session";
import { storefrontApi, websitesApi, type Storefront, type StorefrontProduct, type WebsiteGenerationJob, type WebsiteSite } from "../../api/websites";
import { onboardingApi, type Offering } from "../../api/onboarding";
import { productsApi } from "../../api/products";
import { workspaceProfileApi } from "../../api/workspaces";
import { useTranslation } from "../../i18n/GlobalLanguageSwitcher";
import { getFriendlyErrorMessage } from "../../api/client";
import { DomainOwnershipPanel } from "../../components/DomainOwnershipPanel";
import { WebsiteAssetPanel } from "./WebsiteAssetPanel";
import { deriveTemplatePalette, LuluIndustrialTemplate, type TemplateBranding, type TemplateCatalogItem, type TemplatePalette } from "./LuluIndustrialTemplate";
import { navigateApp } from "../../routing";

export type ManagedWebsitePanel = "builder" | "preview" | "media" | "domains";

const WEBSITE_PANEL_ROUTES: Record<ManagedWebsitePanel, string> = {
  builder: "/app/website-editor",
  preview: "/app/website-preview",
  media: "/app/website-media",
  domains: "/app/website-domains",
};

function panelFromLocation(): ManagedWebsitePanel | null {
  const value = new URLSearchParams(window.location.search).get("panel");
  if (value === "builder" || value === "preview" || value === "shop" || value === "media" || value === "domains") {
    return value === "shop" ? "preview" : value;
  }
  return null;
}

function statusLabel(status: string) {
  const values: Record<string, string> = { draft: "Entwurf", generating: "Wird erstellt", preview: "Vorschau bereit", publishing: "Wird veröffentlicht", published: "Veröffentlicht", error: "Fehler" };
  return values[status] ?? status;
}

function ProductCard({ product }: { product: StorefrontProduct }) {
  return <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
    {product.imageUrl ? <img src={product.imageUrl} alt={product.imageAlt || product.name} className="aspect-[4/3] w-full object-cover" /> : <div className="grid aspect-[4/3] place-items-center bg-secondary text-muted-foreground"><Image size={28} /></div>}
    <div className="p-4"><p className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{product.category || "Produkt"}</p><h3 className="mt-1 font-semibold text-foreground">{product.name}</h3><p className="mt-2 line-clamp-3 text-sm leading-5 text-muted-foreground">{product.shortDescription || product.longDescription || "Noch keine Produktbeschreibung vorhanden."}</p><div className="mt-4 font-semibold text-foreground">{product.price ? `${product.price} ${product.currency || ""}` : "Preis auf Anfrage"}</div></div>
  </article>;
}

function TemplatePlaceholderVisual({ label, className = "" }: { label: string; className?: string }) {
  return <div className={`grid min-h-52 place-items-center rounded-2xl border border-dashed border-foreground/20 bg-gradient-to-br from-violet-100 via-background to-cyan-100 p-6 text-center ${className}`}>
    <div><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-primary/30 bg-card/75 text-2xl font-semibold text-primary">L</div><p className="mt-3 text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{label}</p></div>
  </div>;
}

export type TemplateLocale = "de" | "en" | "zh";
const TEMPLATE_LOCALE_SHORT_CODE: Record<TemplateLocale, string> = { de: String.fromCharCode(68, 69), en: String.fromCharCode(69, 78), zh: "中文" };

export const TEMPLATE_UI: Record<TemplateLocale, {
  language: string; brand: string; preview: string; templateKicker: string; templateMode: string; templateSubline: string; languageDe: string; languageEn: string; languageZh: string; menu: string; close: string; productsOn: string; productsOff: string; backHome: string; home: string; solutions: string; services: string; products: string; about: string; contact: string;
  heroEyebrow: string; heroTitle: string; starterCopy: string; speak: string; viewServices: string; heroImage: string;
  trust: string[]; solutionsTitle: string; solutionsDescription: string; more: string;
  company: string; companyBody: string; offer: string; offerBody: string; trustTitle: string; trustBody: string; contactTitle: string; requestOffer: string; contactBody: string;
  servicesTitle: string; servicesBody: string; serviceArea: string; serviceImage: string; view: string;
  productsTitle: string; productsBody: string; productImage: string; productLabel: string; productNames: string[]; priceOnRequest: string;
  strengthsLabel: string; strengthsTitle: string; strengthsBody: string; strengths: string[]; serviceCards: string[]; companyImage: string;
  aboutLabel: string; aboutTitle: string; aboutBody: string; aboutItems: string[]; galleryImage: string;
  processLabel: string; processTitle: string; processBody: string; process: string[]; processStepBody: string;
  contactLabel: string; contactPrompt: string; contactDescription: string; helpful: string; helpfulItems: string[];
  messageLabel: string; formTitle: string; formBody: string; name: string; email: string; website: string; whatsapp: string; file: string; fileHint: string; message: string; send: string;
  faqLabel: string; faqTitle: string; faqs: string[]; faqBody: string;
  startTitle: string; startBody: string; create: string; footerBrand: string; legal: string; unpublished: string; unpublishedBody: string;
}> = {
  de: {
    language: "Sprache", brand: "HEBEI XIANGJINXIN METAL PRODUCTS CO., LTD.", preview: "VORSCHAU", templateKicker: "Großhandel · Projektversorgung · OEM · Sonderfertigung", templateMode: "VORSCHAU · LULU", templateSubline: "INDUSTRIE-BEFESTIGUNGSTEILE", languageDe: "DE", languageEn: "EN", languageZh: "中文", menu: "Menü öffnen", close: "Menü schließen", productsOn: "Produkte anzeigen", productsOff: "Produkte ausblenden", backHome: "Zur Startseite", home: "Startseite", solutions: "Lösungen", services: "Leistungen", products: "Produkte", about: "Über uns", contact: "Kontakt",
    heroEyebrow: "HERSTELLER · GROSSHANDEL · OEM · EXPORT", heroTitle: "Industrie-Befestigungsteile für Standard-, Schwerlast- und Sonderanwendungen", starterCopy: "Schrauben, Muttern, Anker, Gewindekomponenten, Solar-Befestiger und kundenspezifische Teile für Händler, Hersteller, Ingenieurbüros und Projektkäufer.", speak: "B2B-Angebot anfragen", viewServices: "Leistungen ansehen", heroImage: "Schwere Industrie-Sechskantschrauben und Muttern auf Stahl",
    trust: ["Großhandel", "OEM", "Projektversorgung", "Sonderteile", "Fertigung nach Zeichnung"], solutionsTitle: "Was benötigen Sie?", solutionsDescription: "Standardteile, Großhandelsversorgung, Projektbedarf oder kundenspezifische Fertigung – klar strukturiert und direkt anfragbar.", more: "Mehr erfahren →",
    company: "Standard-Befestigungsteile", companyBody: "Schrauben, Muttern, Anker und Gewindeteile für industrielle Anwendungen.", offer: "Großhandelsversorgung", offerBody: "Gemischte Spezifikationen, Serienbedarf und Projektmengen aus einer Hand.", trustTitle: "Technische Prüfung", trustBody: "Spezifikationen, Zeichnungen und Qualitätsanforderungen werden nachvollziehbar geprüft.", contactTitle: "B2B-Angebot anfragen", requestOffer: "Angebot anfragen", contactBody: "Teileliste, Maße, BOM oder Zeichnung hochladen und direkt Kontakt aufnehmen.",
    servicesTitle: "Alles Wichtige auf einen Blick", servicesBody: "Leistungsbereiche und Angebote werden hier übersichtlich dargestellt.", serviceArea: "Leistungsbereich", serviceImage: "Beschreibung und nächster Schritt werden aus deiner Knowledge Base übernommen.", view: "Ansehen →",
    productsTitle: "Industrie-Befestigungsteile", productsBody: "Standard-, hochfeste, Solar- und kundenspezifische Verbindungsteile für anspruchsvolle Anwendungen.", productImage: "Produktbild", productLabel: "Produktfamilie", productNames: ["Industrieschrauben", "Industrie-Muttern", "Gewindestangen und Stiftschrauben", "Solar- und PV-Befestiger"], priceOnRequest: "Preis auf Anfrage",
    strengthsLabel: "Kernkompetenzen", strengthsTitle: "Verlässliche Versorgung für industrielle Projekte", strengthsBody: "Vom Standardkatalog bis zur Fertigung nach Zeichnung – mit klarer technischer Prüfung und direkter Kommunikation.", strengths: ["Großhandel", "OEM-Fertigung", "Projektversorgung"], serviceCards: ["Standard-Befestigungsteile", "Hochfeste Verbindungsteile", "Solar- und PV-Befestiger", "Sonderteile nach Zeichnung"], companyImage: "Fertigungszeichnung und Bauteile",
    aboutLabel: "Über dein Unternehmen", aboutTitle: "Von der ersten Information bis zum nächsten Schritt", aboutBody: "Dieses Modul erklärt später, wofür dein Unternehmen steht, wem du hilfst und wie Besucher mit dir arbeiten können.", aboutItems: ["Positionierung", "Zielgruppen", "Angebot", "Ablauf", "Kontakt", "Vertrauen"], galleryImage: "Galeriebild wird ergänzt",
    processLabel: "Klarer Prozess", processTitle: "So funktioniert es", processBody: "Ein klarer Ablauf hält Anforderungen, Entscheidungen und nächste Schritte nachvollziehbar.", process: ["Anforderungen teilen", "Passenden Ansatz prüfen", "Nächsten Schritt starten"], processStepBody: "Ein kurzer, verständlicher Abschnitt mit den verifizierten Details deines Unternehmens.",
    contactLabel: "Kontakt und Vertrauen", contactPrompt: "Bereit für den nächsten Schritt?", contactDescription: "Besucher sehen hier eine klare Einladung, ihre Anforderungen zu teilen und direkt Kontakt aufzunehmen.", helpful: "Hilfreiche Informationen", helpfulItems: ["Was du brauchst", "Für wen die Anfrage ist", "Gewünschter Zeitrahmen", "Relevante Dateien"],
    messageLabel: "Nachricht senden", formTitle: "Kontaktformular", formBody: "Ein einfacher, sicherer Weg für eine erste Anfrage.", name: "Name", email: "E-Mail", website: "Website-Link", whatsapp: "WhatsApp-Nummer", file: "Datei anhängen", fileHint: "Optional, maximal 5 MB", message: "Nachricht", send: "Nachricht senden",
    faqLabel: "FAQ", faqTitle: "Häufige Fragen", faqs: ["Was bietet dieses Unternehmen an?", "Für wen ist das Angebot gedacht?", "Wie starten wir ein Gespräch?"], faqBody: "Die Antwort wird aus den verifizierten Informationen deines Unternehmens erzeugt und hier angezeigt.",
    startTitle: "Deine Marke kann hier starten.", startBody: "Erstelle die Website im Editor. Lulu füllt dieses Template anschließend mit deinen geprüften Inhalten.", create: "Website erstellen", footerBrand: "DEIN BRAND-PLATZHALTER", legal: "Datenschutz · Impressum · Kontakt", unpublished: "Noch keine Website veröffentlicht.", unpublishedBody: "Die Vorschau zeigt bewusst das vollständige Lulu-Standard-Template. Erstelle deine Website im Editor, sobald du bereit bist."
  },
  en: {
    language: "Language", brand: "HEBEI XIANGJINXIN METAL PRODUCTS CO., LTD.", preview: "PREVIEW", templateKicker: "Wholesale · Project Supply · OEM · Custom Manufacturing", templateMode: "PREVIEW · LULU", templateSubline: "INDUSTRIAL FASTENERS", languageDe: "DE", languageEn: "EN", languageZh: "中文", menu: "Open menu", close: "Close menu", productsOn: "Show products", productsOff: "Hide products", backHome: "Back to home", home: "Home", solutions: "Solutions", services: "Services", products: "Products", about: "About", contact: "Contact",
    heroEyebrow: "MANUFACTURER · WHOLESALE · OEM · EXPORT", heroTitle: "Industrial Fasteners for Standard, Heavy-Duty & Custom Applications", starterCopy: "Bolts, nuts, anchors, threaded components, solar fasteners and custom hardware for distributors, manufacturers, engineering companies and project buyers.", speak: "Request B2B Quote", viewServices: "Explore Services", heroImage: "Heavy industrial hex bolts and nuts on a dark steel surface",
    trust: ["Wholesale", "OEM", "Project Supply", "Custom Fasteners", "Drawing-Based Manufacturing"], solutionsTitle: "What Do You Need?", solutionsDescription: "Standard fasteners, wholesale supply, project procurement or drawing-based custom manufacturing.", more: "Learn more →",
    company: "Standard Fasteners", companyBody: "Browse bolts, nuts, anchors and threaded hardware for industrial applications.", offer: "Wholesale Supply", offerBody: "Mixed specifications, repeat-volume purchasing and complete project supply.", trustTitle: "Technical Review", trustBody: "Specifications, drawings and quality requirements are checked against the agreed scope.", contactTitle: "Request an offer", requestOffer: "Request Offer", contactBody: "Share your product list, dimensions, BOM or drawing and start a direct conversation.",
    servicesTitle: "Everything important at a glance", servicesBody: "Your service areas and offers are presented clearly here.", serviceArea: "Service area", serviceImage: "Description and next steps are taken from your Knowledge Base.", view: "View →",
    productsTitle: "Industrial Fasteners", productsBody: "Standard, high-strength, solar and drawing-based components for demanding applications.", productImage: "Product image", productLabel: "Product family", productNames: ["Industrial Bolts", "Industrial Nuts", "Threaded Rods & Stud Bolts", "Solar & Photovoltaic Fasteners"], priceOnRequest: "Price on request",
    strengthsLabel: "Capability", strengthsTitle: "Reliable supply for industrial projects", strengthsBody: "From standard catalogue supply to drawing-based production, with clear technical review and direct communication.", strengths: ["Wholesale", "OEM manufacturing", "Project supply"], serviceCards: ["Standard Fasteners", "High-Strength Components", "Solar / PV Fasteners", "Drawing-Based Custom Parts"], companyImage: "Technical drawing and fastener components",
    aboutLabel: "About your company", aboutTitle: "From the first detail to the next step", aboutBody: "This module explains what your company stands for, who you help and how visitors can work with you.", aboutItems: ["Positioning", "Audiences", "Offer", "Process", "Contact", "Trust"], galleryImage: "Gallery image will be added",
    processLabel: "Clear process", processTitle: "How it works", processBody: "A clear process keeps requirements, decisions and next steps understandable.", process: ["Share requirements", "Review the right approach", "Start the next step"], processStepBody: "A short, clear section with your company's verified details.",
    contactLabel: "Contact and trust", contactPrompt: "Ready for the next step?", contactDescription: "Visitors see a clear invitation to share their needs and get in touch.", helpful: "Helpful information", helpfulItems: ["What you need", "Who the request is for", "Desired timeline", "Relevant files"],
    messageLabel: "Send a message", formTitle: "Contact form", formBody: "A simple, secure way to send a first request.", name: "Name", email: "Email", website: "Website link", whatsapp: "WhatsApp number", file: "Attach a file", fileHint: "Optional, maximum 5 MB", message: "Message", send: "Send message",
    faqLabel: "FAQ", faqTitle: "Frequently asked questions", faqs: ["What does this company offer?", "Who is the offer for?", "How do we start a conversation?"], faqBody: "The answer is generated from your company's verified information and shown here.",
    startTitle: "Your brand can start here.", startBody: "Create the website in the editor. Lulu will fill this template with your verified content.", create: "Create website", footerBrand: "YOUR BRAND PLACEHOLDER", legal: "Privacy · Legal notice · Contact", unpublished: "No website published yet.", unpublishedBody: "The preview intentionally shows the complete Lulu standard template. Create your website in the editor when you are ready."
  },
  zh: {
    language: "语言", brand: "河北祥进鑫金属制品有限公司", preview: "预览", templateKicker: "批发供应 · 项目供应 · OEM · 定制制造", templateMode: "预览 · LULU", templateSubline: "工业紧固件", languageDe: "德", languageEn: "英", languageZh: "中文", menu: "打开菜单", close: "关闭菜单", productsOn: "显示产品", productsOff: "隐藏产品", backHome: "返回首页", home: "首页", solutions: "解决方案", services: "服务", products: "产品", about: "关于我们", contact: "联系",
    heroEyebrow: "生产制造 · 批发供应 · OEM代工 · 出口", heroTitle: "工业紧固件 —— 标准件、重型及非标定制解决方案", starterCopy: "为经销商、制造商、工程公司及项目采购方提供螺栓、螺母、地脚螺栓、螺纹件、光伏紧固件及非标定制五金件。", speak: "获取B2B报价", viewServices: "查看服务", heroImage: "深色钢材表面的重型工业六角螺栓和螺母",
    trust: ["批发供应", "OEM", "项目供应", "非标紧固件", "来图定制制造"], solutionsTitle: "您需要什么？", solutionsDescription: "标准紧固件、批发供应、项目采购或来图定制制造，清晰展示并可直接咨询。", more: "了解更多 →",
    company: "标准紧固件", companyBody: "浏览工业应用所需的螺栓、螺母、地脚螺栓及各类螺纹紧固件。", offer: "批发供应", offerBody: "混合规格、批量采购和完整项目供应。", trustTitle: "技术评审", trustBody: "根据确认范围核查规格、图纸和质量要求。", contactTitle: "提交报价请求", requestOffer: "请求报价", contactBody: "分享产品清单、尺寸、BOM或图纸，直接开始沟通。",
    servicesTitle: "一目了然的重要信息", servicesBody: "在这里清晰展示你的服务范围和业务内容。", serviceArea: "服务范围", serviceImage: "描述和下一步将来自你的知识库。", view: "查看 →",
    productsTitle: "工业紧固件", productsBody: "面向严苛应用的标准件、高强度件、光伏件及来图定制零件。", productImage: "产品图片", productLabel: "产品系列", productNames: ["工业螺栓", "工业螺母", "螺纹杆与螺柱", "光伏太阳能紧固件"], priceOnRequest: "价格咨询",
    strengthsLabel: "制造能力", strengthsTitle: "为工业项目提供可靠供应", strengthsBody: "从标准目录供应到来图生产，提供清晰的技术评审和直接沟通。", strengths: ["批发供应", "OEM制造", "项目供应"], serviceCards: ["标准紧固件", "高强度组件", "光伏太阳能紧固件", "来图定制零件"], companyImage: "技术图纸和紧固件组件",
    aboutLabel: "关于你的公司", aboutTitle: "从第一条信息到下一步行动", aboutBody: "这里将说明公司定位、服务对象以及客户如何与你合作。", aboutItems: ["品牌定位", "目标客户", "业务内容", "流程", "联系", "信任"], galleryImage: "即将添加画廊图片",
    processLabel: "清晰流程", processTitle: "使用方式", processBody: "清晰的流程让需求、决策和下一步都易于理解。", process: ["分享需求", "确认合适方案", "开始下一步"], processStepBody: "展示公司已验证信息的简短清晰模块。",
    contactLabel: "联系与信任", contactPrompt: "准备好开始了吗？", contactDescription: "访客可以分享需求并直接与你联系。", helpful: "有用信息", helpfulItems: ["你的需求", "请求对象", "期望时间", "相关文件"],
    messageLabel: "发送消息", formTitle: "联系表单", formBody: "简单、安全地发送第一条请求。", name: "姓名", email: "电子邮件", website: "网站链接", whatsapp: "WhatsApp 号码", file: "附加文件", fileHint: "可选，最大 5 MB", message: "消息", send: "发送消息",
    faqLabel: "常见问题", faqTitle: "常见问题", faqs: ["这家公司提供什么？", "业务适合谁？", "如何开始沟通？"], faqBody: "答案将根据公司已验证信息生成并显示在这里。",
    startTitle: "你的品牌可以从这里开始。", startBody: "在编辑器中创建网站。Lulu 会用已验证内容填充此模板。", create: "创建网站", footerBrand: "你的品牌占位符", legal: "隐私 · 法律声明 · 联系", unpublished: "尚未发布网站。", unpublishedBody: "预览会显示完整的 Lulu 标准模板。准备好后在编辑器中创建网站。"
  }
};

export type TemplateCopy = (typeof TEMPLATE_UI)[TemplateLocale];

function placeholderCopy(locale: TemplateLocale): TemplateCopy {
  const base = TEMPLATE_UI[locale];
  const TEMPLATE_UI_PLACEHOLDER = locale === "zh"
    ? { brand: "你的公司", templateKicker: "品牌网站 · 产品展示 · 服务介绍", templateSubline: "品牌模板", heroEyebrow: "你的行业 · 你的定位 · 你的优势", heroTitle: "在这里展示你的品牌", starterCopy: "这里将展示经过验证的公司简介、产品和服务信息。", heroImage: "主视觉占位图", trust: ["你的优势", "你的行业", "你的标准", "你的市场", "你的承诺"], solutionsTitle: "你的解决方案", solutionsDescription: "这里将展示客户需要了解的核心内容。", company: "内容模块 01", companyBody: "在这里介绍你的公司、定位或核心能力。", offer: "内容模块 02", offerBody: "在这里介绍你的产品、服务或交付方式。", trustTitle: "内容模块 03", trustBody: "在这里展示认证、质量或信任信息。", contactTitle: "开始沟通", contactBody: "通过表单提交需求，开始下一步。", servicesTitle: "服务内容", servicesBody: "你的服务会在这里展示。", serviceArea: "服务模块", serviceImage: "服务图片占位图", productsTitle: "产品目录", productsBody: "你的产品会在这里展示。", productImage: "产品图片占位图", productLabel: "产品", productNames: ["产品 01", "产品 02", "产品 03", "产品 04"], strengthsLabel: "公司优势", strengthsTitle: "让客户快速理解你的价值", strengthsBody: "这里将展示你的优势和经过验证的信息。", strengths: ["优势 01", "优势 02", "优势 03"], serviceCards: ["服务 01", "服务 02", "服务 03", "服务 04"], companyImage: "公司图片占位图", aboutLabel: "关于公司", aboutTitle: "关于你的公司", aboutBody: "这里将展示你的公司介绍。", aboutItems: ["定位", "客户", "产品", "服务", "流程", "信任"], galleryImage: "画廊图片占位图", processLabel: "流程", processTitle: "合作流程", processBody: "这里将展示合作步骤。", process: ["步骤 01", "步骤 02", "步骤 03"], processStepBody: "经过验证的信息将在这里展示。", contactLabel: "联系", contactPrompt: "准备好开始了吗？", contactDescription: "提交你的需求，开始沟通。", helpful: "可提供的信息", helpfulItems: ["需求", "联系人", "时间", "文件"], faqBody: "答案将根据你的已验证信息生成。", startTitle: "你的品牌从这里开始", startBody: "在编辑器中添加已验证的公司内容。", create: "开始编辑", footerBrand: "你的品牌", unpublished: "尚未发布", unpublishedBody: "这是一个没有预填图片和公司内容的模板。" }
    : locale === "en"
      ? { brand: "YOUR COMPANY", templateKicker: "BRAND WEBSITE · PRODUCT DISPLAY · SERVICE INTRODUCTION", templateSubline: "BRAND TEMPLATE", heroEyebrow: "YOUR INDUSTRY · YOUR POSITIONING · YOUR ADVANTAGE", heroTitle: "Present your brand here", starterCopy: "Verified company, product and service information will appear here.", heroImage: "Hero image placeholder", trust: ["Your strengths", "Your industry", "Your standards", "Your market", "Your promise"], solutionsTitle: "Your solutions", solutionsDescription: "The core information your customers need will appear here.", company: "Content module 01", companyBody: "Introduce your company, positioning or core capability here.", offer: "Content module 02", offerBody: "Introduce your products, services or delivery model here.", trustTitle: "Content module 03", trustBody: "Show certifications, quality or trust information here.", contactTitle: "Start a conversation", contactBody: "Share your requirements and begin the next step.", servicesTitle: "Services", servicesBody: "Your services will appear here.", serviceArea: "Service module", serviceImage: "Service image placeholder", productsTitle: "Product catalogue", productsBody: "Your products will appear here.", productImage: "Product image placeholder", productLabel: "Product", productNames: ["Product 01", "Product 02", "Product 03", "Product 04"], strengthsLabel: "Why you", strengthsTitle: "Help customers understand your value", strengthsBody: "Verified company information and strengths will appear here.", strengths: ["Strength 01", "Strength 02", "Strength 03"], serviceCards: ["Service 01", "Service 02", "Service 03", "Service 04"], companyImage: "Company image placeholder", aboutLabel: "About", aboutTitle: "About your company", aboutBody: "Your company introduction will appear here.", aboutItems: ["Positioning", "Audience", "Products", "Services", "Process", "Trust"], galleryImage: "Gallery image placeholder", processLabel: "Process", processTitle: "How it works", processBody: "Your collaboration steps will appear here.", process: ["Step 01", "Step 02", "Step 03"], processStepBody: "Verified information will appear here.", contactLabel: "Contact", contactPrompt: "Ready to begin?", contactDescription: "Share your requirements and start a conversation.", helpful: "Helpful information", helpfulItems: ["Requirement", "Contact", "Timeline", "Files"], faqBody: "Answers will be generated from your verified information.", startTitle: "Your brand starts here", startBody: "Add verified company content in the editor.", create: "Start editing", footerBrand: "YOUR BRAND", unpublished: "Not published yet", unpublishedBody: "This is a blank template with no preset images or company content." }
      : { brand: "IHR UNTERNEHMEN", templateKicker: "MARKENWEBSITE · PRODUKTÜBERSICHT · LEISTUNGEN", templateSubline: "MARKEN-TEMPLATE", heroEyebrow: "IHRE BRANCHE · IHRE POSITIONIERUNG · IHRE STÄRKEN", heroTitle: "Ihre Marke an diesem Platz", starterCopy: "Hier erscheinen verifizierte Unternehmens-, Produkt- und Leistungsinformationen.", heroImage: "Platzhalter für Hauptbild", trust: ["Ihre Stärken", "Ihre Branche", "Ihre Standards", "Ihr Markt", "Ihr Versprechen"], solutionsTitle: "Ihre Lösungen", solutionsDescription: "Hier erscheinen die wichtigsten Informationen für Ihre Kunden.", company: "Inhaltsmodul 01", companyBody: "Stellen Sie hier Ihr Unternehmen, Ihre Positionierung oder Kernkompetenz vor.", offer: "Inhaltsmodul 02", offerBody: "Stellen Sie hier Ihre Produkte, Leistungen oder Lieferweise vor.", trustTitle: "Inhaltsmodul 03", trustBody: "Zeigen Sie hier Zertifikate, Qualität oder Vertrauensinformationen.", contactTitle: "Gespräch starten", contactBody: "Teilen Sie Ihre Anforderungen und starten Sie den nächsten Schritt.", servicesTitle: "Leistungen", servicesBody: "Ihre Leistungen werden hier angezeigt.", serviceArea: "Leistungsmodul", serviceImage: "Platzhalter für Leistungsbild", productsTitle: "Produktkatalog", productsBody: "Ihre Produkte werden hier angezeigt.", productImage: "Platzhalter für Produktbild", productLabel: "Produkt", productNames: ["Produkt 01", "Produkt 02", "Produkt 03", "Produkt 04"], strengthsLabel: "Ihre Vorteile", strengthsTitle: "Ihr Wert auf einen Blick", strengthsBody: "Verifizierte Unternehmensinformationen und Stärken werden hier angezeigt.", strengths: ["Stärke 01", "Stärke 02", "Stärke 03"], serviceCards: ["Leistung 01", "Leistung 02", "Leistung 03", "Leistung 04"], companyImage: "Platzhalter für Unternehmensbild", aboutLabel: "Über das Unternehmen", aboutTitle: "Über Ihr Unternehmen", aboutBody: "Ihre Unternehmensvorstellung wird hier angezeigt.", aboutItems: ["Positionierung", "Zielgruppen", "Produkte", "Leistungen", "Ablauf", "Vertrauen"], galleryImage: "Platzhalter für Galeriebild", processLabel: "Ablauf", processTitle: "So funktioniert es", processBody: "Ihre Zusammenarbeitsschritte werden hier angezeigt.", process: ["Schritt 01", "Schritt 02", "Schritt 03"], processStepBody: "Verifizierte Informationen werden hier angezeigt.", contactLabel: "Kontakt", contactPrompt: "Bereit für den Start?", contactDescription: "Teilen Sie Ihre Anforderungen und starten Sie ein Gespräch.", helpful: "Hilfreiche Angaben", helpfulItems: ["Anforderung", "Kontakt", "Zeitraum", "Dateien"], faqBody: "Antworten werden aus Ihren verifizierten Informationen erzeugt.", startTitle: "Ihre Marke startet hier", startBody: "Fügen Sie verifizierte Unternehmensinhalte im Editor hinzu.", create: "Bearbeitung starten", footerBrand: "IHRE MARKE", unpublished: "Noch nicht veröffentlicht", unpublishedBody: "Dies ist ein leeres Template ohne vorgefertigte Bilder oder Unternehmensinhalte." };
  return { ...base, ...TEMPLATE_UI_PLACEHOLDER } as TemplateCopy;
}

function offeringToTemplateItem(offering: Offering): TemplateCatalogItem {
  return { name: offering.name, description: offering.description, imageUrl: offering.imageUrl, category: offering.category, priceLabel: offering.priceLabel, priceAmount: offering.priceAmount, priceCurrency: offering.priceCurrency, valueProposition: offering.valueProposition, useCases: offering.useCases };
}

function EmptyWebsiteTemplate({ hasServices, hasProducts, products, services, branding, palette }: { hasServices: boolean; hasProducts: boolean; products?: TemplateCatalogItem[]; services?: TemplateCatalogItem[]; branding?: TemplateBranding; palette?: TemplatePalette }) {
  const [locale, setLocale] = useState<TemplateLocale>("de");
  const copy = placeholderCopy(locale);
  return <LuluIndustrialTemplate copy={copy} locale={locale} setLocale={setLocale} hasServices={hasServices} hasProducts={hasProducts} products={products} services={services} branding={branding} palette={palette} />;
  const navigation = [copy.home, copy.solutions, ...(hasServices ? [copy.services] : []), ...(hasProducts ? [copy.products] : []), copy.about, copy.contact];
  const starterCopy = copy.starterCopy;
  const solutionCards = [
    { number: "01", title: copy.company, body: copy.companyBody },
    ...(hasServices || hasProducts ? [{ number: "02", title: hasServices && hasProducts ? `${copy.products} & ${copy.services}` : hasServices ? copy.services : copy.products, body: copy.offerBody }] : []),
    { number: "03", title: copy.trustTitle, body: copy.trustBody },
    { number: "04", title: copy.contactTitle, body: copy.contactBody },
  ];
  const serviceCards = copy.serviceCards;
  const strengthCards = copy.strengths;
  const processSteps = copy.process;
  const faqs = copy.faqs;
  return <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-background shadow-sm">
    <div className="border-b border-border bg-card px-5 py-4 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-foreground text-sm font-bold text-background">L</span><span className="text-sm font-semibold tracking-wide">{copy.brand}</span></div>
        <nav aria-label="Template-Navigation" className="hidden flex-wrap items-center gap-4 text-xs font-semibold text-muted-foreground lg:flex">{navigation.map((item) => <span key={item}>{item}</span>)}</nav>
        <div className="flex items-center gap-2"><label className="sr-only" htmlFor="template-language">{copy.language}</label><select id="template-language" value={locale} onChange={(event) => setLocale(event.target.value as TemplateLocale)} className="h-8 rounded-full border border-border bg-background px-3 text-xs font-semibold text-foreground outline-none focus:border-primary"><option value="de">{TEMPLATE_LOCALE_SHORT_CODE.de}</option><option value="en">{TEMPLATE_LOCALE_SHORT_CODE.en}</option><option value="zh">{TEMPLATE_LOCALE_SHORT_CODE.zh}</option></select><span className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground">{copy.preview}</span></div>
      </div>
    </div>

    <section className="bg-gradient-to-br from-slate-950 via-violet-950 to-cyan-900 px-5 py-12 text-white sm:px-10 sm:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1.12fr_.88fr]">
        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.2em] text-cyan-200">{copy.heroEyebrow}</p><h3 className="mt-4 text-4xl font-semibold tracking-[-.05em] sm:text-6xl">{copy.heroTitle}</h3><p className="mt-5 max-w-xl text-base leading-7 text-white/75 sm:text-lg">{hasProducts ? starterCopy : starterCopy.replace(/,? (Bilder und Produkte|images and products|图片和产品)/, "")}</p><div className="mt-8 flex flex-wrap gap-3"><span className="inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-950">{copy.speak}</span>{hasServices ? <span className="inline-flex h-11 items-center rounded-xl border border-white/35 px-5 text-sm font-semibold text-white">{copy.viewServices}</span> : null}</div></div>
        <TemplatePlaceholderVisual label={copy.heroImage} className="min-h-64 border-white/25 bg-white/10 text-white sm:min-h-80" />
      </div>
    </section>

    <section className="border-b border-border bg-card px-5 py-5 sm:px-10"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center text-xs font-semibold uppercase tracking-[.15em] text-muted-foreground">{copy.trust.map((item) => <span key={item}>{item}</span>)}</div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">{copy.solutions}</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.solutionsTitle}</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.solutionsDescription}</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{solutionCards.map((card) => <article key={card.number} className="flex min-h-56 flex-col rounded-2xl border border-border bg-card p-5"><span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">{card.number}</span><h5 className="mt-5 text-xl font-semibold">{card.title}</h5><p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{card.body}</p><span className="mt-5 text-sm font-semibold text-primary">{copy.more}</span></article>)}</div></div></section>

    {hasServices ? <section className="bg-secondary/30 px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">{copy.services}</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.servicesTitle}</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.servicesBody}</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{serviceCards.map((title) => <article key={title} className="rounded-2xl border border-border bg-background p-5"><p className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{copy.serviceArea}</p><h5 className="mt-3 text-xl font-semibold">{title}</h5><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.serviceImage}</p><span className="mt-5 inline-flex text-sm font-semibold text-primary">{copy.view}</span></article>)}</div></div></section> : null}

    {hasProducts ? <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">{copy.products}</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.productsTitle}</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.productsBody}</p></div><div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{["01", "02", "03", "04"].map((number) => <article key={number} className="overflow-hidden rounded-2xl border border-dashed border-border bg-card"><TemplatePlaceholderVisual label={copy.productImage} className="min-h-40 rounded-none border-0 border-b" /><div className="p-4"><p className="text-xs font-semibold uppercase tracking-[.14em] text-muted-foreground">{copy.productLabel}</p><h5 className="mt-2 font-semibold">{copy.productLabel} {number}</h5><p className="mt-2 text-sm text-muted-foreground">{copy.priceOnRequest}</p></div></article>)}</div></div></section> : null}

    <section className="bg-slate-950 px-5 py-12 text-white sm:px-10 sm:py-16"><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[.85fr_1.15fr]"><TemplatePlaceholderVisual label={copy.companyImage} className="min-h-64 border-white/20 bg-white/5 text-white" /><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-cyan-200">{copy.strengthsLabel}</p><h4 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.strengthsTitle}</h4><p className="mt-4 text-sm leading-7 text-white/70">{copy.strengthsBody}</p><div className="mt-6 grid gap-3 sm:grid-cols-3">{strengthCards.map((item) => <div key={item} className="rounded-xl border border-white/15 bg-white/5 p-4 text-sm font-medium">{item}</div>)}</div></div></div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2"><TemplatePlaceholderVisual label={copy.galleryImage} className="min-h-72" /><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">{copy.aboutLabel}</p><h4 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.aboutTitle}</h4><p className="mt-4 text-sm leading-7 text-muted-foreground">{copy.aboutBody}</p><ul className="mt-6 grid gap-3 sm:grid-cols-2">{copy.aboutItems.map((item) => <li key={item} className="flex items-center gap-2 text-sm font-medium"><span className="h-2 w-2 rounded-full bg-primary" />{item}</li>)}</ul></div></div></section>

    <section className="bg-secondary/30 px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">{copy.processLabel}</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.processTitle}</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.processBody}</p></div><div className="mt-8 grid gap-4 md:grid-cols-3">{processSteps.map((title, index) => <article key={title} className="rounded-2xl border border-border bg-card p-5"><span className="text-xs font-bold text-primary">0{index + 1}</span><h5 className="mt-4 text-xl font-semibold">{title}</h5><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy.processStepBody}</p></article>)}</div></div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-6xl rounded-3xl bg-primary p-7 text-primary-foreground sm:p-10"><div className="grid gap-8 lg:grid-cols-[1fr_.8fr] lg:items-center"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary-foreground/75">{copy.contactLabel}</p><h4 className="mt-3 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.contactPrompt}</h4><p className="mt-4 max-w-xl text-sm leading-7 text-primary-foreground/80">{copy.contactDescription}</p><span className="mt-6 inline-flex h-11 items-center rounded-xl bg-background px-5 text-sm font-semibold text-foreground">{copy.contact}</span></div><div className="rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 p-5"><p className="text-sm font-semibold">{copy.helpful}</p><ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">{copy.helpfulItems.map((item) => <li key={item} className="border-b border-primary-foreground/20 pb-2 last:border-0">{item}</li>)}</ul></div></div></div></section>

    <section className="px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">{copy.messageLabel}</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em]">{copy.formTitle}</h4><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.formBody}</p></div><div className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"><label className="text-sm font-medium">{copy.name}<input disabled placeholder={copy.name} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label><label className="text-sm font-medium">{copy.email}<input disabled placeholder={copy.email} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm" /></label><label className="text-sm font-medium sm:col-span-2">{copy.message}<textarea disabled placeholder={copy.message} rows={4} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm" /></label><span className="inline-flex h-11 w-fit items-center rounded-xl bg-foreground px-5 text-sm font-semibold text-background">{copy.send}</span></div></div></section>

    <section className="bg-secondary/30 px-5 py-12 sm:px-10 sm:py-16"><div className="mx-auto max-w-3xl"><p className="text-xs font-semibold uppercase tracking-[.18em] text-muted-foreground">{copy.faqLabel}</p><h4 className="mt-2 text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.faqTitle}</h4><div className="mt-6 divide-y divide-border rounded-2xl border border-border bg-card px-5">{faqs.map((question) => <details key={question} className="py-5"><summary className="cursor-pointer font-semibold">{question}</summary><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy.faqBody}</p></details>)}</div></div></section>

    <section className="border-t border-border bg-slate-950 px-5 py-12 text-center text-white sm:px-10 sm:py-16"><h4 className="text-3xl font-semibold tracking-[-.04em] sm:text-4xl">{copy.startTitle}</h4><p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70">{copy.startBody}</p><span className="mt-6 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-semibold text-slate-950">{copy.create}</span></section>
    <footer className="flex flex-col gap-4 border-t border-border bg-card px-5 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-10"><span className="font-semibold text-foreground">{copy.footerBrand}</span><span>{copy.legal}</span><span>Powered by Lulu AI</span></footer>

    <div className="border-t border-border px-5 py-4 text-sm text-muted-foreground sm:px-10"><span className="font-semibold text-foreground">{copy.unpublished}</span> {copy.unpublishedBody}</div>
  </div>;
}

export default function ManagedStorefrontApp({ initialPanel }: { initialPanel?: ManagedWebsitePanel } = {}) {
  const t = useTranslation();
  const workspaceId = getSelectedWorkspaceId();
  const [sites, setSites] = useState<WebsiteSite[]>([]);
  const [selectedSite, setSelectedSite] = useState<WebsiteSite | null>(null);
  const [storefront, setStorefront] = useState<Storefront | null>(null);
  const [job, setJob] = useState<WebsiteGenerationJob | null>(null);
  const [siteName, setSiteName] = useState("Meine Lulu Website & Shop");
  const [prompt, setPrompt] = useState("Erstelle eine vertrauenswürdige globale Website mit integriertem Online-Shop für mein Unternehmen. Nutze ausschließlich verifizierte Unternehmens- und Produktdaten.");
  const [panel, setPanel] = useState<ManagedWebsitePanel>(() => initialPanel ?? panelFromLocation() ?? "builder");
  const [busy, setBusy] = useState<"create" | "generate" | "publish" | "refresh" | null>(null);
  const [error, setError] = useState("");
  const [catalogPresence, setCatalogPresence] = useState({ hasServices: false, hasProducts: false });
  const [catalogItems, setCatalogItems] = useState<{ products: TemplateCatalogItem[]; services: TemplateCatalogItem[] }>({ products: [], services: [] });
  const [branding, setBranding] = useState<TemplateBranding>({});
  const [brandSeed, setBrandSeed] = useState(workspaceId ?? "lulu-template");

  const load = async () => {
    if (!workspaceId) return;
    setBusy("refresh"); setError("");
    try {
      const [result, onboardingResult, productsResult, profileResult] = await Promise.all([
        websitesApi.list(workspaceId),
        onboardingApi.snapshot(workspaceId).catch(() => null),
        productsApi.list(workspaceId, "limit=100").catch(() => null),
        workspaceProfileApi.get(workspaceId).catch(() => null),
      ]);
      const activeOffering = (status: string) => !["archived", "inactive", "deleted"].includes(status.trim().toLowerCase());
      const publicProduct = (product: { status: string; productType?: string; visibility?: unknown }) => product.status.trim().toLowerCase() === "active"
        && String(product.visibility ?? "public").trim().toLowerCase() === "public"
        && String(product.productType ?? "").trim().toLowerCase() !== "service";
      const offerings = onboardingResult?.data.offerings ?? [];
      setBrandSeed(`${workspaceId}:${JSON.stringify(onboardingResult?.data ?? {})}`);
      const hasServices = offerings.some((offering) => offering.offeringType === "service" && activeOffering(offering.status));
      const hasProducts = offerings.some((offering) => offering.offeringType === "product" && activeOffering(offering.status))
        || (productsResult?.data.items ?? []).some((product) => publicProduct(product));
      setCatalogPresence({ hasServices, hasProducts });
      const offeringProducts = offerings.filter((offering) => offering.offeringType === "product" && activeOffering(offering.status)).map(offeringToTemplateItem);
      const productRecords = (productsResult?.data.items ?? []).filter((product) => publicProduct(product)).map((product) => ({
        name: product.name,
        description: product.shortDescription || product.longDescription,
        imageUrl: typeof product.imageUrl === "string" ? product.imageUrl : null,
        category: typeof product.category === "string" ? product.category : null,
        priceAmount: product.defaultPrice,
        priceCurrency: product.defaultCurrency,
      }));
      setCatalogItems({
        products: offeringProducts.length ? offeringProducts : productRecords,
        services: offerings.filter((offering) => offering.offeringType === "service" && activeOffering(offering.status)).map(offeringToTemplateItem),
      });
      setBranding({ companyName: profileResult?.data.companyName || onboardingResult?.data.workspace.companyName || null, logoUrl: profileResult?.data.logoUrl || null });
      const managed = result.data.items.filter((site) => site.provider === "managed");
      setSites(managed);
      const next = managed.find((site) => site.id === selectedSite?.id) ?? managed[0] ?? null;
      setSelectedSite(next);
      setStorefront(null);
      setJob(null);
      if (next) {
        const active = await websitesApi.getActiveGenerationJob(workspaceId, next.id);
        setJob(active.data);
        if (next.status === "published") {
          const slug = typeof next.settings?.managedWebsite === "object" && next.settings.managedWebsite && typeof (next.settings.managedWebsite as Record<string, unknown>).publicSlug === "string" ? String((next.settings.managedWebsite as Record<string, unknown>).publicSlug) : `site-${next.id.slice(0, 8)}`;
          try {
            const nextStorefront = (await storefrontApi.get(slug)).data;
            setStorefront(nextStorefront);
            if (nextStorefront.products.length > 0) setCatalogPresence((current) => ({ ...current, hasProducts: true }));
          } catch { setStorefront(null); }
        }
      }
    } catch (requestError) { setError(getFriendlyErrorMessage(requestError, "Die Lulu-Website konnte nicht geladen werden.")); }
    finally { setBusy(null); }
  };

  useEffect(() => { void load(); }, [workspaceId]);

  useEffect(() => {
    const syncPanel = () => setPanel(initialPanel ?? panelFromLocation() ?? "builder");
    window.addEventListener("popstate", syncPanel);
    return () => window.removeEventListener("popstate", syncPanel);
  }, [initialPanel]);

  const setActivePanel = (next: ManagedWebsitePanel) => {
    setPanel(next);
    navigateApp(WEBSITE_PANEL_ROUTES[next]);
  };

  useEffect(() => {
    if (!workspaceId || !selectedSite || !job || !["queued", "planning", "publishing"].includes(job.status)) return;
    const timer = window.setInterval(() => { void websitesApi.getGenerationJob(workspaceId, selectedSite.id, job.id).then((response) => setJob(response.data)).catch(() => undefined); }, 2_000);
    return () => window.clearInterval(timer);
  }, [workspaceId, selectedSite?.id, job?.id, job?.status]);

  const createManagedSite = async () => {
    if (!workspaceId) return;
    setBusy("create"); setError("");
    try {
      const response = await websitesApi.create(workspaceId, { provider: "managed", ownershipMode: "managed", name: siteName });
      setSelectedSite(response.data); setSites((current) => [response.data, ...current]);
    } catch (requestError) { setError(getFriendlyErrorMessage(requestError, "Die Lulu-Website konnte nicht erstellt werden.")); }
    finally { setBusy(null); }
  };

  const generate = async () => {
    if (!workspaceId || !selectedSite) return;
    setBusy("generate"); setError("");
    try { const response = await websitesApi.createGenerationJob(workspaceId, selectedSite.id, prompt); setJob(response.data); setSelectedSite({ ...selectedSite, status: "generating" }); }
    catch (requestError) { setError(getFriendlyErrorMessage(requestError, "Lulu konnte die Website noch nicht erstellen.")); }
    finally { setBusy(null); }
  };

  const publish = async () => {
    if (!workspaceId || !selectedSite || !job) return;
    setBusy("publish"); setError("");
    try { const response = await websitesApi.publishGenerationJob(workspaceId, selectedSite.id, job.id); setJob(response.data); setSelectedSite({ ...selectedSite, status: "published", settings: { ...selectedSite.settings, managedWebsite: response.data.providerResult } }); await load(); }
    catch (requestError) { setError(getFriendlyErrorMessage(requestError, "Die Lulu-Website konnte nicht veröffentlicht werden.")); }
    finally { setBusy(null); }
  };

  const activePlan = useMemo(() => (job?.plan && typeof job.plan === "object" ? job.plan : storefront?.plan), [job?.plan, storefront?.plan]);
  const publicSlug = storefront?.slug ?? (selectedSite ? `site-${selectedSite.id.slice(0, 8)}` : "");
  const standalonePreview = new URLSearchParams(window.location.search).get("standalone") === "1";
  const previewUrl = storefront && publicSlug
    ? `/api/v1/public/storefront/${encodeURIComponent(publicSlug)}/render`
    : `${window.location.pathname}?panel=preview&standalone=1#home`;

  if (standalonePreview && !storefront) {
    return <div className="lulu-standalone-preview min-h-screen w-full overflow-x-hidden bg-[var(--background)] p-0"><EmptyWebsiteTemplate {...catalogPresence} products={catalogItems.products} services={catalogItems.services} branding={branding} palette={deriveTemplatePalette(brandSeed)} /></div>;
  }

  return <main className="min-h-screen bg-[var(--background)] px-5 py-7 text-foreground sm:px-8 sm:py-10"><div className="mx-auto max-w-[1400px] space-y-6">
    <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-primary">Lulu AI / Online Presence</p><h1 className="mt-2 text-4xl font-semibold tracking-[-.05em]">Website & Shop</h1><p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">Lulu erstellt, veröffentlicht und betreibt deine Website und deinen Online-Shop selbst. WordPress, Webflow und Shopify sind dafür nicht erforderlich.</p></div><button type="button" onClick={() => void load()} disabled={busy === "refresh"} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium hover:bg-secondary disabled:opacity-60"><RefreshCw size={15} className={busy === "refresh" ? "animate-spin" : ""} /> Aktualisieren</button></header>
    {error ? <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"><XCircle size={17} className="mt-0.5 shrink-0" />{error}</div> : null}
    <nav aria-label={t("Website")} className="flex flex-wrap gap-2 rounded-2xl border border-border bg-card p-2">
      {([
        ["builder", "Website bearbeiten", Sparkles],
        ["preview", "Vorschau", ShoppingBag],
        ["media", "Medien", Image],
        ["domains", "Domain", Globe2],
      ] as const).map(([next, label, Icon]) => {
        const active = panel === next;
        return <a
          key={next}
          href={WEBSITE_PANEL_ROUTES[next]}
          aria-current={active ? "page" : undefined}
          style={active ? { color: "#ffffff" } : undefined}
          onClick={(event) => {
            event.preventDefault();
            setActivePanel(next);
          }}
          className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${active ? "bg-foreground text-white" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
        >
          <Icon size={15} aria-hidden="true" className="mr-2 shrink-0" />
          {label}
        </a>;
      })}
    </nav>
    {panel === "builder" ? <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,.75fr)]"><div className="space-y-6"><section className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Lulu Managed Hosting</p><h2 className="mt-2 text-2xl font-semibold">Deine eigene Website</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Ein kontrolliertes Template, verifizierte Unternehmensdaten und echte Veröffentlichungsstatus – keine simulierten Provider-Aktionen.</p></div><span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary"><Globe2 size={22} /></span></div>{!selectedSite ? <div className="mt-6 space-y-4"><label className="block text-sm font-medium">Name der Website<input value={siteName} onChange={(event) => setSiteName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 outline-none focus:border-primary" /></label><button type="button" onClick={() => void createManagedSite()} disabled={busy === "create" || !siteName.trim()} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy === "create" ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Lulu-Website erstellen</button></div> : <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">Status</p><p className="mt-2 flex items-center gap-2 font-semibold"><span className={`h-2.5 w-2.5 rounded-full ${selectedSite.status === "published" ? "bg-emerald-500" : "bg-amber-500"}`} />{statusLabel(selectedSite.status)}</p></div><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">Template</p><p className="mt-2 font-semibold">{String((activePlan as Record<string, unknown> | undefined)?.templateKey ?? "lulu-standard-v1")}</p></div><div className="rounded-xl border border-border bg-background p-4"><p className="text-xs uppercase tracking-[.12em] text-muted-foreground">Shop-Produkte</p><p className="mt-2 flex items-center gap-2 font-semibold"><Package size={16} />{storefront?.products.length ?? "—"}</p></div></div>}</section>{selectedSite ? <section className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">AI Website & Shop Plan</p><h2 className="mt-2 text-xl font-semibold">Inhalte aus deinem Unternehmen</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Lulu nutzt Profil, Knowledge Base und kanonische Produkte. Fehlende Premium-Bilder werden später als Asset-Aufgaben ergänzt.</p></div>{job?.status === "published" ? <CheckCircle2 className="text-emerald-600" /> : null}</div><label className="mt-5 block text-sm font-medium">Anweisung für Lulu<textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} rows={5} className="mt-2 w-full resize-y rounded-xl border border-border bg-background p-3 text-sm outline-none focus:border-primary" /></label><div className="mt-4 flex flex-wrap gap-3"><button type="button" onClick={() => void generate()} disabled={busy === "generate" || ["queued", "planning", "publishing"].includes(job?.status ?? "")} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground disabled:opacity-60">{busy === "generate" || ["queued", "planning", "publishing"].includes(job?.status ?? "") ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} Website & Shop generieren</button>{job && ["preview", "generated"].includes(job.status) ? <button type="button" onClick={() => void publish()} disabled={busy === "publish"} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-5 text-sm font-semibold text-emerald-800 disabled:opacity-60">{busy === "publish" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />} Veröffentlichen</button> : null}{job?.status === "failed" ? <p className="self-center text-sm text-rose-700">Die Generierung wurde angehalten: {job.errorMessage || "Bitte Anforderungen und Knowledge Base prüfen."}</p> : null}</div>{job ? <p className="mt-4 text-xs text-muted-foreground">Letzter Lauf: {statusLabel(job.status)} · {new Date(job.updatedAt).toLocaleString()}</p> : null}</section> : null}</div><aside className="rounded-2xl border border-border bg-card p-5 sm:p-7"><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Ein System</p><h2 className="mt-2 text-xl font-semibold">Was Lulu automatisch übernimmt</h2><div className="mt-5 space-y-4">{["Template mit verifizierten Firmendaten füllen", "Produkte aus dem zentralen Katalog anzeigen", "Fehlende Bildbereiche erkennen", "Website und Shop als eine Marke veröffentlichen", "Domainbesitz prüfen und sichere Aktivierung verlangen"].map((item) => <div key={item} className="flex gap-3 text-sm leading-6"><CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" />{item}</div>)}</div></aside></section> : null}
    {panel === "preview" ? <section className="space-y-6"><div className="rounded-2xl border border-border bg-card p-5 sm:p-7"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.15em] text-primary">Lulu Storefront</p><h2 className="mt-2 text-2xl font-semibold">Website-Vorschau</h2><p className="mt-2 text-sm text-muted-foreground">So sehen Kunden deine veröffentlichte Website. Leistungen und Produkte werden nur angezeigt, wenn sie wirklich vorhanden sind.</p></div><a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold hover:bg-secondary">{t("Open")} <ExternalLink size={15} /></a></div>{!selectedSite || !storefront ? <EmptyWebsiteTemplate {...catalogPresence} products={catalogItems.products} services={catalogItems.services} branding={branding} palette={deriveTemplatePalette(brandSeed)} /> : null}{storefront?.products.length ? <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{storefront.products.map((product) => <ProductCard key={product.id} product={product} />)}</div> : storefront ? <div className="mt-6 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Noch keine öffentlich freigegebenen Produkte. Veröffentliche zuerst die Website im Editor.</div> : null}</div></section> : null}
    {panel === "media" ? <section className="space-y-6">{selectedSite ? <WebsiteAssetPanel workspaceId={workspaceId ?? ""} site={selectedSite} /> : <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Erstelle zuerst deine Lulu-Website.</div>}</section> : null}
    {panel === "domains" ? <section className="space-y-6"><DomainOwnershipPanel key={selectedSite?.id ?? "workspace-domain"} site={selectedSite} workspaceId={workspaceId} onSiteCreated={setSelectedSite} /><div className="rounded-2xl border border-border bg-card p-5 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">DNS-Ablauf:</strong> Lulu prüft den Domainbesitz über TXT. Danach zeigt Lulu den CNAME/ALIAS-Eintrag für die Veröffentlichung. DNS wird nicht ohne ausdrückliche Berechtigung des Kunden verändert.</div></section> : null}
  </div></main>;
}
