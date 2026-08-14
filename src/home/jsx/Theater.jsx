import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getTheaters } from "../js/Theater";

const Theater = () => {
  const navigate = useNavigate();

  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // FETCH THEATERS
  // ==============================
  useEffect(() => {
    const fetchTheaters = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTheaters();

        console.log("Theaters API Data:", data);

        setTheaters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Theater API Error:", err);
        setError(err.message || "Failed to load theaters");
      } finally {
        setLoading(false);
      }
    };

    fetchTheaters();
  }, []);

  // ==============================
  // THEATER CLICK
  // ==============================
  const handleTheaterClick = (theaterId) => {
    if (!theaterId) {
      console.error("Theater ID is missing");
      return;
    }

    console.log("Opening Theater:", theaterId);

    navigate(`/theaters/${theaterId}`);
  };

  return (
    <main
      className="h-screen overflow-y-auto hide-scrollbar"
      style={{
        background: `
          radial-gradient(
            circle 700px at 100% 0%,
            rgba(16, 144, 223, 0.60),
            rgba(16, 144, 223, 0.30) 45%,
            transparent 85%
          ),
          radial-gradient(
            circle 850px at 0% 100%,
            rgba(16, 144, 223, 0.60),
            rgba(16, 144, 223, 0.30) 45%,
            transparent 85%
          ),
          #ffffff
        `,
      }}
    >
      <Navbar />

      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          {/* ==============================
              TITLE
          ============================== */}
          <h1
            className="mb-8 text-2xl font-semibold"
            style={{ color: "#1090DF" }}
          >
            Theaters
          </h1>

          {/* ==============================
              LOADING
          ============================== */}
          {loading && (
            <div className="py-10 text-center text-gray-500">
              Loading theaters...
            </div>
          )}

          {/* ==============================
              ERROR
          ============================== */}
          {error && !loading && (
            <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
          )}

          {/* ==============================
              EMPTY
          ============================== */}
          {!loading && !error && theaters.length === 0 && (
            <div className="py-10 text-center text-gray-500">
              No theaters found.
            </div>
          )}

          {/* ==============================
              THEATER LIST
          ============================== */}
          {!loading && !error && theaters.length > 0 && (
            <div className="space-y-2">
              {theaters.map((theater, index) => {
                const theaterId =
                  theater.id || theater.theaterId || theater._id;

                const name =
                  theater.name ||
                  theater.theaterName ||
                  theater.title ||
                  `Theater ${index + 1}`;

                const address =
                  theater.address ||
                  theater.location ||
                  theater.city ||
                  "Location not available";

                const pincode =
                  theater.pincode || theater.pinCode || theater.zipCode || "";

                return (
                  <div
                    key={theaterId || index}
                    onClick={() => handleTheaterClick(theaterId)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleTheaterClick(theaterId);
                      }
                    }}
                    className="
                      group
                      flex
                      min-h-[66px]
                      w-full
                      cursor-pointer
                      items-center
                      justify-between
                      rounded-md
                      border
                      border-gray-200
                      bg-white/40
                      px-3
                      py-2
                      transition-all
                      duration-200
                      hover:border-[#1090DF]
                      hover:bg-[#e6f5ff]
                    "
                  >
                    {/* ==============================
                        LEFT
                    ============================== */}
                    <div className="min-w-0">
                      {/* Theater Name */}
                      <h2 className="text-sm font-semibold text-[#1090DF]">
                        {name}
                      </h2>

                      {/* Location */}
                      <div className="mb-2 flex items-start gap-2">
                        {/* Location Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="
                            mt-0.5
                            h-4
                            w-4
                            shrink-0
                            text-gray-500
                          "
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                          />

                          <circle cx="12" cy="9" r="2.2" />
                        </svg>

                        <div className="text-[10px] leading-3 text-gray-500">
                          <p>{address}</p>

                          {pincode && <p>{pincode}</p>}
                        </div>
                      </div>
                    </div>

                    {/* ==============================
                        ARROW
                    ============================== */}
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleTheaterClick(theaterId);
                      }}
                      className="
                        ml-4
                        shrink-0
                        text-xl
                        font-light
                        text-[#1090DF]
                        transition-transform
                        duration-200
                        group-hover:translate-x-1
                      "
                    >
                      ›
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Theater;
