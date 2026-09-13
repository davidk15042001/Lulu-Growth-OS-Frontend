import { requestApi } from "./client";
import { workspaceApiPath } from "./types";

export const ORDER_STATUSES = [
  "DRAFT",
  "PLACED",
  "CONFIRMED",
  "PROCESSING",
  "PARTIALLY_FULFILLED",
  "FULFILLED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type FulfillmentStatus = "DRAFT" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
export type InventoryLocationStatus = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type CommerceOrder = {
  id: string;
  workspaceId: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: string;
  fulfillmentStatus: string;
  customerRecordId: string | null;
  companyRecordId: string | null;
  quoteId: string | null;
  currency: string;
  subtotal: string;
  discountTotal: string;
  shippingTotal: string;
  taxTotal: string;
  grandTotal: string;
  source: string;
  sourceProvider: string | null;
  externalReference: string | null;
  notes: string | null;
  shippingAddress: Record<string, unknown>;
  billingAddress: Record<string, unknown>;
  metadata: Record<string, unknown>;
  version: number;
  lineCount?: number;
  placedAt: string | null;
  confirmedAt: string | null;
  cancelledAt: string | null;
  completedAt: string | null;
  createdByActorType: string;
  createdByActorRef: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CommerceOrderLine = {
  id: string;
  workspaceId: string;
  orderId: string;
  productId: string;
  variantId: string | null;
  inventoryLocationId: string | null;
  sku: string | null;
  productName: string;
  description: string | null;
  quantity: string;
  quantityUnit: string | null;
  unitPrice: string;
  discount: string;
  tax: string;
  lineTotal: string;
  reservedQuantity: string;
  fulfilledQuantity: string;
  metadata: Record<string, unknown>;
  sortOrder: number;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type CommerceFulfillment = {
  id: string;
  workspaceId: string;
  orderId: string;
  fulfillmentNumber: string;
  status: FulfillmentStatus;
  carrier: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  version: number;
  shippedAt: string | null;
  deliveredAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type FulfillmentLine = {
  id: string;
  orderLineId: string;
  quantity: string;
  productId: string;
  variantId: string | null;
  sku: string | null;
  productName: string;
};

export type CommerceOrderDetail = {
  order: CommerceOrder;
  lines: CommerceOrderLine[];
  fulfillments: CommerceFulfillment[];
};

export type FulfillmentDetail = {
  fulfillment: CommerceFulfillment;
  lines: FulfillmentLine[];
};

export type InventoryLocation = {
  id: string;
  workspaceId: string;
  code: string;
  name: string;
  status: InventoryLocationStatus;
  isDefault: boolean;
  address: Record<string, unknown>;
  metadata: Record<string, unknown>;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type InventoryLevel = {
  id: string;
  workspaceId: string;
  locationId: string;
  locationCode: string;
  locationName: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  sku: string | null;
  onHand: string;
  reserved: string;
  available: string;
  reorderPoint: string;
  version: number;
  createdAt: string;
  updatedAt: string;
};

export type InventoryMovement = {
  id: string;
  workspaceId: string;
  inventoryLevelId: string;
  movementType: "INITIAL" | "ADJUSTMENT" | "RESERVATION" | "RELEASE" | "FULFILLMENT" | "RETURN";
  onHandDelta: string;
  reservedDelta: string;
  onHandBefore: string;
  onHandAfter: string;
  reservedBefore: string;
  reservedAfter: string;
  orderId: string | null;
  orderLineId: string | null;
  fulfillmentId: string | null;
  reason: string;
  actorType: string;
  actorRef: string | null;
  createdAt: string;
};

export type Pagination = { page: number; limit: number; total: number; pages: number };
export type Paginated<T> = { items: T[]; pagination: Pagination };

export type CreateOrderInput = {
  idempotencyKey: string;
  customerRecordId?: string | null;
  companyRecordId?: string | null;
  quoteId?: string | null;
  currency: string;
  shippingTotal?: string;
  source?: "workspace" | "conversation" | "email" | "website_chat" | "api" | "import" | "provider";
  sourceProvider?: string | null;
  externalReference?: string | null;
  notes?: string | null;
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  lines: Array<{
    productId: string;
    variantId?: string | null;
    inventoryLocationId?: string | null;
    quantity: string;
    quantityUnit?: string | null;
    unitPrice?: string;
    discount?: string;
    tax?: string;
    metadata?: Record<string, unknown>;
  }>;
};

export type AdjustInventoryInput = {
  idempotencyKey: string;
  locationId: string;
  productId: string;
  variantId?: string | null;
  delta: string;
  expectedVersion: number;
  reason: string;
  reorderPoint?: string;
  metadata?: Record<string, unknown>;
};

function path(workspaceId: string, suffix: string) {
  return workspaceApiPath(workspaceId, `/commerce${suffix}`);
}

function queryString(values: Record<string, string | number | boolean | null | undefined>) {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  });
  const serialized = params.toString();
  return serialized ? `?${serialized}` : "";
}

export function commerceIdempotencyKey(action: string) {
  const id = typeof globalThis.crypto?.randomUUID === "function"
    ? globalThis.crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `workspace:${action}:${id}`;
}

export const commerceApi = {
  listOrders: (workspaceId: string, filters: { page?: number; limit?: number; status?: OrderStatus; search?: string } = {}) =>
    requestApi<Paginated<CommerceOrder>>({ path: path(workspaceId, `/orders${queryString(filters)}`) }),
  getOrder: (workspaceId: string, orderId: string) =>
    requestApi<CommerceOrderDetail>({ path: path(workspaceId, `/orders/${encodeURIComponent(orderId)}`) }),
  createOrder: (workspaceId: string, body: CreateOrderInput) =>
    requestApi<CommerceOrderDetail>({ path: path(workspaceId, "/orders"), method: "POST", body }),
  updateOrder: (workspaceId: string, orderId: string, body: Record<string, unknown>) =>
    requestApi<CommerceOrderDetail>({ path: path(workspaceId, `/orders/${encodeURIComponent(orderId)}`), method: "PATCH", body }),
  transitionOrder: (workspaceId: string, orderId: string, body: { idempotencyKey: string; expectedVersion: number; targetStatus: "PLACED" | "CONFIRMED" | "PROCESSING" | "CANCELLED"; reason?: string }) =>
    requestApi<CommerceOrderDetail>({ path: path(workspaceId, `/orders/${encodeURIComponent(orderId)}/transitions`), method: "POST", body }),
  listFulfillments: (workspaceId: string, orderId: string) =>
    requestApi<CommerceFulfillment[]>({ path: path(workspaceId, `/orders/${encodeURIComponent(orderId)}/fulfillments`) }),
  getFulfillment: (workspaceId: string, orderId: string, fulfillmentId: string) =>
    requestApi<FulfillmentDetail>({ path: path(workspaceId, `/orders/${encodeURIComponent(orderId)}/fulfillments/${encodeURIComponent(fulfillmentId)}`) }),
  createFulfillment: (workspaceId: string, orderId: string, body: {
    idempotencyKey: string;
    expectedOrderVersion: number;
    carrier?: string | null;
    trackingNumber?: string | null;
    trackingUrl?: string | null;
    notes?: string | null;
    metadata?: Record<string, unknown>;
    lines: Array<{ orderLineId: string; quantity: string }>;
  }) => requestApi<FulfillmentDetail>({ path: path(workspaceId, `/orders/${encodeURIComponent(orderId)}/fulfillments`), method: "POST", body }),
  transitionFulfillment: (workspaceId: string, orderId: string, fulfillmentId: string, body: {
    idempotencyKey: string;
    expectedVersion: number;
    expectedOrderVersion: number;
    targetStatus: Exclude<FulfillmentStatus, "DRAFT">;
    carrier?: string | null;
    trackingNumber?: string | null;
    trackingUrl?: string | null;
    reason?: string;
  }) => requestApi<FulfillmentDetail>({ path: path(workspaceId, `/orders/${encodeURIComponent(orderId)}/fulfillments/${encodeURIComponent(fulfillmentId)}/transitions`), method: "POST", body }),
  listLocations: (workspaceId: string, status?: InventoryLocationStatus) =>
    requestApi<InventoryLocation[]>({ path: path(workspaceId, `/inventory/locations${queryString({ status })}`) }),
  getLocation: (workspaceId: string, locationId: string) =>
    requestApi<InventoryLocation>({ path: path(workspaceId, `/inventory/locations/${encodeURIComponent(locationId)}`) }),
  createLocation: (workspaceId: string, body: { idempotencyKey: string; code: string; name: string; isDefault?: boolean; address?: Record<string, unknown>; metadata?: Record<string, unknown> }) =>
    requestApi<InventoryLocation>({ path: path(workspaceId, "/inventory/locations"), method: "POST", body }),
  updateLocation: (workspaceId: string, locationId: string, body: { idempotencyKey: string; expectedVersion: number; code?: string; name?: string; status?: InventoryLocationStatus; isDefault?: boolean; address?: Record<string, unknown>; metadata?: Record<string, unknown> }) =>
    requestApi<InventoryLocation>({ path: path(workspaceId, `/inventory/locations/${encodeURIComponent(locationId)}`), method: "PATCH", body }),
  listLevels: (workspaceId: string, filters: { page?: number; limit?: number; locationId?: string; productId?: string; variantId?: string; belowReorderPoint?: boolean } = {}) =>
    requestApi<Paginated<InventoryLevel>>({ path: path(workspaceId, `/inventory/levels${queryString(filters)}`) }),
  getLevel: (workspaceId: string, levelId: string) =>
    requestApi<InventoryLevel>({ path: path(workspaceId, `/inventory/levels/${encodeURIComponent(levelId)}`) }),
  adjustInventory: (workspaceId: string, body: AdjustInventoryInput) =>
    requestApi<InventoryLevel>({ path: path(workspaceId, "/inventory/adjustments"), method: "POST", body }),
  listMovements: (workspaceId: string, filters: { page?: number; limit?: number; levelId?: string; orderId?: string; movementType?: InventoryMovement["movementType"] } = {}) =>
    requestApi<Paginated<InventoryMovement>>({ path: path(workspaceId, `/inventory/movements${queryString(filters)}`) }),
};
