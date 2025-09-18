import { CategoryType } from '../items';

export type Category = {
  id: string;
  name: string;
  slug: string;
  type: CategoryType;
  children?: Omit<Category, 'children'>[];
};
