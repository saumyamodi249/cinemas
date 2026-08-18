import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  getScreenLayout,
  getSectionName,
  getSectionRows,
  getSeatsFromRow,
  getTheaterScreens,
} from "./Screen.js";

const Screen = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [price, setprice] = useState();

  // =====================================================
  // BOOKING DATA
  // =====================================================

  const bookingState = location.state || {};

  const movie = bookingState.movie || null;
  const theater = bookingState.theater || null;
  const date = bookingState.date || null;
  const time = bookingState.time || null;

  useEffect(() => {
    const getPrice = async () => {
      try {
        const priceData = await getTheaterScreens(bookingState.screenId);
      } catch (error) {
        console.error("Price fetch error:", error);
      }
    };

    if (bookingState.screenId) {
      getPrice();
    }
  }, [bookingState.screenId]);

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

  const showTimeId =
    bookingState.showTimeId ||
    bookingState.showId ||
    bookingState.show?.id ||
    null;

  // ShowTime agar previous page se aa raha hai
  const passedShowTime =
    bookingState.showTime ||
    bookingState.selectedShowTime ||
    bookingState.show ||
    null;

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
  // LOAD SCREEN
  // =====================================================

  useEffect(() => {
    const loadScreen = async () => {
      try {
        setLoading(true);
        setError("");

        const screenData = bookingState.screen;

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

    return getScreenLayout(screenData, showTimeId);
  }, [selectedScreen, showTimeId]);

  // =====================================================
  // FIND CURRENT SHOW TIME
  //
  // Priority:
  // 1. showTime passed through navigation state
  // 2. selectedScreen.showTimes
  // 3. selectedScreen.screen.showTimes
  // 4. selectedScreen itself if it contains showTimes
  // =====================================================

  const currentShowTime = useMemo(() => {
    const possibleShowTimes = [
      ...(Array.isArray(selectedScreen?.showTimes)
        ? selectedScreen.showTimes
        : []),

      ...(Array.isArray(selectedScreen?.screen?.showTimes)
        ? selectedScreen.screen.showTimes
        : []),

      ...(Array.isArray(selectedScreen?.data?.showTimes)
        ? selectedScreen.data.showTimes
        : []),
    ];

    // IMPORTANT:
    // First find showTime using showTimeId / showId
    if (showTimeId) {
      const matchedShowTime = possibleShowTimes.find(
        (show) => String(show?.id) === String(showTimeId),
      );

      if (matchedShowTime) {
        return matchedShowTime;
      }
    }

    // Fallback only if there is exactly one showTime
    if (possibleShowTimes.length === 1) {
      return possibleShowTimes[0];
    }

    return null;
  }, [selectedScreen, showTimeId]);

  // =====================================================
  // SHOW TIME PRICES
  // =====================================================

  const showTimePrices = useMemo(() => {
    const prices = currentShowTime?.price;

    if (!Array.isArray(prices)) {
      return [];
    }

    return prices;
  }, [currentShowTime]);

  // =====================================================
  // GET PRICE FOR SECTION
  // =====================================================

  const getPriceFromShowTime = (section) => {
    const sectionName = "Premium";

    if (!currentShowTime) {
      return 0;
    }

    if (!Array.isArray(currentShowTime.price)) {
      return 0;
    }

    const normalizedSectionName = String(sectionName || "")
      .trim()
      .toLowerCase();

    const matchedPrice = currentShowTime.price.find((item) => {
      const layoutType = String(item?.layoutType || "")
        .trim()
        .toLowerCase();

      return layoutType === normalizedSectionName;
    });

    return Number(matchedPrice?.price || 0);
  };

  // =====================================================
  // TOTAL PRICE
  // =====================================================

  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((total, seat) => {
      return total + Number(seat.price || 0);
    }, 0);
  }, [selectedSeats]);

  // =====================================================
  // CAN PAY
  // =====================================================

  const canPay = selectedSeats.length === seatCount;

  // =====================================================
  // SELECT / DESELECT SEAT
  // =====================================================

  const handleSeatClick = ({ seat, section, row }) => {
    if (!seat?.available) {
      return;
    }

    const sectionPrice = getPriceFromShowTime(section);
    const sectionName = getSectionName(section);

    const selectedSeatData = {
      ...seat,
      section: sectionName,
      sectionPrice,
      price: sectionPrice,
      row: row?.name || row?.row || row?.rowName || "",
    };

    setSelectedSeats((previousSeats) => {
      // ============================================
      // ALREADY SELECTED → UNSELECT
      // ============================================

      const alreadySelected = previousSeats.some(
        (item) => item.id === selectedSeatData.id,
      );

      if (alreadySelected) {
        return previousSeats.filter((item) => item.id !== selectedSeatData.id);
      }

      // ============================================
      // LIMIT REACHED
      // REMOVE FIRST SELECTED SEAT
      // THEN ADD NEW SEAT
      // ============================================

      if (previousSeats.length >= seatCount) {
        return [...previousSeats.slice(1), selectedSeatData];
      }

      // ============================================
      // LIMIT NOT REACHED → NORMAL ADD
      // ============================================

      return [...previousSeats, selectedSeatData];
    });
  };

  // =====================================================
  // PAY
  // =====================================================

