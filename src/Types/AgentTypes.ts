export type Location = {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
};

export type Address = {
  name: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  location?: Location;
};

export type SellerDetails = {
  name: string;
  phoneNumber: string;
  sellerId: string;
  address: Address[];
};

export type OrderItem = {
  bookId: string;
  bookName: string;
  author: string;
  coverImage: string;
  quantity: number;
};

export type AgentOrder = {
  orderId: string;
  orderNumber: string;
  orderDate: string;
  AssignedDate: string;
  orderStatus: string;
  items: OrderItem[];
  sellerDetails: SellerDetails;
};