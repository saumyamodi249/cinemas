const API_URL =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000/movies";

export const getMovies = async () => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Authentication token not found");
  }

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status}`);
  }

  const data = await response.json();

  return data;
};