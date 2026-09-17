const API_URL =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000/movies";

export const getMovies = async () => {
  const token =
    localStorage.getItem("accessToken");
    //Login ke time tumne token save kiya tha:
    //Ab yahan wahi token wapas nikala ja raha hai.

  if (!token) {
    throw new Error(
      "Authentication token not found"
    );
  }

  const response = await fetch(API_URL, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,//Bearer:Backend is token ko check karke decide karega ki user authenticated hai ya nahi.
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch movies: ${response.status}`
    );
  }

  return await response.json();
};