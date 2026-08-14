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

// export type DeliveryType =
//   | "SELLER_TO_HUB"
//   | "USER_RETURN_TO_HUB"
//   | "HUB_TO_USER";

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
  pincode: string;
  country?: string;
  phoneNumber?: string;
  hubCode?: string;
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

export type JourneyHistory = {
  event: string;
  status: OrderStatus;
  eventAt: string;
  remarks?: string;
  hubId?: string | null;
  tripId?: string | null;
  agentId?: string | null;
  updatedBy?: string | null;
};

export type AgentOrder = {
  shipmentId: string;

  awbNumber: string;

  orderId: string;
  orderNumber: string;
  orderDate: string;

  shipmentType: ShipmentType;

  orderStatus: OrderStatus;

  assignedDate?: string;
  pickupStartedDate?: string;
  pickupDate?: string;
  hubStartedDate?: string;
  hubSubmittedDate?: string;
  completedDate?: string;
  deliveryStartedDate?: string;
  deliveredDate?: string;

  items: OrderItem[];

  sellerDetails?: SellerDetails;

  hubDetails?: HubDetails;

  destinationHubDetails?: HubDetails;

  userDetails?: UserDetails;

  pickupVerification?: PickupVerification;

  deliveryVerification?: DeliveryVerification;

  journeyHistory: JourneyHistory[];
  journeyType: JourneyType
};

export type ShipmentApi = {
  shipmentId: string;
  _id?: string;

  awbNumber: string;

  orderId: string;
  orderItemId?: string;

  sellerId: string;
  buyerId?: string;

  shipmentType: ShipmentType;

  paymentMode?: string;
  codAmount?: number;

  currentStatus: string;

  expectedDeliveryDate?: string;

  createdAt: string;
  updatedAt?: string;

  sender: {
    name: string;
    phone: string;
    email?: string;

    addressLine1: string;
    addressLine2?: string;

    city: string;
    state: string;
    pincode: string;
    country: string;

    location?: Location;
  };

  receiver: {
    name: string;
    phone: string;

    addressLine1: string;
    addressLine2?: string;

    city: string;
    state: string;
    pincode: string;
    country: string;

    location?: Location;
  };

  infrastructure: {
    originHub: {
      _id: string;
      hubCode: string;
      hubName: string;
      phoneNumber?: string;

      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
      };
    };

    destinationHub: {
      _id: string;
      hubCode: string;
      hubName: string;
      phoneNumber?: string;

      address: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
      };
    };

    currentHub?: {
      _id: string;
      hubCode?: string;
      hubName?: string;

      address?: {
        street: string;
        city: string;
        state: string;
        country: string;
        pincode: string;
      };
    };
  };

  agentIds?: string[];

  assignedAgent?: {
    _id: string;
    fullName: string;
    phoneNumber: string;
    vehicleType?: string;
    status?: string;
  };

  orderDetails: {
    orderId: string;

    orderItem: {
      orderItemId?: string;
      bookId: string;
      bookName: string;
      author: string;
      coverImage: string;
      quantity: number;
      itemStatus?: string;
    };
  };

  journeyHistory: JourneyHistory[];
};

export type UpdateShipmentStatusPayload = {
  status: OrderStatus;
  event: string;
  agentId: string;
  remarks: string;
  updatedBy: string;
};

export type JourneyType =
"Pickup"|
"Delivery"