import { useQueryClient } from "@tanstack/react-query";
import { useUpdateShipmentStatus } from "./useUpdateShipmentStatus";
import { useBulkUpdateShipmentStatus } from "./useBulkUpdateShipmentStatus";
import { STATUS_CONFIG } from "../constants/shipmentStatus";
import type { AgentOrder, OrderStatus } from "../Types/AgentTypes";
import { useState } from "react";

export const useAgentStatusChange = (agentId: string) => {
  const queryClient = useQueryClient();
  const [isSyncingStatus, setIsSyncingStatus] = useState(false);
  const {
    mutate: updateStatus,
  } = useUpdateShipmentStatus();

  const {
    mutateAsync: bulkUpdateStatus,
    isPending: isBulkUpdating,
  } = useBulkUpdateShipmentStatus();

  const onStatusChange = ( order: AgentOrder, status: OrderStatus ) => {
    if (!order.shipmentId) return;
    const config = STATUS_CONFIG[status];
    if (!config) return;

    setIsSyncingStatus(true);

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
          setIsSyncingStatus(false);
        },
         onError: () => {
          setIsSyncingStatus(false);
        },
      }
    );
  };

  const onBulkStatusChange = async (
    shipmentIds: string[],
    status: OrderStatus
  ) => {
    const config = STATUS_CONFIG[status];
    if (!config || shipmentIds.length === 0) return;

    await bulkUpdateStatus(
      {
        shipmentIds,
        status,
        remarks: config.remarks,
        updatedBy: agentId,
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
    isUpdatingStatus: isSyncingStatus,
    onBulkStatusChange,
    isBulkUpdating,
  };
};