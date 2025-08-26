export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string;
  image_url: string;
  quantity: number;
  allergens?: string;
  calories?: number;
}
