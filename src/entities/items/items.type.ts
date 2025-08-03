import { type User } from '../user/user.type';

type Location = {
  city: string;
  radius: number;
  region: string;
  country: string;
};

type Image = {
  public_url: string;
  id: string;
  full_path?: string;
};

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
  currency: string;
  is_free: boolean;
  is_new: boolean;
  published: boolean;
  categoryId?: string;
  category?: CategoryItem;
};

export interface ItemFilter {
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
}

export interface EditItem {
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
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}
