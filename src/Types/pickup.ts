export interface Address {
  name: string;
  type: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface SellerDetails {
  sellerId: string;
  name: string;
  phoneNumber: string;
  address: Address[];
}

export interface PickupBook {
  id: string;
  name: string;
  author: string;
  language: string;
  edition: string;
  coverImage: string;
}

export interface PickupDetails {
  orderId: string;
  sellerDetails: SellerDetails;
  book: PickupBook;
  pickupType: PickupType;
  referencePhotos?: ReferencePhotos;
}

export type RequiredPhotoType = "front" | "back" | "spine";

export interface RequiredPhotos {
  front: File | null;
  back: File | null;
  spine: File | null;
}

export interface BookVerificationPayload {
  orderId: string;
  requiredPhotos: RequiredPhotos;
  damagePhotos: File[];
  hasDamage: boolean;
}

export interface RequiredSlotConfig {
  key: RequiredPhotoType;
  label: string;
  hint: string;
}

export const REQUIRED_SLOTS: RequiredSlotConfig[] = [
  { key: "front", label: "Front Cover", hint: "Full front cover, clearly visible" },
  { key: "back", label: "Back Cover", hint: "Full back cover, clearly visible" },
  { key: "spine", label: "Spine", hint: "Book spine showing title/edges" },
];


export type PickupType = "SELLER_PICKUP" | "RETURN_PICKUP";

export interface ReferencePhotos {
  front: string;
  back: string;
  spine: string;
  damagePhotos?: string[];
}