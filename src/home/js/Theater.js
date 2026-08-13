const THEATER_API =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000/theaters";

export const getTheaters = async () => {
  try {
    // Login ke time save hua JWT token
    const token = localStorage.getItem("accessToken");

    if (!token) {
      throw new Error("Login token not found");
    }

    const response = await fetch(THEATER_API, {
      method: "GET",
      headers: {
        Accept: "*/*",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch theaters: ${response.status}`);
    }

    const data = await response.json();

    // API response:
    // { data: [...] }
    if (Array.isArray(data?.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Theater API Error:", error);
    throw error;
  }
};