const handlePay = () => {
  if (selectedSeats.length !== seatCount) {
    return;
  }

  navigate("/booking-detail", {
    state: {
      movie,
      theater,
      date,
      time,

      theaterId,
      showTimeId,

      seatCount,
      selectedSeats,

      totalPrice,

      screen: selectedScreen,
    },
  });
};
  // =====================================================

  if (loading) {
    return (
      <main className="h-screen overflow-y-auto" style={backgroundStyle}>
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
      <main className="h-screen overflow-y-auto" style={backgroundStyle}>
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
      className="
        h-screen
        w-full
        overflow-y-scroll
        overflow-x-hidden
      "
      style={{
        ...backgroundStyle,

        // Scrollbar Screen.jsx ke andar hi
        scrollbarWidth: "thin",

        // Important for fixed pay bar
        position: "relative",
      }}
    >
      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <section
        className="
          min-h-full
          px-5
          pb-40
          pt-4
          sm:px-8
          md:px-12
        "
      >
        <div
          className="
            mx-auto
            max-w-5xl
          "
        >
          {/* =================================================
              BACK ARROW ONLY
          ================================================= */}

          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
    mb-1
    flex
    items-center
    text-4xl
    font-light
    leading-none
    text-[#1090DF]
    transition
    hover:opacity-70
    translate-y-11
    -translate-x-12

  "
          >
            ←
          </button>

          {/* =================================================
              TITLE
          ================================================= */}

          <h1
            className="
      text-4xl
      font-bold
      uppercase
      tracking-tight
      text-[#1090DF]
      sm:text-5xl
    "
          >
            Select Seat
          </h1>

          {/* =================================================
              PRICE DEBUG INFO
              Only console, UI unchanged
          ================================================= */}

          {showTimePrices.length === 0 && (
            <div className="mt-4 text-center text-xs text-red-400">
              Seat prices are not available for this show.
            </div>
          )}

          {/* =================================================
              SEAT LAYOUT
              NO BOX
          ================================================= */}

          <div
            className="
              mx-auto
              mt-10
              max-w-3xl
            "
          >
            {layout.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-500">No seat layout available.</p>
              </div>
            ) : (
              <div>
                {layout.map((section, sectionIndex) => {
                  const sectionName = "Premium";

                  // IMPORTANT:
                  // Price directly from showTime.price[]
                  const sectionPrice = getPriceFromShowTime(section);

                  const rows = getSectionRows(section);

                  return (
                    <div
                      key={`${sectionName}-${sectionIndex}`}
                      className="
                          mb-10
                          last:mb-0
                        "
                    >
                      {/* =================================================
                            SECTION NAME + PRICE
                        ================================================= */}

                      <div
                        className="
                            mb-5
                            border-b
                            border-gray-300
                            pb-2
                          "
                      >
                        <p
                          className="
                              text-sm
                              font-normal
                              text-gray-500
                            "
                        >
                          ₹{sectionPrice} {sectionName}
                        </p>
                      </div>

                      {/* =================================================
                            ROWS
                        ================================================= */}

                      <div
                        className="
                            flex
                            flex-col
                            items-center
                            gap-3
                          "
                      >
                        {rows.map((row) => {
                          const seats = getSeatsFromRow(row);

                          return (
                            <div
                              key={row.name}
                              className="
                                    flex
                                    flex-wrap
                                    justify-center
                                    gap-2
                                    sm:gap-3
                                  "
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
                                      handleSeatClick({
                                        seat,
                                        section,
                                        row,
                                      })
                                    }
                                    title={
                                      seat.available
                                        ? `${seat.label} - ₹${sectionPrice}`
                                        : `${seat.label} - Unavailable`
                                    }
                                    className={`
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-md
                                            border
                                            text-[10px]
                                            font-medium
                                            transition-all
                                            duration-150
                                            sm:h-10
                                            sm:w-10
                                            sm:text-xs

                                            ${
                                              !seat.available
                                                ? `
                                                  cursor-not-allowed
                                                  border-gray-200
                                                  bg-gray-100
                                                  text-gray-300
                                                `
                                                : isSelected
                                                  ? `
                                                    border-[#1090DF]
                                                    bg-[#1090DF]
                                                    text-white
                                                    shadow-md
                                                  `
                                                  : `
                                                    border-gray-300
                                                    bg-white/60
                                                    text-gray-600
                                                    hover:border-[#1090DF]
                                                    hover:bg-[#C2E8FF]
                                                    hover:text-[#1090DF]
                                                  `
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
                SCREEN
            ================================================= */}

            <div
              className="
                mt-12
                flex
                flex-col
                items-center
              "
            >
              <div
                className="
                  h-2
                  w-[75%]
                  rounded-full
                  bg-gray-400/70
                "
              />

              <p
                className="
                  mt-2
                  text-center
                  text-[10px]
                  uppercase
                  tracking-[0.4em]
                  text-gray-500
                "
              >
                Screen
              </p>
            </div>

            {/* =================================================
                LEGEND
            ================================================= */}

            <div
              className="
                mt-10
                flex
                flex-wrap
                items-center
                justify-center
                gap-6
                text-xs
                text-gray-500
              "
            >
              {/* AVAILABLE */}

              <div className="flex items-center gap-2">
                <span
                  className="
                    h-4
                    w-4
                    rounded
                    border
                    border-gray-300
                    bg-white/70
                  "
                />

                <span>Available</span>
              </div>

              {/* SELECTED */}

              <div className="flex items-center gap-2">
                <span
                  className="
                    h-4
                    w-4
                    rounded
                    bg-[#1090DF]
                  "
                />

                <span>Selected</span>
              </div>

              {/* UNAVAILABLE */}

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

                <span>Unavailable</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FIXED PAY BAR
      ===================================================== */}

      <div
        className="
          fixed
          bottom-0
          left-0
          right-0
          z-50
          border-t
          border-gray-300
          bg-white/90
          px-5
          py-5
          backdrop-blur-md
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-5xl
            items-center
            justify-center
          "
        >
          <button
            type="button"
            disabled={!canPay}
            onClick={handlePay}
            className={`
              w-full
              max-w-[250px]
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
                    bg-white
                    text-[#1090DF]
                    hover:bg-[#1090DF]
                    hover:text-white
                  `
                  : `
                    cursor-not-allowed
                    border-[#1090DF]
                    bg-white
                    text-[#1090DF]
                  `
              }
            `}
          >
            Pay ₹{totalPrice}
          </button>
        </div>
      </div>
    </main>
  );
};

export default Screen;
