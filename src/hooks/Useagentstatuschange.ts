import { useUpdateShipmentStatus } from "./useUpdateShipmentStatus";
import { STATUS_CONFIG } from "../constants/shipmentStatus";
import type { AgentOrder, OrderStatus } from "../Types/AgentTypes";

export const useAgentStatusChange = (agentId: string) => {
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


    updateStatus({
      shipmentId: order.shipmentId,
      payload: {
        status,
        event: config.event,
        remarks: config.remarks,
        agentId,
        updatedBy: agentId,
      },
    });
  };


  return {
    onStatusChange,
    isUpdatingStatus,
  };
};