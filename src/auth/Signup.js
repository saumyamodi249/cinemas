const API_URL =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000";

export const signupUser = async (
  firstName,
  lastName,
  email,
  password
) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
};