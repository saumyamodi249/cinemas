import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "./Navbar";
import {
  getTheaterDetails,
  getTheaterShows,
  getShowTimesByDate,
  getScreenById,
} from "../js/Theater";
import SeatSelection from "../../common/SeatSelection";

const formatApiDate = (date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

const getNextThreeDates = () => {
  const today = new Date();

  return Array.from({ length: 3 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);

    return formatApiDate(date);
  });
};

const TheaterDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [theater, setTheater] = useState(null);
  const [movies, setMovies] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(getNextThreeDates()[0]);

  /*
   * SELECTED SHOWTIME
   * Tracks which movie + showtime button the user picked
   */
  const [selectedShow, setSelectedShow] = useState(null);
  // shape: { movieId, showTimeId, startTime }

  /*
   * BOOKING FLOW (by-date lookup -> screen lookup -> modal)
   */
  const [isSeatModalOpen, setIsSeatModalOpen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  const dates = getNextThreeDates();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [theaterData, showData] = await Promise.all([
          getTheaterDetails(id),
          getTheaterShows(id, selectedDate),
        ]);

        setTheater(
          theaterData?.data || theaterData?.theater || theaterData || null,
        );

        const movieList = Array.isArray(showData)
          ? showData
          : Array.isArray(showData?.data)
            ? showData.data
            : [];

        setMovies(movieList);

        // reset selection when date changes
        setSelectedShow(null);
      } catch (err) {
        console.error("THEATER DETAILS ERROR:", err);
        setError(err.message || "Failed to load theater details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, selectedDate]);

  /*
   * LANGUAGE
   */
  const getLanguage = (movie) =>
    Array.isArray(movie?.languages) ? movie.languages.join(", ") : "Hindi";

  /*
   * FORMAT / LAYOUT TYPE (from showtime pricing)
   */
  const getFormats = (movie) => {
    const formats = new Set();

    (movie?.showTimes || []).forEach((show) => {
      (show?.price || []).forEach((p) => {
        if (p?.layoutType) formats.add(p.layoutType);
      });
    });

    return Array.from(formats).join(", ");
  };

  /*
   * SHOW TIME (formats ISO startTime -> "3:00 PM")
   */
  const getTime = (show) => {
    if (!show?.startTime) return "--:--";

    const d = new Date(show.startTime);

    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  /*
   * SELECT SHOWTIME
   */
  const handleSelectShow = (movie, show) => {
    setSelectedShow({
      movieId: movie.id,
      showTimeId: show.id,
      startTime: show.startTime,
    });
    setBookingError("");
  };

  /*
   * BOOK NOW
   *
   * 1. Requires a showtime to be selected for this movie
   * 2. Fetch showtimes-by-date for the movie
   * 3. Find current theater in that response
   * 4. Find the matching showtime by showTimeId -> get screenId
   * 5. Fetch screen by id
   * 6. Open SeatSelection modal
   */
  const handleBookNow = async (movie) => {
    if (!selectedShow || selectedShow.movieId !== movie.id) {
      setBookingError("Please select a showtime first.");
      return;
    }

    try {
      setBookingLoading(true);
      setBookingError("");

      const byDateData = await getShowTimesByDate(movie.id, selectedDate);

      const theatersList = Array.isArray(byDateData)
        ? byDateData
        : Array.isArray(byDateData?.theaters)
          ? byDateData.theaters
          : [];

      const matchedTheater = theatersList.find(
        (t) => String(t.id) === String(id),
      );

      if (!matchedTheater) {
        throw new Error("Could not find this theater for the selected date.");
      }

      const matchedShowtime = (matchedTheater.showtimes || []).find(
        (st) => String(st.showTimeId) === String(selectedShow.showTimeId),
      );

      if (!matchedShowtime) {
        throw new Error("Could not find the selected showtime.");
      }

      const screenId = matchedShowtime.screenId;

      if (!screenId) {
        throw new Error("No screen assigned to this showtime.");
      }

      const screenData = await getScreenById(screenId);

      setSelectedScreen(screenData?.data || screenData);

      setSelectedScreen(screenData?.data || screenData);
      setIsSeatModalOpen(true);
    } catch (err) {
      console.error("BOOKING ERROR:", err);
      setBookingError(err.message || "Failed to start booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  /*
   * SEAT CONFIRM
   */
  const handleSeatConfirm = (seatCount) => {
    setIsSeatModalOpen(false);

    const bookedMovie =
      movies.find((m) => m.id === selectedShow.movieId) || null;

    const screenId =
      selectedScreen?.screen?.id ||
      selectedScreen?.screen?._id ||
      selectedScreen?.screen?.screenId ||
      null;

    if (!screenId) {
      console.error("SCREEN ID NOT FOUND");
      return;
    }

    navigate(`/screen/${id}`, {
      state: {
        movie: bookedMovie,
        theater,
        theaterId: id,

        date: selectedDate,
        time: selectedShow.startTime,

        showTimeId: selectedShow.showTimeId,

        // IMPORTANT
        screenId: screenId,
        screen: selectedScreen,

        seatCount,
      },
    });
  };

  /*
   * THEATER NAME
   */
  const theaterName =
    theater?.name ||
    theater?.theaterName ||
    theater?.theater_name ||
    theater?.title ||
    "Theater Name";

  /*
   * ADDRESS
   */
  const theaterAddress =
    theater?.address ||
    theater?.location ||
    theater?.city ||
    "123 Cinema Lane, Movie Town, CA 90210";

  /*
   * DATE FORMAT
   */
  const formatDate = (date) => {
    const [month, day, year] = date.split("-");
    const d = new Date(Number(year), Number(month) - 1, Number(day));

    return {
      date: d.toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
      day: d.toLocaleDateString("en-US", { weekday: "short" }),
    };
  };

  /*
   * BACKGROUND
   */
  const pageStyle = {
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
  };

  if (loading) {
    return (
      <main className="min-h-screen" style={pageStyle}>
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-16 text-center text-gray-500">
          Loading theater...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen" style={pageStyle}>
        <Navbar />
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="rounded-lg bg-red-50 p-4 text-red-600">{error}</div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen overflow-y-auto hide-scrollbar"
      style={pageStyle}
    >
      <Navbar />

      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          {/* THEATER HEADER */}
          <div className="mb-5">
            <button
              type="button"
              onClick={() => navigate("/theaters")}
              className="flex items-center gap-3"
            >
              <span className="text-3xl font-light text-[#1090DF]">←</span>
              <h1 className="text-3xl font-bold text-[#1090DF]">
                {theaterName}
              </h1>
            </button>

            <div className="mt-2 ml-8 flex items-center gap-2 text-[10px] text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"
                />
                <circle cx="12" cy="9" r="2.2" />
              </svg>
              <span>{theaterAddress}</span>
            </div>
          </div>

          {/* DATES */}
          <div className="mb-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const index = dates.indexOf(selectedDate);
                if (index > 0) setSelectedDate(dates[index - 1]);
              }}
              className="text-xl font-light text-[#1090DF]"
            >
              ‹
            </button>

            {dates.map((date) => {
              const formatted = formatDate(date);

              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => setSelectedDate(date)}
                  className={`
                    flex h-9 min-w-[44px] flex-col items-center justify-center
                    rounded-sm border px-2 text-[9px]
                    ${
                      selectedDate === date
                        ? "border-[#1090DF] bg-[#e6f5ff]"
                        : "border-gray-300 bg-white/50"
                    }
                  `}
                >
                  <span>{formatted.date}</span>
                  <span>{formatted.day}</span>
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                const index = dates.indexOf(selectedDate);
                if (index < dates.length - 1) setSelectedDate(dates[index + 1]);
              }}
              className="text-xl font-light text-[#1090DF]"
            >
              ›
            </button>
          </div>

          <div className="mb-8 border-b border-gray-300" />

          {bookingError && (
            <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-xs text-red-600">
              {bookingError}
            </div>
          )}

          {/* MOVIES */}
          {movies.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              No movies found.
            </div>
          ) : (
            movies.map((movie) => {
              const language = getLanguage(movie);
              const format = getFormats(movie);
              const movieShows = movie?.showTimes || [];

              const isBookDisabled =
                bookingLoading ||
                !selectedShow ||
                selectedShow.movieId !== movie.id;

              return (
                <div
                  key={movie.id}
                  className="mb-8 flex items-start justify-between"
                >
                  {/* MOVIE INFO */}
                  <div>
                    <h2 className="text-sm font-semibold text-[#1090DF]">
                      {movie.name}
                    </h2>

                    <p className="mt-2 text-[10px] text-gray-600">
                      {language}
                      {format ? `, ${format}` : ""}
                    </p>

                    <p className="mt-2 text-[10px] text-gray-600">Time</p>

                    <div className="mt-1 flex flex-wrap gap-3">
                      {movieShows.length > 0 ? (
                        movieShows.map((show) => {
                          const isSelected =
                            selectedShow?.showTimeId === show.id;

                          return (
                            <button
                              key={show.id}
                              type="button"
                              onClick={() => handleSelectShow(movie, show)}
                              className={`
                                h-7 min-w-[52px] rounded-md border px-2 text-[9px]
                                transition
                                ${
                                  isSelected
                                    ? "border-[#1090DF] bg-[#1090DF] text-white"
                                    : "border-gray-300 bg-white/40 text-gray-600 hover:border-[#1090DF]"
                                }
                              `}
                            >
                              {getTime(show)}
                            </button>
                          );
                        })
                      ) : (
                        <span className="text-[10px] text-gray-400">
                          No shows available
                        </span>
                      )}
                    </div>
                  </div>

                  {/* BOOK NOW */}
                  <button
                    type="button"
                    disabled={isBookDisabled}
                    onClick={() => handleBookNow(movie)}
                    className={`
                      mt-7 h-9 w-[137px] rounded-md border text-xs transition
                      ${
                        isBookDisabled
                          ? "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                          : "border-[#1090DF] bg-white/10 text-[#1090DF] hover:bg-[#1090DF] hover:text-white"
                      }
                    `}
                  >
                    {bookingLoading && selectedShow?.movieId === movie.id
                      ? "Loading..."
                      : "Book Now"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </section>

      <SeatSelection
        isOpen={isSeatModalOpen}
        onClose={() => setIsSeatModalOpen(false)}
        onConfirm={handleSeatConfirm}
      />
    </main>
  );
};

export default TheaterDetails;
