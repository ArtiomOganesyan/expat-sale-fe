export type Category = {
  id: string;
  name: string;
  slug: string;
  children?: Omit<Category, 'children'>[];
};
