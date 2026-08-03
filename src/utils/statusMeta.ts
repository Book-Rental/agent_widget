import type { OrderStatus } from "../Types/AgentTypes";

export const STATUS_META: Partial<
  Record<
    OrderStatus,
    {
      label: string;
      badge: string;
      dot: string;
    }
  >
> = {
  "Ready For Pickup": {
    label: "Ready For Pickup",
    badge: "bg-gray-50 text-gray-700",
    dot: "bg-gray-500",
  },
  "Pickup Assigned": {
    label: "Pickup Assigned",
    badge: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  "Out For Pickup": {
    label: "Out For Pickup",
    badge: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  "Pickup Completed": {
    label: "Pickup Completed",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
  "Sorting Completed": {
    label: "Sorting Completed",
    badge: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-500",
  },
  "Delivery Agent Assigned": {
    label: "Delivery Agent Assigned",
    badge: "bg-violet-50 text-violet-700",
    dot: "bg-violet-500",
  },
  "Out For Delivery": {
    label: "Out For Delivery",
    badge: "bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
  },
  Delivered: {
    label: "Delivered",
    badge: "bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
  },
};