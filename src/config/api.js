export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000";

/**
 * Standard headers helper that includes the bearer authentication token
 * @param {Record<string, string>} [extraHeaders] - Optional additional headers
 * @returns {Record<string, string>}
 */
export const getAuthHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  return {
    Accept: "*/*",
    Authorization: `Bearer ${token}`,
    ...extraHeaders,
  };
};
