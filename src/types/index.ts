export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  university_id: number;
};

export type Order = {
  id: number;
  user_id: string;
  product_id: number;
  quantity: number;
  status: string;
};
