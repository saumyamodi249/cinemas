const API_URL =
  "http://ec2-3-111-219-88.ap-south-1.compute.amazonaws.com:3000";

export const signupUser = async (
  firstName,
  lastName,
  email,
  password //Isko 4 values chahiye:
) => {
  const response = await fetch(`${API_URL}/auth/signup`, {//await: Backend ka response aane ka wait karo.
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