import { AgentOrder } from "../Types/AgentTypes";

export type OrderStatus =
  | "Assigned"
  | "Out for Pickup"
  | "Pickup Successful"
  | "Submitted to Admin"
  | "Assigned for Delivery"
  | "Collected from Hub"
  | "Out for Delivery"
  | "Delivered";

export type DeliveryType =
  | "SELLER_TO_HUB"
  | "USER_RETURN_TO_HUB"
  | "HUB_TO_USER";

export const orderResponse: AgentOrder[] = [
  // ============================================================
  // 1. ASSIGNED - Agent needs to pickup from seller
  // ============================================================
  {
    orderId: "ORD-001",
    orderNumber: "ORD1785236817175",
    orderDate: "2026-07-28T11:06:57.183Z",

    deliveryType: "SELLER_TO_HUB" as DeliveryType,

    assignedDate: "2026-07-28T10:30:00.000Z",

    orderStatus: "Assigned" as OrderStatus,

    items: [
      {
        bookId: "6a3cfcad1d1789437feae0a5",
        bookName: "Beloved",
        author: "Toni Morrison",
        coverImage:
          "https://res.cloudinary.com/dlggszqj9/image/upload/v1782381739/BookImages/Beloved-cover.webp.jpg",
        quantity: 1,
      },
    ],

    sellerDetails: {
      sellerId: "6a3ceeb6fe292d89939928de",
      name: "Test",
      phoneNumber: "1234567890",

      address: {
        name: "Ambedkar Circle",
        type: "home",
        street: "Navirman Nagar",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500096",
        country: "India",
        phone: "4083285219",

        location: {
          type: "Point",
          coordinates: [78.42261018992527, 17.425446193556382],
        },
      },
    },

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",

      location: {
        type: "Point",
        coordinates: [78.3915, 17.4485],
      },
    },
  },

  // ============================================================
  // 2. OUT FOR PICKUP
  // ============================================================
  {
    orderId: "ORD-002",
    orderNumber: "ORD1785236817176",
    orderDate: "2026-07-28T11:06:57.183Z",

    deliveryType: "SELLER_TO_HUB" as DeliveryType,

    assignedDate: "2026-07-28T10:30:00.000Z",
    pickupStartedDate: "2026-07-28T11:00:00.000Z",

    orderStatus: "Out for Pickup" as OrderStatus,

    items: [
      {
        bookId: "BOOK-001",
        bookName: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        coverImage: "/images/great-gatsby.jpg",
        quantity: 1,
      },
    ],

    sellerDetails: {
      sellerId: "SELLER-001",
      name: "John Books",
      phoneNumber: "9876543210",

      address: {
        name: "Banjara Hills",
        type: "home",
        street: "Road No. 12",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500034",
        country: "India",
        phone: "9876543210",

        location: {
          type: "Point",
          coordinates: [78.4482, 17.4123],
        },
      },
    },

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",

      location: {
        type: "Point",
        coordinates: [78.3915, 17.4485],
      },
    },
  },

  // ============================================================
  // 3. PICKUP SUCCESSFUL
  // ============================================================
  {
    orderId: "ORD-003",
    orderNumber: "ORD1785236817177",
    orderDate: "2026-07-27T11:06:57.183Z",

    deliveryType: "SELLER_TO_HUB" as DeliveryType,

    assignedDate: "2026-07-27T09:00:00.000Z",
    pickupStartedDate: "2026-07-27T10:00:00.000Z",
    pickupDate: "2026-07-27T11:30:00.000Z",

    orderStatus: "Pickup Successful" as OrderStatus,

    items: [
      {
        bookId: "BOOK-002",
        bookName: "Atomic Habits",
        author: "James Clear",
        coverImage: "/images/atomic-habits.jpg",
        quantity: 1,
      },
    ],

    sellerDetails: {
      sellerId: "SELLER-002",
      name: "Book Seller",
      phoneNumber: "9000000000",

      address: {
        name: "Kukatpally",
        type: "home",
        street: "KPHB Phase 3",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500072",
        country: "India",
        phone: "9000000000",

        location: {
          type: "Point",
          coordinates: [78.3997, 17.4849],
        },
      },
    },

    pickupVerification: {
      verified: true,
      verifiedBy: "SELLER",
      verifiedAt: "2026-07-27T11:30:00.000Z",

      images: [
        "/uploads/pickup/front.jpg",
        "/uploads/pickup/back.jpg",
        "/uploads/pickup/condition.jpg",
      ],
    },

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",

       receivedBy: {
    adminId: "ADMIN-001",
    name: "Hub Manager",
    phoneNumber: "9000000010",
  },
      location: {
        type: "Point",
        coordinates: [78.3915, 17.4485],
      },
    },
  },

  // ============================================================
  // 4. GOING TO HUB
  // ============================================================
  {
    orderId: "ORD-004",
    orderNumber: "ORD1785236817178",
    orderDate: "2026-07-26T11:06:57.183Z",

    deliveryType: "SELLER_TO_HUB" as DeliveryType,

    assignedDate: "2026-07-26T09:00:00.000Z",
    pickupDate: "2026-07-26T11:00:00.000Z",
    hubStartedDate: "2026-07-26T11:15:00.000Z",

    orderStatus: "Going to Hub" as OrderStatus,

    items: [
      {
        bookId: "BOOK-003",
        bookName: "1984",
        author: "George Orwell",
        coverImage: "/images/1984.jpg",
        quantity: 1,
      },
    ],

    sellerDetails: {
      sellerId: "SELLER-003",
      name: "Test Seller",
      phoneNumber: "9000000001",

      address: {
        name: "Gachibowli",
        type: "home",
        street: "Financial District",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500032",
        country: "India",
        phone: "9000000001",

        location: {
          type: "Point",
          coordinates: [78.3428, 17.4435],
        },
      },
    },

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",

      distance: "5.2 km",

      location: {
        type: "Point",
        coordinates: [78.3915, 17.4485],
      },
    },
  },

  // ============================================================
  // 5. SUBMITTED TO ADMIN / HUB
  // ============================================================
  {
    orderId: "ORD-005",
    orderNumber: "ORD1785236817179",
    orderDate: "2026-07-25T11:06:57.183Z",

    deliveryType: "SELLER_TO_HUB" as DeliveryType,

    assignedDate: "2026-07-25T09:00:00.000Z",
    pickupDate: "2026-07-25T11:00:00.000Z",
    hubSubmittedDate: "2026-07-25T12:00:00.000Z",

    orderStatus: "Submitted to Admin" as OrderStatus,

    items: [
      {
        bookId: "BOOK-004",
        bookName: "The Alchemist",
        author: "Paulo Coelho",
        coverImage: "/images/alchemist.jpg",
        quantity: 1,
      },
    ],

    sellerDetails: {
      sellerId: "SELLER-004",
      name: "Test Seller",
      phoneNumber: "9000000002",

      address: {
        name: "Madhapur",
        type: "home",
        street: "Ayyappa Society",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500081",
        country: "India",
        phone: "9000000002",

        location: {
          type: "Point",
          coordinates: [78.3915, 17.4485],
        },
      },
    },

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",

      receivedBy: {
        adminId: "ADMIN-001",
        name: "Hub Manager",
        phoneNumber: "9000000010",
      },

      receivedDate: "2026-07-25T12:00:00.000Z",

      receivedImages: [
        "/uploads/hub/received-front.jpg",
        "/uploads/hub/received-condition.jpg",
      ],

      verificationStatus: "Verified",
    },
  },

  // ============================================================
  // 6. COMPLETED
  // ============================================================
  {
    orderId: "ORD-006",
    orderNumber: "ORD1785236817180",
    orderDate: "2026-07-24T11:06:57.183Z",

    deliveryType: "SELLER_TO_HUB" as DeliveryType,

    assignedDate: "2026-07-24T09:00:00.000Z",
    pickupDate: "2026-07-24T11:00:00.000Z",
    hubSubmittedDate: "2026-07-24T12:00:00.000Z",
    completedDate: "2026-07-24T12:15:00.000Z",

    orderStatus: "Completed" as OrderStatus,

    items: [
      {
        bookId: "BOOK-005",
        bookName: "Ikigai",
        author: "Héctor García",
        coverImage: "/images/ikigai.jpg",
        quantity: 1,
      },
    ],

    sellerDetails: {
      sellerId: "SELLER-005",
      name: "Test Seller",
      phoneNumber: "9000000003",

      address: {
        name: "Madhapur",
        type: "home",
        street: "Road No. 36",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500081",
        country: "India",
        phone: "9000000003",

        location: {
          type: "Point",
          coordinates: [78.3915, 17.4485],
        },
      },
    },

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",

      receivedBy: {
        adminId: "ADMIN-001",
        name: "Hub Manager",
      },

      receivedDate: "2026-07-24T12:00:00.000Z",

      verificationStatus: "Verified",
    },
  },

  // ============================================================
  // 7. ASSIGNED FOR DELIVERY TO USER
  // ============================================================
  {
    orderId: "ORD-007",
    orderNumber: "ORD1785236817181",
    orderDate: "2026-07-23T11:06:57.183Z",

    deliveryType: "HUB_TO_USER" as DeliveryType,

    assignedDate: "2026-07-23T09:00:00.000Z",

    orderStatus: "Assigned for Delivery" as OrderStatus,

    items: [
      {
        bookId: "BOOK-006",
        bookName: "Rich Dad Poor Dad",
        author: "Robert Kiyosaki",
        coverImage: "/images/rich-dad.jpg",
        quantity: 1,
      },
    ],

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
    },

    userDetails: {
      userId: "USER-001",
      name: "Rahul",
      phoneNumber: "9000000020",

      address: {
        name: "Home",
        type: "home",
        street: "Road No. 10",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500034",
        country: "India",
        phone: "9000000020",

        location: {
          type: "Point",
          coordinates: [78.4352, 17.4156],
        },
      },
    },
  },

  

  // ============================================================
  // 8. OUT FOR DELIVERY
  // ============================================================
  {
    orderId: "ORD-008",
    orderNumber: "ORD1785236817182",
    orderDate: "2026-07-22T11:06:57.183Z",

    deliveryType: "HUB_TO_USER" as DeliveryType,

    assignedDate: "2026-07-22T09:00:00.000Z",
    deliveryStartedDate: "2026-07-22T10:30:00.000Z",

    orderStatus: "Out for Delivery" as OrderStatus,

    items: [
      {
        bookId: "BOOK-007",
        bookName: "The Psychology of Money",
        author: "Morgan Housel",
        coverImage: "/images/psychology-money.jpg",
        quantity: 1,
      },
    ],

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
    },

    userDetails: {
      userId: "USER-002",
      name: "Priya",
      phoneNumber: "9000000021",

      address: {
        name: "Home",
        type: "home",
        street: "Kondapur Main Road",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500084",
        country: "India",
        phone: "9000000021",

        location: {
          type: "Point",
          coordinates: [78.3573, 17.4582],
        },
      },
    },
  },

  // ============================================================
  // 9. DELIVERED TO USER
  // ============================================================
  {
    orderId: "ORD-009",
    orderNumber: "ORD1785236817183",
    orderDate: "2026-07-21T11:06:57.183Z",

    deliveryType: "HUB_TO_USER" as DeliveryType,

    assignedDate: "2026-07-21T09:00:00.000Z",
    deliveryStartedDate: "2026-07-21T10:00:00.000Z",
    deliveredDate: "2026-07-21T11:30:00.000Z",

    orderStatus: "Delivered" as OrderStatus,

    items: [
      {
        bookId: "BOOK-008",
        bookName: "Deep Work",
        author: "Cal Newport",
        coverImage: "/images/deep-work.jpg",
        quantity: 1,
      },
    ],

    hubDetails: {
      hubId: "HYD-HUB-01",
      name: "Hyderabad Central Hub",
      address: "Madhapur",
      city: "Hyderabad",
      state: "Telangana",
    },

    userDetails: {
      userId: "USER-003",
      name: "Anjali",
      phoneNumber: "9000000022",

      address: {
        name: "Home",
        street: "Hitech City",
        type: "home",
        city: "Hyderabad",
        state: "Telangana",
        zipCode: "500081",
        country: "India",
        phone: "9000000022",

        location: {
          type: "Point",
          coordinates: [78.3772, 17.4483],
        },
      },
    },

    deliveryVerification: {
      verified: true,
      verifiedBy: "USER",
      verifiedAt: "2026-07-21T11:30:00.000Z",

      images: [
        "/uploads/delivery/book-delivered.jpg",
      ],
    },
  },
];