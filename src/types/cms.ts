// ==============================|| CMS - TYPESCRIPT INTERFACES ||============================== //

// ---- Common ----
export type Status = 'active' | 'inactive' | 'draft' | 'published';
export type RequestStatus = 'new' | 'contacted' | 'completed' | 'cancelled';

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ---- Auth ----
export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'editor';
  status: Status;
  created_at: string;
  token?: string;
}

// ---- Service ----
export interface Service {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  short_description: string;
  description: string;
  meta_title: string | null;
  meta_description: string | null;
  status: Status;
  created_at: string;
  updated_at?: string;
}

export interface ServiceFormValues {
  title: string;
  slug: string;
  short_description: string;
  description: string;
  meta_title: string;
  meta_description: string;
  status: Status;
  image?: File | null;
}

// ---- Article ----
export interface Article {
  id: number;
  title: string;
  slug: string;
  image: string | null;
  excerpt: string;
  content: string;
  meta_title: string | null;
  meta_description: string | null;
  views: number;
  status: Status;
  created_at: string;
  updated_at?: string;
}

export interface ArticleFormValues {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  meta_title: string;
  meta_description: string;
  status: Status;
  image?: File | null;
}

// ---- Gallery ----
export interface GalleryImage {
  id: number;
  title: string;
  image: string;
  created_at: string;
}

export interface GalleryFormValues {
  title: string;
  image: File | null;
}

// ---- Testimonial ----
export interface Testimonial {
  id: number;
  name: string;
  image: string | null;
  job_title: string;
  comment: string;
  rating: 1 | 2 | 3 | 4 | 5;
  status: Status;
  created_at: string;
}

export interface TestimonialFormValues {
  name: string;
  job_title: string;
  comment: string;
  rating: number;
  status: Status;
  image?: File | null;
}

// ---- Request ----
export interface ServiceRequest {
  id: number;
  name: string;
  phone: string;
  service_id: number | null;
  service?: Service;
  message: string;
  status: RequestStatus;
  created_at: string;
}

export interface RequestFormValues {
  name: string;
  phone: string;
  service_id: string;
  message: string;
}

// ---- Settings ----
export interface Settings {
  id: number;
  site_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  logo: string | null;
  favicon: string | null;
  seo_title: string;
  seo_description: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

export interface SettingsFormValues {
  site_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  seo_title: string;
  seo_description: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  logo?: File | null;
  favicon?: File | null;
}

// ---- Dashboard Stats ----
export interface DashboardStats {
  total_requests: number;
  total_services: number;
  total_articles: number;
  total_testimonials: number;
  total_gallery: number;
  monthly_requests: MonthlyData[];
  services_performance: ServicePerformance[];
  latest_requests: ServiceRequest[];
}

export interface MonthlyData {
  month: string;
  count: number;
}

export interface ServicePerformance {
  service: string;
  requests: number;
}

// ---- Filters ----
export interface TableFilters {
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}
