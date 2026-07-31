import { PickupDetails } from "../Types/pickup";

export const sellerPickupData: PickupDetails = {
  orderId: "ORD-100234",
  pickupType: "SELLER_PICKUP",
  sellerDetails: {
    sellerId: "SEL-1023",
    name: "ABC Book Store",
    phoneNumber: "+91 9876543210",
    address: [
      {
        name: "ABC Book Store",
        type: "Seller",
        street: "12 MG Road",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500001",
        country: "India",
        phone: "+91 9876543210",
      },
    ],
  },
  book: {
    id: "BK-7895",
    name: "Atomic Habits",
    author: "James Clear",
    language: "English",
    edition: "3rd Edition",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
  },
};

export const returnPickupData: PickupDetails = {
  orderId: "ORD-100987",
  pickupType: "RETURN_PICKUP",
  sellerDetails: {
    sellerId: "SEL-1023",
    name: "ABC Book Store",
    phoneNumber: "+91 9876543210",
    address: [
      {
        name: "ABC Book Store",
        type: "Seller",
        street: "12 MG Road",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500001",
        country: "India",
        phone: "+91 9876543210",
      },
    ],
  },
  book: {
    id: "BK-7895",
    name: "Atomic Habits",
    author: "James Clear",
    language: "English",
    edition: "3rd Edition",
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
  },
  // Mocked as if the seller already uploaded these at original pickup time.
  referencePhotos: {
    front: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
    back: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
    spine: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
    damagePhotos: [],
  },
};

export const deliveredBookData = {
  orderId: "ORD-100987",

  deliveryStatus: "DELIVERED",

  deliveredAt: "31 Jul 2026, 4:15 PM",

  deliveredBy: {
    id: "AG-101",
    name: "Ram Kumar",
    phone: "+91 9876543210",
  },

  receiver: {
    name: "ABC Book Store",
    type: "Seller",
    phone: "+91 9876543210",
  },

  verification: {
    frontVerified: true,
    backVerified: true,
    spineVerified: true,
    damageFound: false,
    damagePhotos: [],
  },

  notes:
    "Book handed over successfully. Receiver verified the condition.",

  book: {
    id: "BK-7895",
    name: "Atomic Habits",
    author: "James Clear",
    language: "English",
    edition: "3rd Edition",
    coverImage:
      "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
  },
};