import { useQueries } from "@tanstack/react-query";
import { getAgentOrders } from "../services/order_history";
import type { OrderStatus } from "../Types/AgentTypes";

export const useAgentOrderCounts = (
  agentId: string,
  journeyType: "Pickup" | "Delivery",
  statuses: OrderStatus[]
) => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["agent-order-count", agentId, journeyType, "all"],
        queryFn: () => getAgentOrders(agentId, journeyType, 1, 1),
        enabled: !!agentId,
      },
      ...statuses.map((status) => ({
        queryKey: ["agent-order-count", agentId, journeyType, status],
        queryFn: () => getAgentOrders(agentId, journeyType, 1, 1, status),
        enabled: !!agentId,
      })),
    ],
  });

  const counts: Record<string, number> = {
    all: results[0].data?.meta.totalRecords ?? 0,
  };
  statuses.forEach((status, i) => {
    counts[status] = results[i + 1].data?.meta.totalRecords ?? 0;
  });

  return counts;
};