import { pages } from "../pages-manifest";
import { isPageAvailable } from "../routing";

export const WEBSITE_PORTAL_SLUG = "lulu-website-portal-9012";
export const DEFAULT_WEBSITE_SECTION = "lulu-website-editor-9012";

export const availablePages = pages.filter(
  (page) => isPageAvailable(page.slug) && page.slug !== WEBSITE_PORTAL_SLUG,
);
