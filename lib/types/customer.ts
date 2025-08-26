export interface Customer {
  id: number;
  merchant_id: string;
  name: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  created_at: string;
}

export interface CustomerDisplay
  extends Omit<Customer, "password" | "merchant_id"> {}
