import { UpdateShipmentStatusPayload } from "../Types/AgentTypes";
import type { ShipmentResponse } from "../Types/shipment";

const API_URL = import.meta.env.VITE_API_URL;

export const getShipment = async (
  shipmentId: string
): Promise<ShipmentResponse> => {
  const response = await fetch(
    `${API_URL}/api/shipment/${shipmentId}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch shipment.");
  }

  return response.json();
};

export const updateShipmentStatus = async (
  shipmentId: string,
  payload: UpdateShipmentStatusPayload
) => {
  console.log("Shipment ID:", shipmentId);
  console.log("Payload:", payload);
  const response = await fetch(
    `${API_URL}/api/shipment/${shipmentId}/status`,
    {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update shipment status");
  }

  return response.json();
}