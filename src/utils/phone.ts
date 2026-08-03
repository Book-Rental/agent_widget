export const callPhone = (phone?: string) => {
  if (!phone) return;

  window.location.href = `tel:${phone}`;
};