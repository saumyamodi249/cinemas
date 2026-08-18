import React, { useState } from "react";
import "./Auth.css";
import { Link } from "react-router-dom";
import { signupUser } from "../auth/Signup";

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // 👁️ Password show/hide
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const data = await signupUser(
                formData.firstName,
                formData.lastName,
                formData.email,
                formData.password
            );


            setMessage("Account created successfully!");

            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                password: "",
            });

            // Password ko wapas hide kar do
            setShowPassword(false);

        } catch (error) {
            console.error("Signup Error:", error);

            setMessage(
                error.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">

            {/* LEFT SIDE */}
            <div className="left">

                {/* LOGO */}
                <img
                    src="/cinemas.svg"
                    alt="Cinemas"
                    className="logo"
                />

                {/* WELCOME TEXT */}
                <div className="welcome-text">
                    <h1>Welcome.</h1>

                    <p>
                        Begin your cinematic
                        <br />
                        adventure now with
                        <br />
                        our ticketing
                        <br />
                        platform!
                    </p>
                </div>

            </div>

            {/* RIGHT SIDE */}
            <div className="right">

                <div className="auth-form">

                    <h2>Create an account</h2>

                    <form onSubmit={handleSignup}>

                        {/* FIRST NAME */}
                        <div className="form-group">
                            <label htmlFor="firstName">
                                First name
                            </label>

                            <input
                                id="firstName"
                                type="text"
                                name="firstName"
                                placeholder="Enter your first name"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* LAST NAME */}
                        <div className="form-group">
                            <label htmlFor="lastName">
                                Last name
                            </label>

                            <input
                                id="lastName"
                                type="text"
                                name="lastName"
                                placeholder="Enter your last name"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* EMAIL */}
                        <div className="form-group">
                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div className="form-group">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="password-box">

                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                {/* EYE BUTTON */}
                                <button
                                    type="button"
                                    className="eye-icon"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
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

                        {/* SIGN UP */}
                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Creating account..."
                                : "Sign Up"}
                        </button>

                    </form>

                    {/* API MESSAGE */}
                    {message && (
                        <p className="auth-message">
                            {message}
                        </p>
                    )}

                    {/* LOGIN */}
                    <p className="auth-switch">
                        Already Have An Account?

                        <Link to="/">
                            Login here
                        </Link>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default Signup;