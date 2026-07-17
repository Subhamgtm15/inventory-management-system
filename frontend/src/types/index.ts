// Shared TypeScript types that mirror the Laravel API JSON responses.

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  category_id: number;
  price: string; // API returns decimal as string
  quantity: number;
  description: string | null;
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  total_products: number;
  total_categories: number;
  low_stock_count: number;
  low_stock_threshold: number;
  low_stock_products: Product[];
}

// Laravel API Resource single-item envelope: { data: T }
export interface ResourceResponse<T> {
  data: T;
}

// Laravel paginated collection envelope.
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    per_page: number;
    to: number | null;
    total: number;
  };
}

// Shape of Laravel 422 validation error responses.
export interface ValidationErrorResponse {
  message: string;
  errors: Record<string, string[]>;
}
