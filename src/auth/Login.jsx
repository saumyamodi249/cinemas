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
    e.preventDefault(); // Prevent form submission reload

    setMessage("");
    setLoading(true);

    try {
      const response = await loginUser(
        formData.email,
        formData.password
      );

      // Extract accessToken from response
      const token = response?.data?.accessToken;

      if (token) {
        // Persist token in browser
        localStorage.setItem("accessToken", token);

        setMessage("Login successful!");
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
    <div className="w-full h-auto min-h-screen md:h-screen flex flex-col md:flex-row overflow-y-auto md:overflow-hidden bg-white font-['Poppins',sans-serif]">

      {/* ================= LEFT ================= */}
      <div
        className="relative w-full md:w-1/2 md:flex-[0_0_50%] h-[45vh] min-h-[400px] md:h-screen md:min-h-0 flex flex-col justify-center p-[100px_30px_40px] md:p-10 overflow-hidden"
        style={{
          background: `
            radial-gradient(circle at top right, rgba(0, 123, 255, 0.28), transparent 42%),
            radial-gradient(circle at bottom left, rgba(0, 123, 255, 0.28), transparent 42%),
            linear-gradient(135deg, #f7fcff 0%, #e5f6ff 45%, #d5efff 100%)
          `,
        }}
      >
        <Link to="/">
          <img
            src="/cinemas.svg"
            alt="Cinemas"
            className="absolute top-[30px] left-[30px] md:top-[45px] md:left-[45px] w-[75px] md:w-[90px] h-auto block object-contain z-10"
          />
        </Link>

        <div className="w-[calc(100%-60px)] md:w-full md:max-w-[596px] absolute md:relative left-[30px] md:left-auto top-1/2 md:top-auto -translate-y-1/2 md:translate-y-[150px]">
          <h1 className="m-0 text-[38px] md:text-[48px] leading-[1.2] font-light italic tracking-[-1px] md:tracking-[-1.5px] text-[#062c3d] origin-left scale-x-110">
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
      <div className="w-full md:w-1/2 md:flex-[0_0_50%] h-[55vh] min-h-[400px] md:min-h-0 md:h-screen flex justify-center items-center p-[40px_30px] md:p-10 bg-white">
        <div className="w-full max-w-[450px] transform-none md:scale-[1.08] md:origin-center">
          <h2 className="m-0 mb-5 text-[20px] leading-[1.3] font-semibold text-[#111111]">
            Login to your account
          </h2>

          <form onSubmit={handleLogin}>
            {/* ================= EMAIL ================= */}
            <div className="w-full mb-[13px]">
              <label htmlFor="email" className="block mb-[6px] text-[11px] leading-[1.3] text-[#666666]">
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
                className="w-full h-[31px] px-[10px] border border-[#d6d6d6] rounded-[6px] outline-none bg-white text-[10px] text-[#333333] placeholder-[#777777] focus:border-[#4daeff] transition-colors"
              />
            </div>

            {/* ================= PASSWORD ================= */}
            <div className="w-full mb-[13px]">
              <label htmlFor="password" className="block mb-[6px] text-[11px] leading-[1.3] text-[#666666]">
                Password
              </label>

              <div className="relative w-full">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full h-[31px] pl-[10px] pr-[40px] border border-[#d6d6d6] rounded-[6px] outline-none bg-white text-[10px] text-[#333333] placeholder-[#777777] focus:border-[#4daeff] transition-colors"
                />

                <button
                  type="button"
                  className="absolute top-1/2 right-[8px] -translate-y-1/2 w-[28px] h-[28px] flex items-center justify-center border-none outline-none bg-transparent text-[#b8b8b8] hover:text-[#078be8] cursor-pointer p-0 z-5 transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-[17px] h-[17px] block" viewBox="0 0 24 24" fill="none">
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
                    <svg className="w-[17px] h-[17px] block" viewBox="0 0 24 24" fill="none">
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
              className="w-full h-[31px] mt-[2px] p-0 border border-[#1e9cff] rounded-[6px] bg-white text-[#078be8] text-[11px] font-medium cursor-pointer transition-colors duration-200 hover:bg-[#078be8] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* ================= API MESSAGE ================= */}
          {message && (
            <p className="mt-[10px] mb-0 text-center text-[10px] text-[#078be8]">
              {message}
            </p>
          )}

          {/* ================= REGISTER ================= */}
          <p className="mt-[13px] mb-0 text-center text-[10px] leading-[1.4] text-[#c0c0c0]">
            Don't Have An Account ?
            <Link
              to="/signup"
              className="ml-[4px] text-[#078be8] underline cursor-pointer hover:text-[#005fb8] transition-colors"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Login;