export interface ProductFormData {
    // 기본 정보
    name: string;
    sku?: string;
    barcode?: string;
    category: string;
    brand: string;

    // 가격 정보
    price: string;
    original_price?: string;
    cost_price?: string;

    // 상세 정보
    description?: string;
    short_description?: string;
    ingredients?: string;
    efficacy?: string;
    usage_instructions?: string;
    precautions?: string;

    // 사양
    volume?: string;
    weight?: string;
    dimensions?: {
        width?: number;
        height?: number;
        depth?: number;
    };

    // 특징 태그
    features: string[];
    target_audience: string[];

    // 재고 관리
    stock: string;
    low_stock_threshold?: string;

    // 이미지
    thumbnail?: File | null;
    product_images?: File[];
    existing_images?: string[];

    // 상태
    is_active: boolean;
    is_featured: boolean;
    is_new: boolean;
    is_best_seller: boolean;

    // 의약외품 정보
    is_quasi_drug: boolean;
    approval_number?: string;
    manufacturer?: string;
    distributor?: string;

    // SEO
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string;

    // 타임스탬프
    published_at?: string;
}

export interface CategoryOption {
    value: string;
    label: string;
}

export interface ProductFormProps {
    data: ProductFormData;
    setData: (key: string, value: any) => void;
    errors: Record<string, string>;
    categories: CategoryOption[];
    features: string[];
    targetAudiences: string[];
}

// Product interface matching backend ProductResource (snake_case)
export interface Product {
    id: number;
    name: string;
    slug: string;
    sku: string | null;
    barcode: string | null;
    category: string;
    brand: string;
    price: number;
    original_price: number | null;
    cost_price: number | null;
    description: string | null;
    short_description: string | null;
    ingredients: string | null;
    efficacy: string | null;
    usage_instructions: string | null;
    precautions: string | null;
    volume: string | null;
    weight: number | null;
    dimensions: { width?: number; height?: number; depth?: number } | null;
    features: string[] | null;
    target_audience: string[] | null;
    stock: number;
    low_stock_threshold: number;
    thumbnail_url: string | null;
    images: string[] | null;
    is_active: boolean;
    is_featured: boolean;
    is_new: boolean;
    is_best_seller: boolean;
    is_quasi_drug: boolean;
    approval_number: string | null;
    manufacturer: string | null;
    distributor: string | null;
    meta_title: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    published_at: string | null;
    created_at: string;
    updated_at: string;
}
