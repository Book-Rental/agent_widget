export const openMaps = (
  location?: {
    type: string;
    coordinates: number[];
  }
) => {
  if (
    !location?.coordinates ||
    location.coordinates.length !== 2
  ) {
    return;
  }

  const [longitude, latitude] = location.coordinates;

  const url =
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${latitude},${longitude}` +
    `&travelmode=driving`;

  window.open(url, "_blank");
};