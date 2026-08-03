// utils/openMaps.ts

export const openMaps = (
  location?: {
    type: string;
    coordinates: number[];
  }
) => {
  if (!location?.coordinates) return;

  const [longitude, latitude] = location.coordinates;

  const url =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${latitude},${longitude}` +
    `&travelmode=driving`;

  window.open(url, "_blank", "noopener,noreferrer");
};