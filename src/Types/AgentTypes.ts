export type Location = {
  type: "Point";
  coordinates: [number, number];
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

export type OrderStatus =
  | "Created"
  | "Ready For Pickup"
  | "Pickup Assigned"
  | "Out For Pickup"
  | "Pickup Completed"
  | "Arrived At Origin Hub"
  | "Sorting Completed"
  | "In Transit"
  | "Arrived At Destination Hub"
  | "Delivery Agent Assigned"
  | "Out For Delivery"
  | "Delivered"
  | "Delivery Failed"
  | "Return Initiated"
  | "Returned"
  | "Cancelled";

export type ShipmentType =
  | "Forward"
  | "Return"
  | "Exchange";


export type DeliveryType =
  | "SELLER_TO_HUB"
  | "USER_RETURN_TO_HUB"
  | "HUB_TO_USER";

export type SellerDetails = {
  name: string;
  phoneNumber: string;
  sellerId: string;
  address: Address;
};

export type UserDetails = {
  userId: string;
  name: string;
  phoneNumber: string;
  address: Address;
};

export type OrderItem = {
  bookId: string;
  bookName: string;
  author: string;
  coverImage: string;
  quantity: number;
};

export type HubDetails = {
  hubId: string;
  name: string;
  address: string;
  city: string;
  state: string;

  distance?: string;

  location?: Location;

  receivedBy?: {
    adminId: string;
    name: string;
    phoneNumber?: string;
  };

  receivedDate?: string;

  receivedImages?: string[];

  verificationStatus?: string;
};

export type PickupVerification = {
  verified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  images: string[];
};

export type DeliveryVerification = {
  verified: boolean;
  verifiedBy: string;
  verifiedAt: string;
  images: string[];
};

export type AgentOrder = {
  orderId: string;
  orderNumber: string;
  orderDate: string;

   shipmentType: ShipmentType;

  // Frontend agent flow
  deliveryType: DeliveryType;

  assignedDate?: string;
  pickupStartedDate?: string;
  pickupDate?: string;

  hubStartedDate?: string;
  hubSubmittedDate?: string;

  completedDate?: string;

  deliveryStartedDate?: string;
  deliveredDate?: string;

  orderStatus: OrderStatus;

  items: OrderItem[];

  sellerDetails?: SellerDetails;

  hubDetails?: HubDetails;

  userDetails?: UserDetails;

  pickupVerification?: PickupVerification;

  deliveryVerification?: DeliveryVerification;
  journeyHistory: JourneyHistory[];
  shipmentId?: string
};

export type JourneyHistory = {
  event: string;
  status: OrderStatus;
  eventAt: string;
  remarks?: string;
};