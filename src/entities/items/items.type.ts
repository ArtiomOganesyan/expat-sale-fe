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
};

export interface CategoryItem{
  id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}
