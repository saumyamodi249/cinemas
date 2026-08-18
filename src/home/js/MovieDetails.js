const API_BASE_URL =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000";

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  return {
    Accept: "application/json",
    Authorization: `Bearer ${token}`,
  };
};

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
      headers: getHeaders(),
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
      headers: getHeaders(),
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