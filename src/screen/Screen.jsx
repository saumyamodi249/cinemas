import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getTheaterScreens,
  normalizeScreens,
  getScreenLayout,
  getSectionName,
  getSectionPrice,
  getSectionRows,
  getSeatsFromRow,
} from "./Screen.js";

const Screen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // =====================================================
  // BOOKING DATA FROM PREVIOUS PAGE
  // =====================================================

  const bookingState = location.state || {};

  const movie = bookingState.movie || null;
  const theater = bookingState.theater || null;
  const date = bookingState.date || null;
  const time = bookingState.time || null;

  /*
    SeatSelection se jitni seats user ne choose ki hain,
    utni hi seats Screen page par select karni compulsory hain.
  */
  const seatCount = Number(bookingState.seatCount) || 1;

  // =====================================================
  // THEATER ID
  // =====================================================

  const theaterId =
    bookingState.theaterId ||
    theater?.id ||
    theater?._id ||
    theater?.theaterId ||
    "";

  // =====================================================
  // SELECTED SEATS
  // =====================================================

  const [selectedSeats, setSelectedSeats] = useState([]);

  // =====================================================
  // SCREEN DATA
  // =====================================================

  const [screens, setScreens] = useState([]);
  const [selectedScreen, setSelectedScreen] = useState(null);

  // =====================================================
  // LOADING / ERROR
  // =====================================================

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // BACKGROUND
  // =====================================================

  const backgroundStyle = {
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

  // =====================================================
  // FETCH SCREEN API
  // =====================================================

  const showTimeId = bookingState.showTimeId || null;

  useEffect(() => {
    const loadScreen = async () => {
      try {
        setLoading(true);
        setError("");

        const screenData = bookingState.screen;

        console.log("========== SCREEN PAGE ==========");
        console.log("Theater ID:", theaterId);
        console.log("Screen ID from state:", bookingState.screenId);
        console.log("Screen object:", screenData);
        console.log("================================");

        if (!screenData) {
          throw new Error("Screen information is missing.");
        }

        setScreens([screenData]);
        setSelectedScreen(screenData);
      } catch (err) {
        console.error("SCREEN LOAD ERROR:", err);
        setError(err?.message || "Failed to load screen details.");
      } finally {
        setLoading(false);
      }
    };

    loadScreen();
  }, []);

  // =====================================================
  // SCREEN LAYOUT
  // =====================================================

  const layout = useMemo(() => {
    if (!selectedScreen) {
      return [];
    }

    const screenData = {
      ...selectedScreen.screen,
      bookedSeats: selectedScreen.bookedSeats || [],
    };

    console.log("========== LAYOUT DEBUG ==========");
    console.log("Screen ID:", screenData.id);
    console.log("Screen Number:", screenData.screenNumber);
    console.log("Raw Layout:", screenData.layout);
    console.log("Booked Seats:", screenData.bookedSeats);
    console.log("===================================");

    return getScreenLayout(screenData, showTimeId);
  }, [selectedScreen, showTimeId]);

  // =====================================================
  // TOTAL PRICE
  // =====================================================

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seat) => {
      return total + Number(seat.price || 0);
    }, 0);
  }, [selectedSeats]);

  // =====================================================
  // EXACT SEAT COUNT CHECK
  // =====================================================

  const canPay = selectedSeats.length === seatCount;

  // =====================================================
  // SELECT / DESELECT SEAT
  // =====================================================

  const handleSeatClick = ({ seat, section, row }) => {
    if (!seat?.available) {
      return;
    }

    const sectionPrice = getSectionPrice(section);
    const sectionName = getSectionName(section);

    const selectedSeatData = {
      ...seat,

      section: sectionName,

      sectionPrice,

      price: sectionPrice,

      row: row?.name || row?.row || row?.rowName || "",
    };

    setSelectedSeats((previousSeats) => {
      // =================================================
      // CHECK IF ALREADY SELECTED
      // =================================================

      const alreadySelected = previousSeats.some(
        (item) => item.id === selectedSeatData.id,
      );

      // =================================================
      // DESELECT
      // =================================================

      if (alreadySelected) {
        return previousSeats.filter((item) => item.id !== selectedSeatData.id);
      }

      // =================================================
      // MAXIMUM SEATS REACHED
      // =================================================

      if (previousSeats.length >= seatCount) {
        return previousSeats;
      }

      // =================================================
      // ADD NEW SEAT
      // =================================================

      return [...previousSeats, selectedSeatData];
    });
  };

  // =====================================================
  // CHANGE SCREEN
  // =====================================================

  const handleScreenChange = (screen) => {
    setSelectedScreen(screen);

    // Screen change hone par seats reset
    setSelectedSeats([]);
  };

  // =====================================================
  // PAY
  // =====================================================

  const handlePay = () => {
    /*
      EXACT SEAT COUNT REQUIRED
    */

    if (selectedSeats.length !== seatCount) {
      return;
    }

    console.log("================================");
    console.log("BOOKING DETAILS");
    console.log("================================");

    console.log("Movie:", movie);
    console.log("Theater:", theater);
    console.log("Date:", date);
    console.log("Time:", time);

    console.log("Required Seats:", seatCount);
    console.log("Selected Seats:", selectedSeats);
    console.log("Total Price:", totalPrice);

    /*
      Future mein yahan payment page par
      navigate kar sakte ho.

      Example:

      navigate("/payment", {
        state: {
          movie,
          theater,
          date,
          time,
          seatCount,
          selectedSeats,
          totalPrice,
        },
      });
    */
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen" style={backgroundStyle}>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div
              className="
                mx-auto
                mb-4
                h-10
                w-10
                animate-spin
                rounded-full
                border-4
                border-sky-200
                border-t-[#1090DF]
              "
            />

            <p className="text-gray-500">Loading seats...</p>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <main className="min-h-screen" style={backgroundStyle}>
        <div
          className="
            flex
            min-h-screen
            items-center
            justify-center
            px-6
          "
        >
          <div className="text-center">
            <p className="mb-5 text-red-500">{error}</p>

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="
                rounded-md
                border
                border-[#1090DF]
                bg-white
                px-6
                py-3
                text-sm
                font-medium
                text-[#1090DF]
                transition
                hover:bg-[#1090DF]
                hover:text-white
              "
            >
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <main
      className="min-h-screen overflow-y-auto hide-scrollbar"
      style={backgroundStyle}
    >
      <section className="px-6 pb-10 pt-8">
        <div className="mx-auto max-w-6xl">
          {/* =================================================
              BACK
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="
              mb-6
              text-sm
              text-gray-500
              transition
              hover:text-[#1090DF]
            "
          >
            ← Back
          </button>

          {/* =================================================
              MOVIE / THEATER INFORMATION
          ================================================= */}

          <div className="mb-8">
            <h1
              className="
                text-3xl
                font-bold
                uppercase
                text-[#1090DF]
              "
            >
              {movie?.name || movie?.title || "Select Your Seat"}
            </h1>

            <div
              className="
                mt-2
                flex
                flex-wrap
                gap-x-5
                gap-y-1
                text-sm
                text-gray-500
              "
            >
              {theater?.name && <span>{theater.name}</span>}

              {time && <span>{time}</span>}
            </div>

            {/* REQUIRED SEAT COUNT */}

            <div
              className="
                mt-4
                inline-flex
                items-center
                gap-2
                rounded-lg
                border
                border-[#1090DF]
                bg-white/80
                px-4
                py-2
              "
            >
              <span className="text-sm text-gray-500">Seats required:</span>

              <span className="font-semibold text-[#1090DF]">{seatCount}</span>

              <span className="text-gray-400">|</span>

              <span className="text-sm text-gray-500">Selected:</span>

              <span
                className={`font-semibold ${
                  selectedSeats.length === seatCount
                    ? "text-green-600"
                    : "text-[#1090DF]"
                }`}
              >
                {selectedSeats.length}/{seatCount}
              </span>
            </div>
          </div>

          {/* =================================================
              SCREEN SELECTOR
          ================================================= */}

          {screens.length > 1 && (
            <div className="mb-7">
              <p
                className="
                  mb-3
                  text-sm
                  font-medium
                  text-gray-500
                "
              >
                Screen
              </p>

              <div className="flex flex-wrap gap-3">
                {screens.map((screen, index) => {
                  const screenId = screen?.id || screen?._id || index;

                  const isSelected = selectedScreen === screen;

                  return (
                    <button
                      key={screenId}
                      type="button"
                      onClick={() => handleScreenChange(screen)}
                      className={`
                        rounded-md
                        border
                        px-5
                        py-2.5
                        text-sm
                        transition

                        ${
                          isSelected
                            ? `
                              border-[#1090DF]
                              bg-[#1090DF]
                              text-white
                            `
                            : `
                              border-gray-300
                              bg-white
                              text-gray-600
                              hover:border-[#1090DF]
                              hover:text-[#1090DF]
                            `
                        }
                      `}
                    >
                      {screen?.name ||
                        screen?.screenName ||
                        `Screen ${index + 1}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================
              SEAT AREA
          ================================================= */}

          <div
            className="
              rounded-2xl
              border
              border-gray-200
              bg-white/75
              px-5
              py-8
              shadow-sm
              md:px-10
            "
          >
            {/* SCREEN */}

            <div className="mb-10">
              <div
                className="
                  mx-auto
                  h-2
                  w-[70%]
                  rounded-full
                  bg-gray-300
                "
              />

              <p
                className="
                  mt-2
                  text-center
                  text-xs
                  uppercase
                  tracking-[0.25em]
                  text-gray-400
                "
              >
                Screen
              </p>
            </div>

            {/* =================================================
                SECTIONS
            ================================================= */}

            {layout.length === 0 ? (
              <div className="flex min-h-[250px] items-center justify-center text-center">
                <p className="text-gray-500">No seat layout available.</p>
              </div>
            ) : (
              <div>
                {layout.map((section, sectionIndex) => {
                  console
                  const sectionName = getSectionName(section);
                  const sectionPrice = getSectionPrice(section);
                  const rows = getSectionRows(section);

                  return (
                    <div
                      key={`${sectionName}-${sectionIndex}`}
                      className="mb-8"
                    >
                      {sectionIndex > 0 && (
                        <div className="mb-6 border-t border-gray-200" />
                      )}

                      <p className="mb-4 text-xs text-gray-400">
                        ₹{sectionPrice} {sectionName}
                      </p>

                      <div className="flex flex-col items-center gap-3">
                        {rows.map((row) => {
                          const seats = getSeatsFromRow(row);

                          return (
                            <div
                              key={row.name}
                              className="flex items-center gap-2"
                            >
                              {seats.map((seat) => {
                                const isSelected = selectedSeats.some(
                                  (item) => item.id === seat.id,
                                );

                                return (
                                  <button
                                    key={seat.id}
                                    type="button"
                                    disabled={!seat.available}
                                    onClick={() =>
                                      handleSeatClick({ seat, section, row })
                                    }
                                    title={
                                      seat.available
                                        ? `${seat.label} - ₹${sectionPrice}`
                                        : `${seat.label} - Unavailable`
                                    }
                                    className={`
                          flex h-8 w-8 items-center justify-center rounded-md
                          border text-[10px] font-medium transition-all duration-150
                          ${
                            !seat.available
                              ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-300"
                              : isSelected
                                ? "border-[#1090DF] bg-[#1090DF] text-white shadow-md"
                                : "border-gray-300 bg-white text-gray-600 hover:border-[#1090DF] hover:bg-[#C2E8FF] hover:text-[#1090DF]"
                          }
                        `}
                                  >
                                    {seat.label}
                                  </button>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* =================================================
                LEGEND
            ================================================= */}

            <div
              className="
                mt-8
                flex
                flex-wrap
                justify-center
                gap-6
                text-xs
                text-gray-500
              "
            >
              <div className="flex items-center gap-2">
                <span
                  className="
                    h-4
                    w-4
                    rounded
                    border
                    border-gray-300
                    bg-white
                  "
                />
                Available
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="
                    h-4
                    w-4
                    rounded
                    bg-[#1090DF]
                  "
                />
                Selected
              </div>

              <div className="flex items-center gap-2">
                <span
                  className="
                    h-4
                    w-4
                    rounded
                    bg-gray-100
                    ring-1
                    ring-gray-200
                  "
                />
                Unavailable
              </div>
            </div>
          </div>

          {/* =================================================
              BOTTOM BOOKING BAR
          ================================================= */}

          <div
            className={`
              mt-6
              flex
              flex-col
              gap-4
              rounded-xl
              border
              bg-white/90
              p-5
              shadow-sm
              sm:flex-row
              sm:items-center
              sm:justify-between

              ${canPay ? "border-[#1090DF]" : "border-gray-200"}
            `}
          >
            {/* SELECTED SEATS */}

            <div>
              <p
                className="
                  text-xs
                  text-gray-500
                "
              >
                Selected seats
              </p>

              <p
                className="
                  mt-1
                  text-lg
                  font-semibold
                  text-gray-800
                "
              >
                {selectedSeats.length > 0
                  ? selectedSeats.map((seat) => seat.label).join(", ")
                  : "No seats selected"}
              </p>

              {/* STATUS */}

              <p
                className={`
                  mt-1
                  text-xs
                  font-medium

                  ${canPay ? "text-green-600" : "text-gray-500"}
                `}
              >
                {canPay
                  ? "All required seats selected ✓"
                  : `Select ${seatCount - selectedSeats.length} more seat${
                      seatCount - selectedSeats.length === 1 ? "" : "s"
                    }`}
              </p>
            </div>

            {/* PRICE + PAY */}

            <div
              className="
                flex
                items-center
                gap-4
              "
            >
              <div className="text-right">
                <p
                  className="
                    text-xs
                    text-gray-500
                  "
                >
                  Total
                </p>

                <p
                  className="
                    text-xl
                    font-bold
                    text-[#1090DF]
                  "
                >
                  ₹{totalPrice}
                </p>
              </div>

              {/* PAY BUTTON */}

              <button
                type="button"
                disabled={!canPay}
                onClick={handlePay}
                className={`
                  rounded-md
                  border
                  px-7
                  py-3
                  text-sm
                  font-semibold
                  transition-all
                  duration-200

                  ${
                    canPay
                      ? `
                        border-[#1090DF]
                        bg-[#1090DF]
                        text-white
                        hover:bg-[#0879bd]
                      `
                      : `
                        cursor-not-allowed
                        border-gray-200
                        bg-gray-100
                        text-gray-400
                      `
                  }
                `}
              >
                Pay ₹{totalPrice}
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Screen;
