// ── Domain models ────────────────────────────────────────────────────────────

export interface Claim {
  id: number;
  namn: string;
  street: string;
  zip: string;
  city: string;
  email: string;
  phone: string;
  flightNumber: string;
  airline: string;
  bookingReference: string | null;
  departureAirport: string;
  arrivalAirport: string;
  flightDate: string;
  issue: string;
  original_route: string | null;
  new_route: string | null;
  change_notice: string | null;
  signature: string | null;
  ip_address: string | null;
  terms_accepted: boolean;
  affiliate_code: string;
  created_at: string;
}

export interface NavItem {
  id: number;
  label: string;
  url: string;
  parent_id: number | null;
  sort_order: number;
  children?: NavItem[];
}

export interface Article {
  id: number;
  type: 'guide' | 'airline' | 'blog';
  status: 'draft' | 'published';
  slug: string;
  parent_slug: string | null;
  title: string;
  meta_title: string | null;
  meta_desc: string | null;
  content: string | null;
  schema_type: 'FAQPage' | 'Article' | 'none';
  faq_json: string | null;
  affiliate_ref: string | null;
  category: string | null;
  sitemap_priority: string | null;
  sitemap_changefreq: string | null;
  author_id: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface Author {
  id: number;
  slug: string;
  name: string;
  role: string | null;
  credentials: string | null;
  bio: string | null;
  image_url: string | null;
  email: string | null;
  linkedin_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Route {
  id: number;
  slug: string;
  dep_city: string;
  arr_city: string;
  dep_airport: string;
  arr_airport: string;
  distance_km: string | null;
  comp_amount: string | null;
  airlines: string[] | null;
  meta_title: string | null;
  meta_desc: string | null;
  content: string | null;
  published: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface Breadcrumb {
  name: string;
  url: string;
}

// ── Express locals augmentation ──────────────────────────────────────────────

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Locals {
      siteUrl: string;
      siteName: string;
      currentYear: number;
      assetVersion: string;
      currentPath: string;
      navItems: NavItem[];
      title?: string;
      metaDesc?: string;
      canonical?: string;
      scripts?: string;
    }
  }
}
