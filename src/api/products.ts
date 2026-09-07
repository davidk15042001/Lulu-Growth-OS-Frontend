import { requestApi } from './client';
import { workspaceApiPath } from './types';

export type Product = { id: string; workspaceId: string; name: string; status: string; productType: string; sku: string | null; shortDescription: string | null; longDescription: string | null; defaultCurrency: string | null; defaultPrice: string | null; pricingType: string; moqQuantity: string | null; moqUnit: string | null; leadTimeMinDays: number | null; leadTimeMaxDays: number | null; version: number; completeness?: { score: number; missing: string[]; readyForPublishing: boolean }; [key: string]: unknown };
export type ProductDetail = Product & { variants: Record<string, unknown>[]; specifications: Record<string, unknown>[]; media: Record<string, unknown>[]; certificates: Record<string, unknown>[]; packaging: Record<string, unknown>[]; capacity: Record<string, unknown>[]; prices: Record<string, unknown>[]; markets: Record<string, unknown>[]; translations: Record<string, unknown>[]; seo: Record<string, unknown>[]; applications: Record<string, unknown>[]; relationships: Record<string, unknown>[] };
export type ProductList = { items: Product[]; pagination: { page: number; limit: number; total: number; totalPages: number } };
const path = (workspaceId: string, suffix = '') => workspaceApiPath(workspaceId, `/products${suffix}`);
export const productsApi = {
  list: (workspaceId: string, query = '') => requestApi<ProductList>({ path: path(workspaceId, query ? `?${query}` : '') }),
  get: (workspaceId: string, id: string) => requestApi<ProductDetail>({ path: path(workspaceId, `/${id}`) }),
  create: (workspaceId: string, body: Record<string, unknown>) => requestApi<ProductDetail>({ path: path(workspaceId), method: 'POST', body }),
  update: (workspaceId: string, id: string, body: Record<string, unknown>) => requestApi<ProductDetail>({ path: path(workspaceId, `/${id}`), method: 'PATCH', body }),
  archive: (workspaceId: string, id: string) => requestApi<null>({ path: path(workspaceId, `/${id}`), method: 'DELETE' }),
  listDetails: (workspaceId: string, id: string, type: string) => requestApi<Record<string, unknown>[]>({ path: path(workspaceId, `/${id}/details/${type}`) }),
  createDetail: (workspaceId: string, id: string, type: string, body: Record<string, unknown>) => requestApi<{ id: string }>({ path: path(workspaceId, `/${id}/details/${type}`), method: 'POST', body }),
  deleteDetail: (workspaceId: string, id: string, type: string, childId: string) => requestApi<null>({ path: path(workspaceId, `/${id}/details/${type}/${childId}`), method: 'DELETE' }),
};
