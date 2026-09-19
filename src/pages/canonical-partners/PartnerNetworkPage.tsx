import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Building2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Globe2,
  ImagePlus,
  Mail,
  MapPin,
  Phone,
  Plus,
  RefreshCw,
  Search,
  Send,
  Star,
  UserRound,
  Wrench,
  X,
} from "lucide-react";
import { useLuluApp } from "../../api/LuluAppContext";
import { getFriendlyErrorMessage } from "../../api/client";
import {
  createRecord,
  updateRecord,
  type WorkspaceRecord,
} from "../../api/records";
import { useLiveRecords } from "../../api/useLiveRecords";
import { WorkspaceSurfaceShell } from "../../components/WorkspaceSurfaceShell";
import {
  EmptyState,
  Feedback,
  Modal,
  StatusBadge,
  fieldClass,
  formatDate,
  formatMoney,
  primaryButtonClass,
  secondaryButtonClass,
  StatCard,
} from "../canonical-commerce/commerce-ui";

const PARTNER_RESOURCE = "crm_partners";
const COMPANY_RESOURCE = "crm_companies";
const REVIEW_RESOURCE = "crm_partner_reviews";
const ORDER_RESOURCE = "crm_partner_work_orders";

type Tab = "directory" | "orders" | "reviews";
type LineDraft = {
  description: string;
  quantity: string;
  unit: string;
  unitPrice: string;
};
type PartnerDraft = {
  name: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  services: string;
  description: string;
};
type OrderDraft = {
  title: string;
  customerName: string;
  customerContact: string;
  customerAddress: string;
  partnerId: string;
  deadline: string;
  notes: string;
};
type ReviewDraft = {
  orderId: string;
  partnerId: string;
  rating: number;
  quality: number;
  reliability: number;
  communication: number;
  comment: string;
};

const emptyPartner: PartnerDraft = {
  name: "",
  contactName: "",
  email: "",
  phone: "",
  website: "",
  address: "",
  postalCode: "",
  city: "",
  region: "",
  services: "",
  description: "",
};
const emptyOrder: OrderDraft = {
  title: "",
  customerName: "",
  customerContact: "",
  customerAddress: "",
  partnerId: "",
  deadline: "",
  notes: "",
};
const emptyReview: ReviewDraft = {
  orderId: "",
  partnerId: "",
  rating: 5,
  quality: 5,
  reliability: 5,
  communication: 5,
  comment: "",
};
const emptyLine = (): LineDraft => ({
  description: "",
  quantity: "1",
  unit: "Stück",
  unitPrice: "",
});

function text(record: WorkspaceRecord, key: string) {
  const value = record.data?.[key];
  return typeof value === "string" ? value : value == null ? "" : String(value);
}

function strings(record: WorkspaceRecord, key: string) {
  const value = record.data?.[key];
  if (Array.isArray(value))
    return value.filter(
      (item): item is string =>
        typeof item === "string" && item.trim().length > 0,
    );
  if (typeof value === "string")
    return value
      .split(/[,\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  return [];
}

function images(record: WorkspaceRecord) {
  return strings(record, "images")
    .concat(strings(record, "imageUrls"))
    .filter((item, index, all) => all.indexOf(item) === index);
}

function numberValue(value: unknown) {
  const result = Number(value ?? 0);
  return Number.isFinite(result) ? result : 0;
}

function partnerLocation(record: WorkspaceRecord) {
  return (
    [text(record, "postalCode"), text(record, "city"), text(record, "region")]
      .filter(Boolean)
      .join(" ") ||
    text(record, "address") ||
    "Standort nicht hinterlegt"
  );
}

function services(record: WorkspaceRecord) {
  return strings(record, "services").length
    ? strings(record, "services")
    : [text(record, "industry") || "Handwerk & Sanierung"];
}

function partnerRating(record: WorkspaceRecord, reviews: WorkspaceRecord[]) {
  const relevant = reviews.filter(
    (review) =>
      text(review, "partnerId") === record.id || review.parentId === record.id,
  );
  if (!relevant.length) return { average: null as number | null, count: 0 };
  const average =
    relevant.reduce(
      (sum, review) => sum + numberValue(review.data?.rating),
      0,
    ) / relevant.length;
  return { average, count: relevant.length };
}

function orderPartnerId(order: WorkspaceRecord) {
  return text(order, "partnerId") || order.assigneeId || "";
}

function lineTotal(line: LineDraft) {
  return numberValue(line.quantity) * numberValue(line.unitPrice);
}

function orderLines(order: WorkspaceRecord): Array<Record<string, unknown>> {
  return Array.isArray(order.data?.lines)
    ? order.data.lines.filter(
        (line): line is Record<string, unknown> =>
          Boolean(line) && typeof line === "object",
      )
    : [];
}

function imageDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(reader.error ?? new Error("Image could not be read"));
    reader.readAsDataURL(file);
  });
}

