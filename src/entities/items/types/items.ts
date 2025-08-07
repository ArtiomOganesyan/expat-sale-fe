import { type User } from '../../user/user.type';

export type Item = {
  location: Location;
  images: Image[];
  user: User;
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string;
  price: string;
  price_usd: string;
  currency: string;
  is_free: boolean;
  is_new: boolean;
  published: boolean;
  categoryId?: string;
  category?: CategoryItem;
  xl: boolean;
};

type Location = {
  city: string;
  region: string;
  country: string;
  radius: number;
};

type Image = {
  created_at: string;
  full_path: string;
  id: string;
  provider: string;
  provider_id: string;
  public_url: string;
  updated_at: string;
};

export type ItemFilter = {
  offset?: number;
  limit?: number;
  categoryId?: string | null;
  isFree?: boolean | null;
  title?: string | null;
  isNew?: boolean | null;
  minPrice?: number | null;
  maxPrice?: number | null;
  country?: string | null;
  region?: string | null;
  city?: string | null;
  radius?: number | null;
  userId?: string | null;
  favorite?: boolean | null;
};

export type EditItem = {
  location?: Location;
  id?: string;
  created_at?: string;
  updated_at?: string;
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  is_free?: boolean;
  is_new?: boolean;
  published?: boolean;
  categoryId?: string;
  category?: CategoryItem;
};

export type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
};
