/**
 * Home component:
 * 1. Fetches current movies on initial mount
 * 2. Displays movie catalog
 * 3. Fetches theater listings when Theater tab is selected
 * 4. Navigates to movie/theater details upon selection
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMovies } from "../js/Movies";
import { getTheaters } from "../js/Theater";
import Navbar from "./Navbar";

const Home = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("movie");

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [theaters, setTheaters] = useState([]);
  const [theaterLoading, setTheaterLoading] = useState(false);
  const [theaterError, setTheaterError] = useState("");

  // Fetch movies on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getMovies();
        setMovies(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || "Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Fetch theaters whenever the active tab switches to "theater"
  useEffect(() => {
    if (activeTab !== "theater") return;

    const fetchTheaters = async () => {
      try {
        setTheaterLoading(true);
        setTheaterError("");

        const data = await getTheaters();
        setTheaters(Array.isArray(data) ? data : []);
      } catch (err) {
        setTheaterError(err.message || "Failed to load theaters");
      } finally {
        setTheaterLoading(false);
      }
    };

    fetchTheaters();
  }, [activeTab]);

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

          <h1
            className="mb-6 text-2xl font-semibold"
            style={{ color: "#1090DF" }}
          >
            Now Showing
          </h1>

          <div className="mb-8 flex gap-4">

            <button
              type="button"
              onClick={() => setActiveTab("movie")}
              className={`rounded-lg px-8 py-3 font-semibold ${
                activeTab === "movie"
                  ? "bg-[#2F7FF3] text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              Movie
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab("theater");
              }}
              className={`rounded-lg px-8 py-3 font-semibold ${
                activeTab === "theater"
                  ? "bg-[#2F7FF3] text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              Theater
            </button>

          </div>

          {activeTab === "movie" && (
            <>
              {loading && (
                <div className="rounded-2xl bg-white/80 p-10 text-center">
                  <p className="text-gray-500">
                    Loading movies...
                  </p>
                </div>
              )}

              {error && !loading && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                  {error}
                </div>
              )}

              {!loading &&
                !error &&
                movies.length === 0 && (
                  <div className="rounded-2xl bg-white/80 p-10 text-center">
                    <p className="text-gray-500">
                      No movies found.
                    </p>
                  </div>
                )}

              {!loading &&
                !error &&
                movies.length > 0 && (
                  <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
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
                            navigate(`/movie/${movieId}`)
                          }
                          className="group cursor-pointer"
                        >
                          <div className="h-72 w-full overflow-hidden rounded-2xl">

                            {image ? (
                              <img
                                src={image}
                                alt={title}
                                className="h-full w-full rounded-2xl object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                                No Image
                              </div>
                            )}

                          </div>

                          <h2 className="mt-4 text-center text-base font-semibold text-[#1090DF]">
                            {title}
                          </h2>
                        </div>
                      );
                    })}
                  </div>
                )}
            </>
          )}

          {activeTab === "theater" && (
            <div className="space-y-2">

              {theaterLoading && (
                <div className="rounded-xl bg-white/70 py-10 text-center">
                  <p className="text-gray-500">
                    Loading theaters...
                  </p>
                </div>
              )}

              {theaterError && !theaterLoading && (
                <div className="rounded-lg bg-red-50 p-4 text-red-600">
                  {theaterError}
                </div>
              )}

              {!theaterLoading &&
                !theaterError &&
                theaters.length === 0 && (
                  <div className="rounded-xl bg-white/70 py-10 text-center">
                    <p className="text-gray-500">
                      No theaters found.
                    </p>
                  </div>
                )}

              {!theaterLoading &&
                !theaterError &&
                theaters.length > 0 &&
                theaters.map((theater, index) => {

                  const theaterId =
                    theater.id ||
                    theater.theaterId ||
                    theater._id;

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
                    theater.pincode ||
                    theater.pinCode ||
                    theater.zipCode ||
                    "";

                  return (
                    <div
                      key={theaterId || index}
                      onClick={() =>
                        navigate(`/theaters/${theaterId}`)
                      }
                      className="group flex min-h-16.5 w-full cursor-pointer items-center justify-between rounded-md border border-gray-200 bg-white/40 px-3 py-2 transition-all duration-200 hover:border-[#1090DF] hover:bg-white"
                    >

                      <div className="min-w-0 flex-1">

                        <h2 className="truncate whitespace-nowrap text-sm font-semibold text-[#1090DF]">
                          {name}
                        </h2>

                        <div className="mt-2 flex items-start gap-2">

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            className="mt-0.5 h-4 w-4 shrink-0 text-gray-500"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                            />

                            <circle
                              cx="12"
                              cy="9"
                              r="2.2"
                            />
                          </svg>

                          <div className="min-w-0 text-[10px] leading-3 text-gray-500">

                            <p className="truncate">
                              {address}
                            </p>

                            {pincode && (
                              <p>{pincode}</p>
                            )}

                          </div>

                        </div>

                      </div>

                      <span
                        className="ml-4 shrink-0 text-xl font-light text-[#1090DF] transition-transform duration-200 group-hover:translate-x-1"
                      >
                        ›
                      </span>

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