function RatingStars({ value, size = 15 }: { value: number; size?: number }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 text-amber-500"
      aria-label={`${value.toFixed(1)} von 5 Sternen`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          fill={star <= Math.round(value) ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-[var(--foreground)]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={fieldClass}
      />
    </label>
  );
}

function PartnerCard({
  record,
  reviews,
  selected,
  onSelect,
}: {
  record: WorkspaceRecord;
  reviews: WorkspaceRecord[];
  selected: boolean;
  onSelect: () => void;
}) {
  const rating = partnerRating(record, reviews);
  const photo = images(record)[0];
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${selected ? "border-violet-400 bg-violet-50/60 shadow-sm" : "border-[var(--border)] bg-[var(--card)]"}`}
    >
      <div className="flex gap-3">
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-cyan-400 text-white">
          {photo ? (
            <img src={photo} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="grid h-full place-items-center">
              <Building2 size={22} />
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <strong className="truncate text-sm">{record.name}</strong>
            <ChevronRight
              size={16}
              className="shrink-0 text-[var(--muted-foreground)]"
            />
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--muted-foreground)]">
            <MapPin size={12} />
            {partnerLocation(record)}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {rating.average == null ? (
              <span className="text-xs text-[var(--muted-foreground)]">
                Noch keine Bewertung
              </span>
            ) : (
              <>
                <RatingStars value={rating.average} size={13} />
                <span className="text-xs font-medium">
                  {rating.average.toFixed(1)}
                </span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  ({rating.count})
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {services(record)
          .slice(0, 3)
          .map((service) => (
            <span
              key={service}
              className="rounded-full bg-[var(--secondary)] px-2 py-1 text-[10px] font-medium text-[var(--muted-foreground)]"
            >
              {service}
            </span>
          ))}
      </div>
    </button>
  );
}

function PartnerDetail({
  record,
  reviews,
  onEdit,
  onCreateOrder,
}: {
  record: WorkspaceRecord;
  reviews: WorkspaceRecord[];
  onEdit: () => void;
  onCreateOrder: () => void;
}) {
  const rating = partnerRating(record, reviews);
  const photoList = images(record);
  const website = text(record, "website");
  return (
    <article className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-sm">
      <header className="border-b border-[var(--border)] bg-gradient-to-br from-violet-600 to-cyan-500 p-5 text-white sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-white/75">
              Handwerkspartner
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              {record.name}
            </h2>
            <p className="mt-1 text-sm text-white/80">
              {text(record, "description") || "Profil aus der Partnerdatenbank"}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="rounded-xl bg-white/15 px-3 py-2 text-xs font-semibold text-white backdrop-blur hover:bg-white/25"
            >
              Profil bearbeiten
            </button>
            <button
              type="button"
              onClick={onCreateOrder}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-xs font-semibold text-violet-700 hover:bg-white/90"
            >
              <ClipboardList size={14} /> Auftrag erstellen
            </button>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <div className="rounded-xl bg-white/15 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              Bewertung
            </p>
            <div className="mt-1 flex items-center gap-2">
              <strong className="text-lg">
                {rating.average == null ? "—" : rating.average.toFixed(1)}
              </strong>
              {rating.average != null ? (
                <RatingStars value={rating.average} size={14} />
              ) : null}
              <span className="text-xs text-white/70">{rating.count} Jobs</span>
            </div>
          </div>
          <div className="rounded-xl bg-white/15 px-3 py-2">
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              Leistungen
            </p>
            <strong className="mt-1 block text-sm">
              {services(record).length} Bereiche
            </strong>
          </div>
        </div>
      </header>
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[1fr_240px]">
        <div className="space-y-5">
          <section className="grid gap-3 sm:grid-cols-2">
            <Info
              icon={<UserRound size={15} />}
              label="Ansprechpartner"
              value={text(record, "contactName") || "Nicht hinterlegt"}
            />
            <Info
              icon={<Mail size={15} />}
              label="E-Mail"
              value={text(record, "email") || "Nicht hinterlegt"}
              href={
                text(record, "email")
                  ? `mailto:${text(record, "email")}`
                  : undefined
              }
            />
            <Info
              icon={<Phone size={15} />}
              label="Telefon"
              value={text(record, "phone") || "Nicht hinterlegt"}
              href={
                text(record, "phone")
                  ? `tel:${text(record, "phone")}`
                  : undefined
              }
            />
            <Info
              icon={<MapPin size={15} />}
              label="Standort"
              value={partnerLocation(record)}
            />
            <Info
              icon={<Wrench size={15} />}
              label="Dienstleistungen"
              value={services(record).join(" · ")}
            />
            <Info
              icon={<Globe2 size={15} />}
              label="Website"
              value={website || "Nicht hinterlegt"}
              href={
                website
                  ? /^https?:/i.test(website)
                    ? website
                    : `https://${website}`
                  : undefined
              }
            />
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">
              Dienstleistungsprofil
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {services(record).map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                >
                  {service}
                </span>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">
              Bewertungen nach Auftrag
            </h3>
            {reviews
              .filter(
                (review) =>
                  text(review, "partnerId") === record.id ||
                  review.parentId === record.id,
              )
              .slice(0, 4)
              .map((review) => (
                <div
                  key={review.id}
                  className="mt-3 rounded-xl border border-[var(--border)] p-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <RatingStars
                      value={numberValue(review.data?.rating)}
                      size={13}
                    />
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm">
                    {text(review, "comment") || "Keine Bemerkung hinterlegt."}
                  </p>
                </div>
              ))}
            {!reviews.some(
              (review) =>
                text(review, "partnerId") === record.id ||
                review.parentId === record.id,
            ) ? (
              <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                Nach einem abgeschlossenen Auftrag kann hier eine Bewertung
                erfasst werden.
              </p>
            ) : null}
          </section>
        </div>
        <aside>
          <h3 className="text-xs font-semibold uppercase tracking-[.14em] text-[var(--muted-foreground)]">
            Bilder & Referenzen
          </h3>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {photoList.length ? (
              photoList
                .slice(0, 6)
                .map((photo, index) => (
                  <img
                    key={`${photo}-${index}`}
                    src={photo}
                    alt={`Referenz ${index + 1}`}
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                ))
            ) : (
              <div className="col-span-2 grid aspect-[4/3] place-items-center rounded-xl border border-dashed border-[var(--border)] p-5 text-center text-xs text-[var(--muted-foreground)]">
                <ImagePlus size={20} className="mb-2" />
                Noch keine Bilder hinterlegt
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}

function Info({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const body = (
    <>
      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-violet-50 text-violet-600">
        {icon}
      </span>
      <span className="min-w-0">
        <small className="block text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
          {label}
        </small>
        <strong className="mt-1 block break-words text-xs font-medium">
          {value}
        </strong>
      </span>
    </>
  );
  return href ? (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] p-3 hover:bg-[var(--secondary)]"
    >
      {body}
    </a>
  ) : (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-[var(--border)] p-3">
      {body}
    </div>
  );
}

export default function PartnerNetworkPage() {
  const { hasCapability } = useLuluApp();
  const canWrite = hasCapability("crm.manage");
  const partnersState = useLiveRecords(PARTNER_RESOURCE, "limit=100");
  const companiesState = useLiveRecords(COMPANY_RESOURCE, "limit=100");
  const reviewsState = useLiveRecords(REVIEW_RESOURCE, "limit=100");
  const ordersState = useLiveRecords(ORDER_RESOURCE, "limit=100");
  const [tab, setTab] = useState<Tab>("directory");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [partnerModal, setPartnerModal] = useState(false);
  const [editingPartner, setEditingPartner] = useState<WorkspaceRecord | null>(
    null,
  );
  const [partnerForm, setPartnerForm] = useState(emptyPartner);
  const [partnerImages, setPartnerImages] = useState<string[]>([]);
  const [orderModal, setOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState(emptyOrder);
  const [orderLinesDraft, setOrderLinesDraft] = useState<LineDraft[]>([
    emptyLine(),
  ]);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState(emptyReview);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const partnerRecords = useMemo(() => {
    const fromPartners = partnersState.items.map((record) => ({
      ...record,
      __source: PARTNER_RESOURCE,
    }));
    const existingIds = new Set(fromPartners.map((record) => record.id));
    const fromCompanies = companiesState.items
      .filter((record) => !existingIds.has(record.id))
      .map((record) => ({ ...record, __source: COMPANY_RESOURCE }));
    return [...fromPartners, ...fromCompanies] as Array<
      WorkspaceRecord & { __source: string }
    >;
  }, [companiesState.items, partnersState.items]);
  const filteredPartners = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return normalized
      ? partnerRecords.filter((record) =>
          `${record.name} ${JSON.stringify(record.data)}`
            .toLowerCase()
            .includes(normalized),
        )
      : partnerRecords;
  }, [partnerRecords, query]);
  const selectedPartner =
    filteredPartners.find((record) => record.id === selectedId) ??
    partnerRecords.find((record) => record.id === selectedId) ??
    filteredPartners[0] ??
    null;
  const ratingCount = reviewsState.items.length;
  const completedOrders = ordersState.items.filter((order) =>
    ["Abgeschlossen", "COMPLETED", "completed"].includes(order.status),
  );
  const totalValue = ordersState.items.reduce(
    (sum, order) => sum + numberValue(order.valueAmount ?? order.data?.total),
    0,
  );

  useEffect(() => {
    if (!selectedPartner) setSelectedId("");
    else if (
      !selectedId ||
      !partnerRecords.some((record) => record.id === selectedId)
    )
      setSelectedId(selectedPartner.id);
  }, [partnerRecords, selectedId, selectedPartner]);

  const refreshAll = async () => {
    await Promise.all([
      partnersState.refresh(),
      companiesState.refresh(),
      reviewsState.refresh(),
      ordersState.refresh(),
    ]);
  };
  const openNewPartner = () => {
    setEditingPartner(null);
    setPartnerForm(emptyPartner);
    setPartnerImages([]);
    setPartnerModal(true);
    setError("");
  };
  const openEditPartner = (record: WorkspaceRecord) => {
    setEditingPartner(record);
    setPartnerForm({
      name: record.name,
      contactName: text(record, "contactName"),
      email: text(record, "email"),
      phone: text(record, "phone"),
      website: text(record, "website"),
      address: text(record, "address"),
      postalCode: text(record, "postalCode"),
      city: text(record, "city"),
      region: text(record, "region"),
      services: services(record).join(", "),
      description: text(record, "description"),
    });
    setPartnerImages(images(record));
    setPartnerModal(true);
    setError("");
  };
  const updatePartnerForm = (key: keyof PartnerDraft, value: string) =>
    setPartnerForm((current) => ({ ...current, [key]: value }));
  const onImages = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? [])
      .filter(
        (file) => file.type.startsWith("image/") && file.size <= 1_500_000,
      )
      .slice(0, 6);
    if (!files.length) return;
    try {
      const loaded = await Promise.all(files.map(imageDataUrl));
      setPartnerImages((current) => [...current, ...loaded].slice(0, 6));
    } catch {
      setError("Mindestens ein Bild konnte nicht gelesen werden.");
    }
    event.target.value = "";
  };
  const savePartner = async () => {
    if (!canWrite) return;
    if (!partnerForm.name.trim()) {
      setError("Der Firmenname ist erforderlich.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const data = {
        ...(editingPartner?.data ?? {}),
        contactName: partnerForm.contactName.trim() || null,
        email: partnerForm.email.trim() || null,
        phone: partnerForm.phone.trim() || null,
        website: partnerForm.website.trim() || null,
        address: partnerForm.address.trim() || null,
        postalCode: partnerForm.postalCode.trim() || null,
        city: partnerForm.city.trim() || null,
        region: partnerForm.region.trim() || null,
        services: partnerForm.services
          .split(/[,\n]/)
          .map((item) => item.trim())
          .filter(Boolean),
        description: partnerForm.description.trim() || null,
        images: partnerImages,
      };
      if (editingPartner)
        await updateRecord(editingPartner.resourceType, editingPartner.id, {
          name: partnerForm.name.trim(),
          description: partnerForm.description.trim() || null,
          data,
          expectedVersion: editingPartner.version,
        });
      else
        await createRecord(PARTNER_RESOURCE, {
          name: partnerForm.name.trim(),
          description: partnerForm.description.trim() || null,
          status: "Partner",
          data,
          tags: ["handwerker", "partner"],
        });
      setPartnerModal(false);
      setNotice(
        "Partnerprofil gespeichert. Die Daten sind jetzt in der Handwerkerdatenbank verfügbar.",
      );
      await refreshAll();
    } catch (cause) {
      setError(
        getFriendlyErrorMessage(
          cause,
          "Das Partnerprofil konnte nicht gespeichert werden.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };
  const openNewOrder = (partnerId = selectedPartner?.id ?? "") => {
    setOrderForm({ ...emptyOrder, partnerId });
    setOrderLinesDraft([emptyLine()]);
    setOrderModal(true);
    setError("");
  };
  const updateLine = (index: number, key: keyof LineDraft, value: string) =>
    setOrderLinesDraft((current) =>
      current.map((line, lineIndex) =>
        lineIndex === index ? { ...line, [key]: value } : line,
      ),
    );
  const saveOrder = async () => {
    if (!canWrite) return;
    if (!orderForm.title.trim() || !orderForm.partnerId) {
      setError("Titel und Partner sind erforderlich.");
      return;
    }
    const partner = partnerRecords.find(
      (item) => item.id === orderForm.partnerId,
    );
    const lines = orderLinesDraft
      .filter((line) => line.description.trim())
      .map((line) => ({
        ...line,
        quantity: numberValue(line.quantity),
        unitPrice: numberValue(line.unitPrice),
        total: lineTotal(line),
      }));
    const total = lines.reduce((sum, line) => sum + numberValue(line.total), 0);
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await createRecord(ORDER_RESOURCE, {
        name: orderForm.title.trim(),
        description: orderForm.notes.trim() || null,
        status: "Entwurf",
        stage: "draft",
        dueAt: orderForm.deadline
          ? new Date(`${orderForm.deadline}T12:00:00Z`).toISOString()
          : null,
        valueAmount: total,
        currency: "EUR",
        parentId: orderForm.partnerId,
        data: {
          partnerId: orderForm.partnerId,
          partnerName: partner?.name ?? "",
          customerName: orderForm.customerName.trim() || null,
          customerContact: orderForm.customerContact.trim() || null,
          customerAddress: orderForm.customerAddress.trim() || null,
          lines,
          total,
          notes: orderForm.notes.trim() || null,
        },
      });
      setOrderModal(false);
      setTab("orders");
      setNotice("Auftrag als LV-Entwurf gespeichert.");
      await ordersState.refresh();
    } catch (cause) {
      setError(
        getFriendlyErrorMessage(
          cause,
          "Der Auftrag konnte nicht gespeichert werden.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };
  const forwardOrder = async (order: WorkspaceRecord) => {
    if (!canWrite || busy) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await updateRecord(ORDER_RESOURCE, order.id, {
        status: "Gesendet",
        stage: "sent",
        data: { ...order.data, sentAt: new Date().toISOString() },
        expectedVersion: order.version,
      });
      setNotice("Der Auftrag wurde an den Partner weitergegeben.");
      await ordersState.refresh();
    } catch (cause) {
      setError(
        getFriendlyErrorMessage(
          cause,
          "Der Auftrag konnte nicht weitergegeben werden.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };
  const completeOrder = async (order: WorkspaceRecord) => {
    if (!canWrite || busy) return;
    setBusy(true);
    setError("");
    try {
      await updateRecord(ORDER_RESOURCE, order.id, {
        status: "Abgeschlossen",
        stage: "completed",
        data: { ...order.data, completedAt: new Date().toISOString() },
        expectedVersion: order.version,
      });
      setNotice(
        "Auftrag abgeschlossen. Jetzt kann eine Bewertung erfasst werden.",
      );
      await ordersState.refresh();
    } catch (cause) {
      setError(
        getFriendlyErrorMessage(
          cause,
          "Der Auftrag konnte nicht abgeschlossen werden.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };
  const openReview = (order?: WorkspaceRecord) => {
    setReviewForm({
      ...emptyReview,
      orderId: order?.id ?? "",
      partnerId: order ? orderPartnerId(order) : (selectedPartner?.id ?? ""),
    });
    setReviewModal(true);
    setError("");
  };
  const saveReview = async () => {
    if (!canWrite || !reviewForm.orderId || !reviewForm.partnerId) {
      setError("Auftrag und Partner sind erforderlich.");
      return;
    }
    const order = ordersState.items.find(
      (item) => item.id === reviewForm.orderId,
    );
    const partner = partnerRecords.find(
      (item) => item.id === reviewForm.partnerId,
    );
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await createRecord(REVIEW_RESOURCE, {
        name: `${partner?.name ?? "Partner"} · ${order?.name ?? "Auftrag"}`,
        status: "Veröffentlicht",
        parentId: reviewForm.partnerId,
        data: {
          partnerId: reviewForm.partnerId,
          orderId: reviewForm.orderId,
          orderName: order?.name ?? "",
          rating: reviewForm.rating,
          quality: reviewForm.quality,
          reliability: reviewForm.reliability,
          communication: reviewForm.communication,
          comment: reviewForm.comment.trim() || null,
        },
      });
      setReviewModal(false);
      setTab("reviews");
      setNotice("Bewertung gespeichert und dem Auftrag zugeordnet.");
      await reviewsState.refresh();
    } catch (cause) {
      setError(
        getFriendlyErrorMessage(
          cause,
          "Die Bewertung konnte nicht gespeichert werden.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const pageLoading =
    partnersState.loading || companiesState.loading || ordersState.loading;
  return (
    <WorkspaceSurfaceShell activeSlug="partner-operations-9020">
      <main className="page-frame min-h-screen min-w-0 overflow-x-clip bg-[var(--background)] p-4 sm:p-8">
        <div className="mx-auto max-w-[1500px] space-y-6">
          <header className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <p className="eyebrow">Partner Operations</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                Handwerker & Aufträge
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-[var(--muted-foreground)]">
                Alle Partnerprofile, Leistungen, Referenzen, Bewertungen und
                Leistungsverzeichnisse an einem Ort. Aufträge werden als
                strukturierter LV-Entwurf angelegt und direkt an einen Partner
                weitergegeben.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void refreshAll()}
                className={secondaryButtonClass}
                aria-label="Aktualisieren"
              >
                <RefreshCw
                  size={15}
                  className={pageLoading ? "animate-spin" : ""}
                />{" "}
                Aktualisieren
              </button>
              <button
                type="button"
                onClick={openNewPartner}
                disabled={!canWrite}
                className={primaryButtonClass}
              >
                <Plus size={16} /> Partner hinzufügen
              </button>
            </div>
          </header>
          <Feedback error={error} notice={notice} />
          <section className="grid gap-3 sm:grid-cols-3">
            <StatCard
              label="Partner in der Datenbank"
              value={partnerRecords.length}
              detail="CRM-Unternehmen und Partnerprofile"
            />
            <StatCard
              label="Offene Aufträge"
              value={
                ordersState.items.filter(
                  (item) =>
                    !["Abgeschlossen", "COMPLETED", "completed"].includes(
                      item.status,
                    ),
                ).length
              }
              detail="LVs in Bearbeitung"
            />
            <StatCard
              label="Bewertungen"
              value={ratingCount}
              detail={`${completedOrders.length} Aufträge abgeschlossen · ${formatMoney(totalValue, "EUR")} Gesamtvolumen`}
            />
          </section>
          <nav
            className="flex flex-wrap gap-2 border-b border-[var(--border)] pb-2"
            aria-label="Partnerbereich"
          >
            <button
              type="button"
              onClick={() => setTab("directory")}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium ${tab === "directory" ? "bg-[var(--foreground)] text-[var(--background)]" : "border border-[var(--border)] bg-[var(--card)]"}`}
            >
              <Building2 size={15} className="mr-2 inline" />
              Partnerdatenbank
            </button>
            <button
              type="button"
              onClick={() => setTab("orders")}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium ${tab === "orders" ? "bg-[var(--foreground)] text-[var(--background)]" : "border border-[var(--border)] bg-[var(--card)]"}`}
            >
              <ClipboardList size={15} className="mr-2 inline" />
              Aufträge & LV
            </button>
            <button
              type="button"
              onClick={() => setTab("reviews")}
              className={`rounded-xl px-4 py-2.5 text-sm font-medium ${tab === "reviews" ? "bg-[var(--foreground)] text-[var(--background)]" : "border border-[var(--border)] bg-[var(--card)]"}`}
            >
              <Star size={15} className="mr-2 inline" />
              Bewertungen
            </button>
          </nav>
          {tab === "directory" ? (
            <section className="grid min-w-0 gap-5 xl:grid-cols-[minmax(330px,.75fr)_minmax(0,1.25fr)]">
              <div className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
                <div className="flex items-center gap-3 border-b border-[var(--border)] p-4">
                  <label className="relative min-w-0 flex-1">
                    <Search
                      size={16}
                      className="absolute left-3 top-3 text-[var(--muted-foreground)]"
                    />
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Handwerker suchen …"
                      className={`${fieldClass} pl-9`}
                    />
                  </label>
                  <span className="shrink-0 text-xs text-[var(--muted-foreground)]">
                    {filteredPartners.length} live
                  </span>
                </div>
                {pageLoading && filteredPartners.length === 0 ? (
                  <EmptyState
                    icon={<RefreshCw className="animate-spin" />}
                    title="Partner werden geladen"
                    description="Die Handwerkerdatenbank wird verifiziert …"
                  />
                ) : filteredPartners.length === 0 ? (
                  <EmptyState
                    icon={<Wrench />}
                    title="Noch keine Partner"
                    description="Lege ein Partnerprofil an oder importiere Handwerker über die CRM-Unternehmensdatenbank."
                    action={
                      <button
                        type="button"
                        onClick={openNewPartner}
                        className={primaryButtonClass}
                      >
                        <Plus size={15} /> Partner anlegen
                      </button>
                    }
                  />
                ) : (
                  <div className="max-h-[760px] space-y-2 overflow-y-auto p-3">
                    {filteredPartners.map((record) => (
                      <PartnerCard
                        key={`${record.__source}-${record.id}`}
                        record={record}
                        reviews={reviewsState.items}
                        selected={selectedPartner?.id === record.id}
                        onSelect={() => setSelectedId(record.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
              {selectedPartner ? (
                <PartnerDetail
                  record={selectedPartner}
                  reviews={reviewsState.items}
                  onEdit={() => openEditPartner(selectedPartner)}
                  onCreateOrder={() => openNewOrder(selectedPartner.id)}
                />
              ) : (
                <EmptyState
                  icon={<Building2 />}
                  title="Partner auswählen"
                  description="Wähle links einen Handwerker aus, um Kontaktdaten, Leistungen, Standort, Bilder und Bewertungen zu sehen."
                />
              )}
            </section>
          ) : tab === "orders" ? (
            <OrdersTab
              orders={ordersState.items}
              partners={partnerRecords}
              reviews={reviewsState.items}
              canWrite={canWrite}
              onCreate={() => openNewOrder()}
              onForward={(order) => void forwardOrder(order)}
              onComplete={(order) => void completeOrder(order)}
              onReview={openReview}
            />
          ) : (
            <ReviewsTab
              reviews={reviewsState.items}
              orders={ordersState.items}
              partners={partnerRecords}
              onCreate={() => openReview()}
            />
          )}
        </div>
        {partnerModal && canWrite ? (
          <Modal
            title={
              editingPartner ? "Partnerprofil bearbeiten" : "Partner hinzufügen"
            }
            description="Kontaktdaten, Dienstleistungen, Standort und bis zu sechs Referenzbilder speichern."
            onClose={() => setPartnerModal(false)}
            width="max-w-3xl"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Firmenname *"
                value={partnerForm.name}
                onChange={(value) => updatePartnerForm("name", value)}
              />
              <Field
                label="Ansprechpartner"
                value={partnerForm.contactName}
                onChange={(value) => updatePartnerForm("contactName", value)}
              />
              <Field
                label="E-Mail"
                type="email"
                value={partnerForm.email}
                onChange={(value) => updatePartnerForm("email", value)}
              />
              <Field
                label="Telefon"
                value={partnerForm.phone}
                onChange={(value) => updatePartnerForm("phone", value)}
              />
              <Field
                label="Website"
                value={partnerForm.website}
                onChange={(value) => updatePartnerForm("website", value)}
                placeholder="https://…"
              />
              <Field
                label="Dienstleistungen"
                value={partnerForm.services}
                onChange={(value) => updatePartnerForm("services", value)}
                placeholder="Sanitär, Fliesen, Elektro …"
              />
              <Field
                label="Adresse"
                value={partnerForm.address}
                onChange={(value) => updatePartnerForm("address", value)}
              />
              <Field
                label="PLZ"
                value={partnerForm.postalCode}
                onChange={(value) => updatePartnerForm("postalCode", value)}
              />
              <Field
                label="Ort"
                value={partnerForm.city}
                onChange={(value) => updatePartnerForm("city", value)}
              />
              <Field
                label="Region / Einsatzgebiet"
                value={partnerForm.region}
                onChange={(value) => updatePartnerForm("region", value)}
              />
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium">
                  Beschreibung
                </span>
                <textarea
                  value={partnerForm.description}
                  onChange={(event) =>
                    updatePartnerForm("description", event.target.value)
                  }
                  className={`${fieldClass} min-h-24`}
                  placeholder="Spezialisierung, Kapazitäten, Besonderheiten …"
                />
              </label>
              <div className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-medium">
                  Referenzbilder
                </span>
                <div className="flex flex-wrap gap-2">
                  {partnerImages.map((image, index) => (
                    <div
                      key={`${image.slice(0, 24)}-${index}`}
                      className="relative h-20 w-20 overflow-hidden rounded-xl border border-[var(--border)]"
                    >
                      <img
                        src={image}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setPartnerImages((current) =>
                            current.filter(
                              (_, imageIndex) => imageIndex !== index,
                            ),
                          )
                        }
                        className="absolute right-1 top-1 rounded-md bg-black/60 p-1 text-white"
                        aria-label="Bild entfernen"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border border-dashed border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]">
                    <ImagePlus size={20} />
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="sr-only"
                      onChange={(event) => void onImages(event)}
                    />
                  </label>
                </div>
                <p className="mt-2 text-[11px] text-[var(--muted-foreground)]">
                  JPG, PNG oder WebP bis 1,5 MB pro Bild.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPartnerModal(false)}
                className={secondaryButtonClass}
              >
                Abbrechen
              </button>
              <button
                type="button"
                onClick={() => void savePartner()}
                disabled={busy}
                className={primaryButtonClass}
              >
                {busy ? (
                  <RefreshCw size={15} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={15} />
                )}{" "}
                Speichern
              </button>
            </div>
          </Modal>
        ) : null}
        {orderModal && canWrite ? (
          <OrderModal
            form={orderForm}
            lines={orderLinesDraft}
            partners={partnerRecords}
            busy={busy}
            onChange={(key, value) =>
              setOrderForm((current) => ({ ...current, [key]: value }))
            }
            onLineChange={updateLine}
            onAddLine={() =>
              setOrderLinesDraft((current) => [...current, emptyLine()])
            }
            onRemoveLine={(index) =>
              setOrderLinesDraft((current) =>
                current.length > 1
                  ? current.filter((_, lineIndex) => lineIndex !== index)
                  : current,
              )
            }
            onClose={() => setOrderModal(false)}
            onSave={() => void saveOrder()}
          />
        ) : null}
        {reviewModal && canWrite ? (
          <ReviewModal
            form={reviewForm}
            orders={completedOrders}
            partners={partnerRecords}
            busy={busy}
            onChange={(key, value) =>
              setReviewForm((current) => ({ ...current, [key]: value }))
            }
            onClose={() => setReviewModal(false)}
            onSave={() => void saveReview()}
          />
        ) : null}
      </main>
    </WorkspaceSurfaceShell>
  );
}

function OrdersTab({
  orders,
  partners,
  reviews,
  canWrite,
  onCreate,
  onForward,
  onComplete,
  onReview,
}: {
  orders: WorkspaceRecord[];
  partners: WorkspaceRecord[];
  reviews: WorkspaceRecord[];
  canWrite: boolean;
  onCreate: () => void;
  onForward: (order: WorkspaceRecord) => void;
  onComplete: (order: WorkspaceRecord) => void;
  onReview: (order?: WorkspaceRecord) => void;
}) {
  const partnerName = (order: WorkspaceRecord) =>
    partners.find((partner) => partner.id === orderPartnerId(order))?.name ??
    text(order, "partnerName") ??
    "Nicht zugewiesen";
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-4">
        <div>
          <h2 className="font-semibold">Aufträge & Leistungsverzeichnisse</h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Erstelle Positionen, weise sie einem Handwerker zu und gib das LV
            weiter.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreate}
          disabled={!canWrite}
          className={primaryButtonClass}
        >
          <Plus size={15} /> Neuer Auftrag
        </button>
      </div>
      {!orders.length ? (
        <EmptyState
          icon={<FileText />}
          title="Noch keine Aufträge"
          description="Lege den ersten Auftrag mit Positionen, Kunde und Partner an."
          action={
            <button
              type="button"
              onClick={onCreate}
              className={primaryButtonClass}
            >
              <Plus size={15} /> Auftrag erstellen
            </button>
          }
        />
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {orders.map((order) => {
            const alreadyRated = reviews.some(
              (review) => text(review, "orderId") === order.id,
            );
            const lines = orderLines(order);
            return (
              <div
                key={order.id}
                className="grid gap-4 p-5 lg:grid-cols-[minmax(0,1fr)_auto]"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold">{order.name}</h3>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted-foreground)]">
                    <span>Partner: {partnerName(order)}</span>
                    <span>{lines.length} Positionen</span>
                    <span>
                      {order.dueAt
                        ? `Fällig ${formatDate(order.dueAt)}`
                        : "Kein Termin"}
                    </span>
                    <span>
                      {formatMoney(order.valueAmount, order.currency || "EUR")}
                    </span>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {lines.slice(0, 4).map((line, index) => (
                      <div
                        key={index}
                        className="flex justify-between gap-3 rounded-lg bg-[var(--secondary)] px-3 py-2 text-xs"
                      >
                        <span className="truncate">
                          {String(line.description ?? "Position")}
                        </span>
                        <strong>
                          {String(line.quantity ?? 0)} {String(line.unit ?? "")}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-[var(--muted-foreground)]">
                    {text(order, "customerName")
                      ? `Kunde: ${text(order, "customerName")}`
                      : "Kein Kunde hinterlegt"}
                    {text(order, "customerAddress")
                      ? ` · ${text(order, "customerAddress")}`
                      : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-start justify-end gap-2 lg:max-w-[260px]">
                  {order.status === "Entwurf" && (
                    <button
                      type="button"
                      onClick={() => onForward(order)}
                      disabled={!canWrite}
                      className={primaryButtonClass}
                    >
                      <Send size={14} /> Weitergeben
                    </button>
                  )}
                  {["Gesendet", "In Arbeit", "IN_PROGRESS"].includes(
                    order.status,
                  ) && (
                    <button
                      type="button"
                      onClick={() => onComplete(order)}
                      disabled={!canWrite}
                      className={secondaryButtonClass}
                    >
                      <CheckCircle2 size={14} /> Abschließen
                    </button>
                  )}
                  {["Abgeschlossen", "COMPLETED", "completed"].includes(
                    order.status,
                  ) && (
                    <button
                      type="button"
                      onClick={() => onReview(order)}
                      disabled={!canWrite || alreadyRated}
                      className={
                        alreadyRated ? secondaryButtonClass : primaryButtonClass
                      }
                    >
                      <Star size={14} />{" "}
                      {alreadyRated ? "Bewertet" : "Bewerten"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ReviewsTab({
  reviews,
  orders,
  partners,
  onCreate,
}: {
  reviews: WorkspaceRecord[];
  orders: WorkspaceRecord[];
  partners: WorkspaceRecord[];
  onCreate: () => void;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] p-4">
        <div>
          <h2 className="font-semibold">Partnerbewertungen</h2>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            Bewertungen bleiben mit dem jeweiligen abgeschlossenen Auftrag
            verknüpft.
          </p>
        </div>
        <button type="button" onClick={onCreate} className={primaryButtonClass}>
          <Plus size={15} /> Bewertung erfassen
        </button>
      </div>
      {!reviews.length ? (
        <EmptyState
          icon={<Star />}
          title="Noch keine Bewertungen"
          description="Bewerte einen abgeschlossenen Auftrag, damit die Partnerqualität nachvollziehbar bleibt."
        />
      ) : (
        <div className="grid gap-3 p-4 md:grid-cols-2">
          {reviews.map((review) => {
            const partner = partners.find(
              (item) => item.id === text(review, "partnerId"),
            );
            const order = orders.find(
              (item) => item.id === text(review, "orderId"),
            );
            return (
              <article
                key={review.id}
                className="rounded-xl border border-[var(--border)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">
                      {partner?.name ??
                        text(review, "partnerName") ??
                        "Partner"}
                    </h3>
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {order?.name ?? text(review, "orderName") ?? "Auftrag"}
                    </p>
                  </div>
                  <RatingStars value={numberValue(review.data?.rating)} />
                </div>
                <p className="mt-3 text-sm leading-6">
                  {text(review, "comment") || "Keine Bemerkung hinterlegt."}
                </p>
                <p className="mt-3 text-xs text-[var(--muted-foreground)]">
                  {formatDate(review.createdAt)}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

function OrderModal({
  form,
  lines,
  partners,
  busy,
  onChange,
  onLineChange,
  onAddLine,
  onRemoveLine,
  onClose,
  onSave,
}: {
  form: OrderDraft;
  lines: LineDraft[];
  partners: WorkspaceRecord[];
  busy: boolean;
  onChange: (key: keyof OrderDraft, value: string) => void;
  onLineChange: (index: number, key: keyof LineDraft, value: string) => void;
  onAddLine: () => void;
  onRemoveLine: (index: number) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const total = lines.reduce((sum, line) => sum + lineTotal(line), 0);
  return (
    <Modal
      title="Neuer Auftrag als LV"
      description="Strukturiere die auszuführenden Leistungen und weise den Auftrag einem Partner zu."
      onClose={onClose}
      width="max-w-4xl"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Auftragstitel *"
          value={form.title}
          onChange={(value) => onChange("title", value)}
          placeholder="Badumbau Familie Müller"
        />
        <label>
          <span className="mb-1.5 block text-xs font-medium">Partner *</span>
          <select
            value={form.partnerId}
            onChange={(event) => onChange("partnerId", event.target.value)}
            className={fieldClass}
          >
            <option value="">Partner auswählen …</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Kunde"
          value={form.customerName}
          onChange={(value) => onChange("customerName", value)}
        />
        <Field
          label="Kundenkontakt"
          value={form.customerContact}
          onChange={(value) => onChange("customerContact", value)}
        />
        <Field
          label="Objektadresse"
          value={form.customerAddress}
          onChange={(value) => onChange("customerAddress", value)}
        />
        <Field
          label="Ausführung bis"
          type="date"
          value={form.deadline}
          onChange={(value) => onChange("deadline", value)}
        />
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium">Notizen</span>
          <textarea
            value={form.notes}
            onChange={(event) => onChange("notes", event.target.value)}
            className={`${fieldClass} min-h-20`}
            placeholder="Zugang, Besonderheiten, Anhänge …"
          />
        </label>
      </div>
      <section className="mt-6 rounded-xl border border-[var(--border)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="font-semibold">Leistungsverzeichnis</h3>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">
              Positionen, Mengen und Einheitspreise.
            </p>
          </div>
          <button
            type="button"
            onClick={onAddLine}
            className={secondaryButtonClass}
          >
            <Plus size={14} /> Position
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {lines.map((line, index) => (
            <div
              key={index}
              className="grid gap-3 rounded-xl bg-[var(--secondary)] p-3 sm:grid-cols-[minmax(0,1fr)_90px_110px_120px_auto]"
            >
              <input
                value={line.description}
                onChange={(event) =>
                  onLineChange(index, "description", event.target.value)
                }
                placeholder="Leistungsbeschreibung"
                className={fieldClass}
              />
              <input
                value={line.quantity}
                onChange={(event) =>
                  onLineChange(index, "quantity", event.target.value)
                }
                inputMode="decimal"
                placeholder="Menge"
                className={fieldClass}
              />
              <input
                value={line.unit}
                onChange={(event) =>
                  onLineChange(index, "unit", event.target.value)
                }
                placeholder="Einheit"
                className={fieldClass}
              />
              <input
                value={line.unitPrice}
                onChange={(event) =>
                  onLineChange(index, "unitPrice", event.target.value)
                }
                inputMode="decimal"
                placeholder="Einzelpreis"
                className={fieldClass}
              />
              <button
                type="button"
                onClick={() => onRemoveLine(index)}
                disabled={lines.length === 1}
                className="grid h-10 w-10 place-items-center rounded-xl border border-[var(--border)] text-rose-600 disabled:opacity-30"
                aria-label="Position entfernen"
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end border-t border-[var(--border)] pt-4 text-sm">
          <strong>LV-Summe: {formatMoney(total, "EUR")}</strong>
        </div>
      </section>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className={secondaryButtonClass}
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          className={primaryButtonClass}
        >
          {busy ? (
            <RefreshCw size={15} className="animate-spin" />
          ) : (
            <FileText size={15} />
          )}{" "}
          LV speichern
        </button>
      </div>
    </Modal>
  );
}

function ReviewModal({
  form,
  orders,
  partners,
  busy,
  onChange,
  onClose,
  onSave,
}: {
  form: ReviewDraft;
  orders: WorkspaceRecord[];
  partners: WorkspaceRecord[];
  busy: boolean;
  onChange: (key: keyof ReviewDraft, value: string | number) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const ratingField = (
    label: string,
    key: "rating" | "quality" | "reliability" | "communication",
  ) => (
    <label>
      <span className="mb-1.5 block text-xs font-medium">{label}</span>
      <select
        value={form[key]}
        onChange={(event) => onChange(key, Number(event.target.value))}
        className={fieldClass}
      >
        {[5, 4, 3, 2, 1].map((value) => (
          <option key={value} value={value}>
            {value} von 5
          </option>
        ))}
      </select>
    </label>
  );
  return (
    <Modal
      title="Auftrag bewerten"
      description="Erfasse das Ergebnis direkt am abgeschlossenen Handwerkerauftrag."
      onClose={onClose}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium">
            Abgeschlossener Auftrag *
          </span>
          <select
            value={form.orderId}
            onChange={(event) => {
              const order = orders.find(
                (item) => item.id === event.target.value,
              );
              onChange("orderId", event.target.value);
              if (order) onChange("partnerId", orderPartnerId(order));
            }}
            className={fieldClass}
          >
            <option value="">Auftrag auswählen …</option>
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.name}
              </option>
            ))}
          </select>
        </label>
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium">Partner *</span>
          <select
            value={form.partnerId}
            onChange={(event) => onChange("partnerId", event.target.value)}
            className={fieldClass}
          >
            <option value="">Partner auswählen …</option>
            {partners.map((partner) => (
              <option key={partner.id} value={partner.id}>
                {partner.name}
              </option>
            ))}
          </select>
        </label>
        {ratingField("Gesamtbewertung", "rating")}
        {ratingField("Qualität der Arbeit", "quality")}
        {ratingField("Zuverlässigkeit", "reliability")}
        {ratingField("Kommunikation", "communication")}
        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium">Kommentar</span>
          <textarea
            value={form.comment}
            onChange={(event) => onChange("comment", event.target.value)}
            className={`${fieldClass} min-h-24`}
            placeholder="Was lief gut, was sollte verbessert werden?"
          />
        </label>
      </div>
      <div className="mt-6 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className={secondaryButtonClass}
        >
          Abbrechen
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={busy}
          className={primaryButtonClass}
        >
          <Star size={15} /> Bewertung speichern
        </button>
      </div>
    </Modal>
  );
}
