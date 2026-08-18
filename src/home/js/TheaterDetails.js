const THEATER_API =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000/theaters";

const getHeaders = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Login token not found");
  }

  return {
    Accept: "*/*",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// GET ALL THEATERS
export const getTheaters = async () => {
  const response = await fetch(THEATER_API, {
    method: "GET",
    headers: getHeaders(),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch theaters: ${response.status}`
    );
  }

  const result = await response.json();

  return Array.isArray(result)
    ? result
    : Array.isArray(result?.data)
    ? result.data
    : [];
};

// GET SINGLE THEATER
export const getTheaterDetails = async (theaterId) => {
  if (!theaterId) {
    throw new Error("Theater ID is missing");
  }

  const response = await fetch(
    `${THEATER_API}/${theaterId}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch theater details: ${response.status}`
    );
  }

  const result = await response.json();

  return result?.data || result;
};

// GET MOVIES OF THEATER
export const getTheaterMovies = async (theaterId) => {
  if (!theaterId) {
    throw new Error("Theater ID is missing");
  }

  const response = await fetch(
    `${THEATER_API}/${theaterId}/movies`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch theater movies: ${response.status}`
    );
  }

  const result = await response.json();

  // API response can be:
  // [...]
  // { data: [...] }
  // { movies: [...] }
  // { data: { movies: [...] } }

  if (Array.isArray(result)) {
    return result;
  }

  if (Array.isArray(result?.data)) {
    return result.data;
  }

  if (Array.isArray(result?.movies)) {
    return result.movies;
  }

  if (Array.isArray(result?.data?.movies)) {
    return result.data.movies;
  }

  return [];
};

// GET SHOWS OF THEATER
export const getTheaterShows = async (
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
    `${THEATER_API}/${theaterId}/shows?date=${encodeURIComponent(
      date
    )}`,
    {
      method: "GET",
      headers: getHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch theater shows: ${response.status}`
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