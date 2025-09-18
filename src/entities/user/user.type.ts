export type User = {
  id: string;
  created_at: string;
  updated_at: string;
  username: string;
  image: string | null;
  contact_platforms: Record<string, any>;
  role: string | null;
  safe_seller: boolean;
};

export type UserSliceState = {
  user: User | null;
  loading: boolean;
  error: string | undefined;
};
