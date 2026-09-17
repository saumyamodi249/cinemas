import { API_BASE_URL, getAuthHeaders } from "../../config/api";

export const getMovies = async () => {
  const response = await fetch(`${API_BASE_URL}/movies`, {
    method: "GET",
    headers: getAuthHeaders({ Accept: "application/json" }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  return await response.json();
};