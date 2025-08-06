export interface ItemImageData {
  created_at: string;
  full_path: string;
  id: string;
  provider: string;
  provider_id: string;
  public_url: string;
  updated_at: string;
}

export interface ItemLocationData {
  city: string;
  country: string;
  radius: number;
  region: string;
}

export interface ItemData {
  created_at: string;
  currency: string;
  description: string;
  id: string;
  images: ItemImageData[];
  is_free: string;
  is_new: string;
  location: ItemLocationData;
  price: string;
  price_usd: string;
  published: boolean;
  title: string;
  updated_at: string;
  xl: boolean;
}
