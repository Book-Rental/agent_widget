export const calculateDistance = (
  agentLat: number,
  agentLng: number,
  destinationLat: number,
  destinationLng: number
) => {
  const R = 6371;

  const dLat = ((destinationLat - agentLat) * Math.PI) / 180;
  const dLng = ((destinationLng - agentLng) * Math.PI) / 180;

  const lat1 = (agentLat * Math.PI) / 180;
  const lat2 = (destinationLat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};