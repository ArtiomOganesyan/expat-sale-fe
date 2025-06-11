import { type User } from '../user/user.type';

type Location = {
  city: string;
  radius: number;
  region: string;
  country: string;
};

type Image = {
  public_url: string;
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
};
