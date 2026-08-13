import { useEffect, useState } from "react";
import { getMovies } from "../js/Movies";
import { getTheaters } from "../js/Theater";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  // ==============================
  // ACTIVE TAB
  // ==============================
  const [activeTab, setActiveTab] = useState("movie");

  // ==============================
  // MOVIE STATES
  // ==============================
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==============================
  // THEATER STATES
  // ==============================
  const [theaters, setTheaters] = useState([]);
  const [theaterLoading, setTheaterLoading] = useState(false);
  const [theaterError, setTheaterError] = useState("");

  // ==============================
  // MOVIES API
  // ==============================
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMovies();

        console.log("Movies API Response:", data);

        setMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Movies API Error:", err);
        setError(err.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // ==============================
  // THEATERS API
  // ==============================
  useEffect(() => {
    if (activeTab !== "theater") return;

    const fetchTheaters = async () => {
      try {
        setTheaterLoading(true);
        setTheaterError("");

        const data = await getTheaters();

        console.log("Theaters API Response:", data);

        setTheaters(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Theater API Error:", err);
        setTheaterError(
          err.message || "Failed to load theaters"
        );
      } finally {
        setTheaterLoading(false);
      }
    };

    fetchTheaters();
  }, [activeTab]);

  // ==============================
  // MOVIE CLICK
  // ==============================
  const handleMovieClick = (movieId) => {
    navigate(`/movie/${movieId}`);
  };

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
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
      {/* ==============================
          NAVBAR
      ============================== */}
      <Navbar />

      {/* ==============================
          MAIN CONTENT
      ============================== */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl">

          {/* ==============================
              NOW SHOWING
          ============================== */}
          <h1
            className="mb-6 text-2xl font-semibold"
            style={{ color: "#1090DF" }}
          >
            Now Showing
          </h1>

          {/* ==============================
              TABS
          ============================== */}
          <div className="mb-8 flex gap-4">

            {/* MOVIE TAB */}
            <button
              type="button"
              onClick={() => setActiveTab("movie")}
              className={`
                rounded-lg
                px-8
                py-3
                font-semibold
                transition-all
                duration-200
                ${
                  activeTab === "movie"
                    ? "bg-[#2F7FF3] text-white"
                    : "bg-white text-gray-800"
                }
              `}
            >
              Movie
            </button>

            {/* THEATER TAB */}
            <button
              type="button"
              onClick={() => setActiveTab("theater")}
              className={`
                rounded-lg
                px-8
                py-3
                font-semibold
                transition-all
                duration-200
                ${
                  activeTab === "theater"
                    ? "bg-[#2F7FF3] text-white"
                    : "bg-white text-gray-800"
                }
              `}
            >
              Theater
            </button>

          </div>

          {/* ==================================================
              MOVIE SECTION
          ================================================== */}
          {activeTab === "movie" && (
            <>
              {/* LOADING */}
              {loading && (
                <div className="rounded-2xl bg-white/80 p-10 text-center">
                  <p className="text-gray-500">
                    Loading movies...
                  </p>
                </div>
              )}

              {/* ERROR */}
              {error && !loading && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                  {error}
                </div>
              )}

              {/* NO MOVIES */}
              {!loading &&
                !error &&
                movies.length === 0 && (
                  <div className="rounded-2xl bg-white/80 p-10 text-center">
                    <p className="text-gray-500">
                      No movies found.
                    </p>
                  </div>
                )}

              {/* MOVIES */}
              {!loading &&
                !error &&
                movies.length > 0 && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    {movies.map((movie, index) => {
                      const movieId =
                        movie.id ||
                        movie._id ||
                        movie.movieId;

                      const title =
                        movie.title ||
                        movie.name ||
                        movie.movieName ||
                        `Movie ${index + 1}`;

                      const image =
                        movie.image ||
                        movie.poster ||
                        movie.posterUrl ||
                        movie.thumbnail;

                      return (
                        <div
                          key={movieId || index}
                          onClick={() =>
                            handleMovieClick(movieId)
                          }
                          className="
                            cursor-pointer
                            overflow-hidden
                            rounded-xl
                            bg-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-1
                            hover:shadow-lg
                          "
                        >

                          {/* IMAGE */}
                          <div className="h-72 w-full overflow-hidden bg-gray-100">
                            {image ? (
                              <img
                                src={image}
                                alt={title}
                                className="
                                  h-full
                                  w-full
                                  object-cover
                                "
                              />
                            ) : (
                              <div
                                className="
                                  flex
                                  h-full
                                  w-full
                                  items-center
                                  justify-center
                                  text-gray-400
                                "
                              >
                                No Image
                              </div>
                            )}
                          </div>

                          {/* MOVIE INFO */}
                          <div className="p-4">
                            <h2
                              className="
                                truncate
                                text-base
                                font-semibold
                                text-[#1090DF]
                              "
                            >
                              {title}
                            </h2>
                          </div>

                        </div>
                      );
                    })}

                  </div>
                )}
            </>
          )}

          {/* ==================================================
              THEATER SECTION
          ================================================== */}
          {activeTab === "theater" && (
            <div className="space-y-2">

              {/* LOADING */}
              {theaterLoading && (
                <div className="rounded-xl bg-white/70 py-10 text-center">
                  <p className="text-gray-500">
                    Loading theaters...
                  </p>
                </div>
              )}

              {/* ERROR */}
              {theaterError && !theaterLoading && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                  {theaterError}
                </div>
              )}

              {/* EMPTY */}
              {!theaterLoading &&
                !theaterError &&
                theaters.length === 0 && (
                  <div className="rounded-xl bg-white/70 py-10 text-center">
                    <p className="text-gray-500">
                      No theaters found.
                    </p>
                  </div>
                )}

              {/* THEATER LIST */}
              {!theaterLoading &&
                !theaterError &&
                theaters.length > 0 &&
                theaters.map((theater, index) => {

                  const name =
                    theater.name ||
                    theater.theaterName ||
                    theater.title ||
                    `Theater ${index + 1}`;

                  const address =
                    theater.address ||
                    theater.location ||
                    theater.city ||
                    "123 Cinema Lane, Movie Town, CA";

                  const pincode =
                    theater.pincode ||
                    theater.pinCode ||
                    theater.zipCode ||
                    "";

                  return (
                    <div
                      key={
                        theater.id ||
                        theater._id ||
                        index
                      }
                      className="
                        group
                        flex
                        min-h-[66px]
                        w-full
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
                        hover:bg-white
                      "
                    >

                      {/* ==============================
                          LEFT SIDE
                      ============================== */}
                      <div className="min-w-0 flex-1">

                        {/* THEATER NAME */}
                        <h2
                          className="
                            truncate
                            whitespace-nowrap
                            text-sm
                            font-semibold
                            text-[#1090DF]
                          "
                          title={name}
                        >
                          {name}
                        </h2>

                        {/* LOCATION */}
                        <div className="mt-2 flex items-start gap-2">

                          {/* LOCATION ICON */}
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
                              d="
                                M12 21s7-6.2 7-12
                                a7 7 0 1 0-14 0
                                c0 5.8 7 12 7 12Z
                              "
                            />

                            <circle
                              cx="12"
                              cy="9"
                              r="2.2"
                            />
                          </svg>

                          {/* ADDRESS */}
                          <div
                            className="
                              min-w-0
                              text-[10px]
                              leading-3
                              text-gray-500
                            "
                          >
                            <p className="truncate">
                              {address}
                            </p>

                            {pincode && (
                              <p>
                                {pincode}
                              </p>
                            )}
                          </div>

                        </div>
                      </div>

                      {/* ==============================
                          ARROW
                      ============================== */}
                      <button
                        type="button"
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

export default Home;