import { API_BASE_URL, getAuthHeaders } from "../../config/api";

// =====================================================
// GET MOVIE DETAILS
// =====================================================

export const getMovieDetails = async (id) => {
  if (!id) {
    throw new Error("Movie ID is missing");
  }

  const response = await fetch(
    `${API_BASE_URL}/movies/${id}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch movie: ${response.status}`
    );
  }

  return await response.json();
};

// =====================================================
// GET SHOWS OF THEATER FOR SELECTED DATE
// =====================================================

export const getMovieShowTimes = async (
  theaterId,
  date
) => {
  if (!theaterId) {
    throw new Error("Theater ID is missing");
  }

  if (!date) {
    throw new Error("Show date is missing");
  }

  const response = await fetch(
    `${API_BASE_URL}/theaters/${theaterId}/shows?date=${encodeURIComponent(
      date
    )}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch show times: ${response.status}`
    );
  }

  const result = await response.json();
  
  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.shows)) {
    return result.shows;
  }

  if (Array.isArray(result?.data?.shows)) {
    return result.data.shows;
  }

  return [];
};