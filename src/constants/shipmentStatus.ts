import type { OrderStatus } from "../Types/AgentTypes";

export const STATUS_CONFIG: Partial<
  Record<
    OrderStatus,
    {
        event: string;
        remarks: string;
    }
  >
> = {
  "Pickup Assigned": {
    event: "Pickup Assigned",
    remarks: "Pickup assigned to agent.",
  },

  "Out For Pickup": {
    event: "Out For Pickup",
    remarks: "Agent is on the way to pickup.",
  },

  "Pickup Completed": {
    event: "Pickup Completed",
    remarks: "Pickup completed successfully.",
  },

  "Sorting Completed": {
    event: "Sorting Completed",
    remarks: "Book submitted to hub.",
  },

  "Out For Delivery": {
    event: "Out For Delivery",
    remarks: "Agent is on the way for delivery.",
  },

  "Delivered": {
    event: "Delivered",
    remarks: "Shipment delivered successfully.",
  },
};