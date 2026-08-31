const BASE_URL =
  import.meta.env.VITE_API_URL;

export const createBookInspection = async (
  shipmentId: string,
  formData: FormData
) => {
  const response = await fetch(
    `${BASE_URL}/api/book-inspection/${shipmentId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to complete book inspection"
    );
  }

  return data;
};