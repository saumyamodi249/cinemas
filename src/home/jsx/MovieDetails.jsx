import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "./Navbar";
import { getMovieDetails } from "../js/MovieDetails";
import { getTheaterShows } from "../js/Theater";
import SeatSelection from "../../common/SeatSelection.jsx";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [selectedTheater, setSelectedTheater] = useState(null);

  const [showTimes, setShowTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [theaterId, setTheaterId] = useState("");

  const [timelist, setTimelist] = useState();

  // =====================================================
  // GET MOVIE DETAILS
  // =====================================================

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getMovieDetails(id);

        let movieData = null;

        if (response?.data && Array.isArray(response.data)) {
          movieData =
            response.data.find((item) => String(item?.id) === String(id)) ||
            response.data[0];
        } else if (response?.data && !Array.isArray(response.data)) {
          movieData = response.data;
        } else {
          movieData = response;
        }

        // const [theaterData, showData] = await Promise.all([
        //   getTheaterDetails(id),
        //   getTheaterShows(id, selectedDate),
        // ]);

        // console.log("THEATER DATA:", theaterData);
        // console.log("SHOW DATA:", showData);

        setMovie(movieData);

        if (movieData?.theaters?.length > 0) {
          setSelectedTheater(movieData.theaters[0]);
        }
      } catch (err) {
        console.error("MOVIE DETAILS ERROR:", err);

        setError(err.message || "Failed to load movie details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  // =====================================================
  // NEXT 7 DAYS
  // =====================================================

  const getNextSevenDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);

      date.setDate(today.getDate() + i);

      days.push(date);
    }

    return days;
  };

  const dates = getNextSevenDays();

  // =====================================================
  // DATE FORMAT FOR API
  // MM-DD-YYYY
  // =====================================================

  const formatApiDate = (date) => {
    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    const year = date.getFullYear();

    return `${month}-${day}-${year}`;
  };

  // =====================================================
  // FETCH SHOW TIMES FROM THEATER SHOW API
  // =====================================================

  useEffect(() => {
    const fetchShowTimes = async () => {
      if (!selectedTheater?.id || !movie?.id) {
        setShowTimes([]);
        setSelectedTime(null);
        return;
      }

      try {
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");

        const day = String(selectedDate.getDate()).padStart(2, "0");

        const year = selectedDate.getFullYear();

        const date = `${month}-${day}-${year}`;

        setTheaterId(selectedTheater.id);

        const response = await getTheaterShows(
          String(selectedTheater.id),
          String(date),
        );

        setTimelist(response[0].showTimes);

        // -----------------------------------------
        // RESPONSE ARRAY
        // -----------------------------------------

        const moviesList = Array.isArray(response)
          ? response
          : Array.isArray(response?.data)
            ? response.data
            : [];

        // -----------------------------------------
        // FIND CURRENT MOVIE
        // -----------------------------------------

        const currentMovie = moviesList.find((item) => {
          const apiMovieId = item?.id || item?.movieId || item?.movie?.id;

          return String(apiMovieId) === String(movie.id);
        });

        // -----------------------------------------
        // SHOW TIMES
        // -----------------------------------------

        const apiShowTimes = Array.isArray(currentMovie?.showTimes)
          ? currentMovie.showTimes
          : [];

        setShowTimes(apiShowTimes);

        if (apiShowTimes.length > 0) {
          setSelectedTime(apiShowTimes[0]);
        } else {
          setSelectedTime(null);
        }
      } catch (err) {
        console.error("SHOW TIME FETCH ERROR:", err);

        setShowTimes([]);
        setSelectedTime(null);
      }
    };

    fetchShowTimes();
  }, [selectedTheater, selectedDate, movie]);
  // =====================================================
  // FORMAT SHOW TIME
  // =====================================================

  const formatShowTime = (startTime) => {
    if (!startTime) {
      return "--:--";
    }

    const date = new Date(startTime);

    if (Number.isNaN(date.getTime())) {
      return "--:--";
    }

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // =====================================================
  // DATE DISPLAY
  // =====================================================

  const formatDate = (date) =>
    date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
    });

  const formatDay = (date) =>
    date.toLocaleDateString("en-US", {
      weekday: "short",
    });

  const formatFullDate = (date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  // =====================================================
  // BOOK NOW
  // =====================================================

  const handleBookNow = () => {
    if (!selectedDate) {
      alert("Please select a date");
      return;
    }

    if (!selectedTheater) {
      alert("Please select a theater");
      return;
    }

    if (!selectedTime) {
      alert("Please select a time");
      return;
    }

    setSeatModalOpen(true);
  };

  // =====================================================
  // CONFIRM SEATS
  // =====================================================

  const handleConfirmSeats = (numberOfSeats) => {
    setSeatModalOpen(false);

    navigate(`/screen/${selectedTheater.id}`, {
      state: {
        movie,
        date: selectedDate,
        theater: selectedTheater,

        time: selectedTime?.startTime,

        seatCount: numberOfSeats,

        showTimeId: selectedTime?.id || null,

        showTime: selectedTime || null,
      },
    });
  };

  // =====================================================
  // BACKGROUND
  // =====================================================

  const pageBackground = `
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
  `;

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main
        className="h-screen"
        style={{
          background: pageBackground,
        }}
      >
        <Navbar />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-gray-500">Loading movie details...</p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main
        className="h-screen"
        style={{
          background: pageBackground,
        }}
      >
        <Navbar />

        <div className="flex min-h-[70vh] flex-col items-center justify-center">
          <p className="mb-4 text-red-500">{error}</p>

          <button
            onClick={() => navigate("/home")}
            className="rounded-lg bg-[#1090DF] px-6 py-3 text-white"
          >
            Back to Home
          </button>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <main
      className="relative h-screen overflow-y-auto hide-scrollbar"
      style={{
        background: pageBackground,
      }}
    >
      <Navbar />

      <section className="px-6 pb-12 pt-5">
        <div className="mx-auto max-w-7xl">
          {/* BACK */}

          <button
            onClick={() => navigate("/home")}
            className="mb-5 text-sm text-gray-400 hover:text-[#1090DF]"
          >
            ← Back
          </button>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            {/* =====================================================
                LEFT SIDE
            ===================================================== */}

            <div className="mt-3">
              {/* DATE */}

              <h2 className="mb-5 text-2xl font-bold text-[#1090DF]">Date</h2>

              <div className="flex flex-nowrap gap-3 overflow-x-auto pb-2">
                {dates.map((date, index) => {
                  const selected =
                    selectedDate.toDateString() === date.toDateString();

                  return (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDate(date);
                        setSelectedTime(null);
                      }}
                      className={`flex h-[72px] w-[82px] shrink-0 flex-col items-center justify-center rounded-lg border text-sm ${
                        selected
                          ? "border-[#1090DF] bg-[#1090DF] text-white"
                          : "border-gray-300 bg-white text-gray-700"
                      }`}
                    >
                      <span>{formatDate(date)}</span>

                      <span className="mt-1 font-bold">{formatDay(date)}</span>
                    </button>
                  );
                })}
              </div>

              {/* THEATER */}

              <h2 className="mb-5 mt-8 text-2xl font-bold text-[#1090DF]">
                Theater
              </h2>

              <div className="flex flex-wrap gap-3">
                {movie?.theaters?.length > 0 ? (
                  movie.theaters.map((theater) => {
                    const selected = selectedTheater?.id === theater.id;

                    return (
                      <button
                        key={theater.id}
                        onClick={() => setSelectedTheater(theater)}
                        className={`rounded-lg border px-5 py-3 text-sm ${
                          selected
                            ? "border-[#1090DF] bg-[#1090DF] text-white"
                            : "border-gray-300 bg-white text-gray-600"
                        }`}
                      >
                        ◉ {theater.name}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">
                    No theaters available.
                  </p>
                )}
              </div>

              {/* TIME */}

              <h2 className="mb-5 mt-8 text-2xl font-bold text-[#1090DF]">
                Time
              </h2>

              {/* <div className="flex flex-wrap gap-3">
                {showTimes.length > 0 ? (
                  showTimes.map((show) => {
                    const selected = selectedTime?.id === show.id;

                    return (
                      <button
                        key={show.id}
                        type="button"
                        onClick={() => setSelectedTime(show)}
                        className={`rounded-lg border px-6 py-3 text-sm ${
                          selected
                            ? "border-[#1090DF] bg-[#1090DF] text-white"
                            : "border-gray-300 bg-white text-gray-700"
                        }`}
                      >
                        {formatShowTime(show.startTime)}
                      </button>
                    );
                  })
                ) : (
                  <p className="text-sm text-gray-500">
                    No show times available.
                  </p>
                )}
              </div> */}

              {theaterId &&
                (() => {
                  const timeButtons = [];

                  (timelist || []).forEach((item) => {
                    const time = item.startTime;

                    const formattedTime = new Date(time).toLocaleTimeString(
                      "en-IN",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      },
                    );

                    timeButtons.push(
                      <button
                        key={item.id}
                        type="button"
                        value={time}
                        onClick={() => {
                          setSelectedTime(item);
                        }}
                        className={`
            flex h-9 min-w-[44px] flex-col items-center justify-center
            rounded-sm border px-2 text-[9px]
            ${
              selectedTime?.startTime === time
                ? "border-[#1090DF] bg-[#e6f5ff]"
                : "border-gray-300 bg-white/50"
            }
          `}
                      >
                        <span>{formattedTime}</span>
                      </button>,
                    );
                  });

                  return (
                    <div className="mb-2 flex items-center gap-2">
                      {timeButtons}
                    </div>
                  );
                })()}
            </div>

            {/* =====================================================
                RIGHT SIDE
            ===================================================== */}

            <div className="w-full">
              <div className="mb-5 flex justify-end">
                <img
                  src={movie?.image}
                  alt={movie?.name}
                  className="h-[320px] w-[320px] rounded-xl object-cover shadow-md"
                />
              </div>

              <div className="flex justify-end">
                <div className="w-[320px] max-w-full">
                  <h1 className="w-full break-words text-2xl font-bold uppercase leading-tight text-[#1090DF]">
                    {movie?.name}
                  </h1>

                  <p className="mt-3 w-full break-words text-sm leading-6 text-gray-600">
                    {movie?.description}
                  </p>

                  <div className="mt-4 w-full space-y-2 text-sm">
                    <div className="flex">
                      <span className="w-[80px] shrink-0 text-gray-500">
                        Duration
                      </span>

                      <span className="font-medium text-gray-800">
                        {movie?.duration} min
                      </span>
                    </div>

                    <div className="flex">
                      <span className="w-[80px] shrink-0 text-gray-500">
                        Language
                      </span>

                      <span className="font-medium text-gray-800">
                        {movie?.languages?.join(", ")}
                      </span>
                    </div>

                    <div className="flex">
                      <span className="w-[80px] shrink-0 text-gray-500">
                        Type
                      </span>

                      <span className="font-medium text-gray-800">2D</span>
                    </div>
                  </div>

                  {/* BOOKING BOX */}

                  <div className="mt-6 min-h-[250px] w-full rounded-xl border border-[#1090DF] bg-white/80 p-10">
                    {selectedTheater && (
                      <h2 className="overflow-hidden text-2xl font-bold text-[#1090DF]">
                        {selectedTheater.name}
                      </h2>
                    )}

                    <p className="mt-4 text-base text-gray-600">
                      {formatFullDate(selectedDate)}
                    </p>

                    <p className="mt-1 text-base text-gray-600">
                      {selectedTime
                        ? new Date(selectedTime.startTime).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            },
                          )
                        : "No time selected"}
                    </p>
                    <p className="mt-4 text-xs text-gray-500">
                      *Select your seat before booking
                    </p>

                    <button
                      type="button"
                      onClick={handleBookNow}
                      disabled={!selectedTime}
                      className={`mt-11 w-full rounded-md border px-14 py-3 text-md font-medium transition ${
                        selectedTime
                          ? "border-[#1090DF] bg-white text-[#1090DF] hover:bg-[#1090DF] hover:text-white"
                          : "cursor-not-allowed border-gray-300 bg-gray-100 text-gray-400"
                      }`}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEAT MODAL */}

      <SeatSelection
        isOpen={seatModalOpen}
        onClose={() => setSeatModalOpen(false)}
        onConfirm={handleConfirmSeats}
      />
    </main>
  );
};

export default MovieDetails;
