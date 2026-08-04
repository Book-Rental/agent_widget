export interface ShipmentResponse {
  status: string;
  message: string;
  data: Shipment;
}

export interface Shipment {
  shipmentId: string;
  awbNumber: string;
  orderId: string;
  orderItemId: string;
  sellerId: string;
  buyerId: string;
  sender: ShipmentPerson;
  receiver: ShipmentPerson;
  shipmentType: "Forward" | "Return";
  paymentMode: "Prepaid" | "COD";
  codAmount: number;
  currentStatus: ShipmentStatus;
  expectedDeliveryDate: string;
  infrastructure: ShipmentInfrastructure;
  assignedAgent: AssignedAgent;
  orderDetails: null;
  journeyHistory: JourneyHistory[];
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentPerson {
  name: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface ShipmentInfrastructure {
  originHub: ShipmentHub;
  destinationHub: ShipmentHub;
  currentHub: ShipmentHub;
}

export interface ShipmentHub {
  _id: string;
  hubCode: string;
  hubName: string;
  address: HubAddress;
}

export interface HubAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export interface AssignedAgent {
  _id: string;
  fullName: string;
  phoneNumber: string;
  vehicleType: string;
  status: string;
}

export interface JourneyHistory {
  _id: string;
  event: string;
  status: ShipmentStatus;
  hubId: string;
  tripId: string | null;
  agentId: string | null;
  remarks: string;
  updatedBy: string | null;
  eventAt: string;
}

export enum ShipmentStatus {
  CREATED = "Created",

  READY_FOR_PICKUP = "Ready For Pickup",

  OUT_FOR_PICKUP = "Out For Pickup",

  PICKUP_ASSIGNED = "Pickup Assigned",

  PICKUP_COMPLETED = "Pickup Completed",

  ARRIVED_AT_ORIGIN_HUB = "Arrived At Origin Hub",

  SORTING_COMPLETED = "Sorting Completed",

  IN_TRANSIT = "In Transit",

  ARRIVED_AT_DESTINATION_HUB = "Arrived At Destination Hub",

  DELIVERY_AGENT_ASSIGNED = "Delivery Agent Assigned",

  OUT_FOR_DELIVERY = "Out For Delivery",

  DELIVERED = "Delivered",

  DELIVERY_FAILED = "Delivery Failed",

  RETURN_INITIATED = "Return Initiated",

  RETURNED = "Returned",

  CANCELLED = "Cancelled",
}