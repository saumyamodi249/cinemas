import { API_BASE_URL, getAuthHeaders } from "../../config/api";

const THEATER_API = `${API_BASE_URL}/theaters`;

// ALL THEATERS
export const getTheaters = async () => {
  const response = await fetch(THEATER_API, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch theaters: ${response.status}`);
  }

  const data = await response.json();

  return Array.isArray(data?.data) ? data.data : [];
};

// SINGLE THEATER DETAILS
export const getTheaterDetails = async (theaterId) => {
  const response = await fetch(`${THEATER_API}/${theaterId}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch theater details: ${response.status}`);
  }

  const data = await response.json();

  return data?.data || data;
};

// MOVIES OF THEATER
export const getTheaterMovies = async (theaterId) => {
  const response = await fetch(`${THEATER_API}/${theaterId}/movies`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch theater movies: ${response.status}`);
  }

  const data = await response.json();
  const movies = data.data.movies;

  return movies;
};

// SHOWS / TIME OF THEATER
export const getTheaterShows = async (theaterId, date) => {
  const response = await fetch(
    `${THEATER_API}/${theaterId}/shows?date=${encodeURIComponent(date)}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch theater shows: ${response.status}`);
  }

  const data = await response.json();

  return Array.isArray(data?.data) ? data.data : [];
};

export const getShowTimesByDate = async (movieId, date) => {
  const response = await fetch(
    `${API_BASE_URL}/show-times/${movieId}/by-date?date=${date}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch showtimes by date: ${response.status}`);
  }

  return response.json();
};

export const getScreenById = async (screenId) => {
  const response = await fetch(
    `${API_BASE_URL}/screens/${screenId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch screen details: ${response.status}`);
  }

  return response.json();
};
