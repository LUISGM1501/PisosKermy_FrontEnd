export interface Product {
  id: number;
  name: string;
  description: string;
  image_url: string | null;
  categories: { id: number; name: string }[];
  tags: { id: number; name: string }[];
  providers: { id: number; name: string }[];
}

export interface AdminProduct extends Product {
  price: number;
}

export interface AdminProductsResponse {
  products: AdminProduct[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category_ids: number[];
  tag_ids: number[];
  provider_ids: number[];
  image?: File;
}