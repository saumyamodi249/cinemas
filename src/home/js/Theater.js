const THEATER_API =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000/theaters";

export const getTheaters = async () => {
  const token =
    localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("Login token not found");
  }

  const response = await fetch(
    THEATER_API,
    {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(
      `Failed to fetch theaters: ${response.status}`
    );
  }

  const data = await response.json();

  return Array.isArray(data?.data)
    ? data.data
    : [];
};