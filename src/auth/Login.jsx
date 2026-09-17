import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "./Login";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // PASSWORD SHOW / HIDE
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();//Ye line reload ko rok deti hai.

    setMessage("");
    setLoading(true);

    try {
      const response = await loginUser(
        formData.email,
        formData.password
      );//api call


      // API response se token nikalo
      const token = response?.data?.accessToken;

      if (token) {
        // Token browser mein save karo
        localStorage.setItem("accessToken", token);

        // Login successful
        setMessage("Login successful!");

        // Home page par bhejo
        navigate("/home");
      } else {
        setMessage("Login failed. Token not received.");
      }
    } catch (error) {
      console.error("Login Error:", error);

      setMessage(
        error.message || "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* ================= LEFT ================= */}

      <div className="left">

        <Link to="/login">
          <img
            src="/cinemas.svg"
            alt="Cinemas"
            className="logo"
          />
        </Link>

        <div className="welcome-text">
          <h1>
            Welcome.
            <br />
            Begin your cinematic
            <br />
            adventure now with
            <br />
            our ticketing
            <br />
            platform!
          </h1>
        </div>

      </div>


      {/* ================= RIGHT ================= */}

      <div className="right">

        <div className="auth-form">

          <h2>Login to your account</h2>

          <form onSubmit={handleLogin}>

            {/* ================= EMAIL ================= */}

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="balamia@gmail.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

            </div>


            {/* ================= PASSWORD ================= */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-box">

                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />

                <button
                  type="button"
                  className="eye-icon"
                  onClick={() => setShowPassword((prev) => !prev)
                 }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        /* EYE OPEN */
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />

                                            <circle
                                                cx="12"
                                                cy="12"
                                                r="3"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    ) : (
                                        /* EYE CLOSED */
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M3 3L21 21"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />

                                            <path
                                                d="M10.6 5.2C11.05 5.07 11.52 5 12 5C18.5 5 22 12 22 12C22 12 20.7 14.6 18.3 16.5"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />

                                            <path
                                                d="M6.1 6.1C3.4 8.1 2 12 2 12C2 12 5.5 19 12 19C13.2 19 14.3 18.7 15.3 18.3"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    )}
                                </button>

                            </div>
                        </div>
            {/* ================= LOGIN BUTTON ================= */}

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login"}
            </button>

          </form>


          {/* ================= API MESSAGE ================= */}

          {message && (
            <p className="auth-message">
              {message}
            </p>
          )}


          {/* ================= REGISTER ================= */}

          <p className="auth-switch">

            Don't Have An Account ?

            <Link to="/signup">
              Register Here
            </Link>

          </p>

        </div>

      </div>

    </div>
  );
};

export default Login;