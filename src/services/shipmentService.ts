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