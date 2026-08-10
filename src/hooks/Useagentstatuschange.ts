import { useQueryClient } from "@tanstack/react-query";
import { useUpdateShipmentStatus } from "./useUpdateShipmentStatus";
import { STATUS_CONFIG } from "../constants/shipmentStatus";
import type { AgentOrder, OrderStatus } from "../Types/AgentTypes";

export const useAgentStatusChange = (agentId: string) => {
  const queryClient = useQueryClient();

  const {
    mutate: updateStatus,
    isPending: isUpdatingStatus,
  } = useUpdateShipmentStatus();

  const onStatusChange = (
    order: AgentOrder,
    status: OrderStatus
  ) => {
    if (!order.shipmentId) return;

    const config = STATUS_CONFIG[status];

    if (!config) return;

    updateStatus(
      {
        shipmentId: order.shipmentId,
        payload: {
          status,
          event: config.event,
          remarks: config.remarks,
          agentId,
          updatedBy: agentId,
        },
      },
      {
        onSuccess: async () => {
          await queryClient.invalidateQueries({
            queryKey: ["agent-orders", agentId],
          });
        },
      }
    );
  };

  return {
    onStatusChange,
    isUpdatingStatus,
  };
};