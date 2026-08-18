    import React, { useMemo } from "react";
    import { useLocation, useNavigate } from "react-router-dom";

    const BookingDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // =====================================================
    // BOOKING DATA
    // =====================================================

    const bookingState = location.state || {};

    const movie = bookingState.movie || null;
    const theater = bookingState.theater || null;

    const date = bookingState.date || null;
    const time = bookingState.time || null;

    const seatCount =
        Number(bookingState.seatCount) ||
        Number(bookingState.selectedSeats?.length) ||
        0;

    const selectedSeats = Array.isArray(bookingState.selectedSeats)
        ? bookingState.selectedSeats
        : [];

    // =====================================================
    // MOVIE TITLE
    // =====================================================

    const movieTitle =
        movie?.name ||
        movie?.title ||
        bookingState.movieTitle ||
        "Movie";

    // =====================================================
    // DATE
    // =====================================================

    const formattedDate = useMemo(() => {
        if (!date) {
        return "-";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
        return date;
        }

        return parsedDate.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
        });
    }, [date]);

    // =====================================================
    // SHOW TIME
    // =====================================================

    const showTime = useMemo(() => {
    const rawTime =
        time ||
        bookingState.showTime?.time ||
        bookingState.showTime?.startTime ||
        bookingState.show?.time ||
        "";

    if (!rawTime) {
        return "-";
    }

    // Agar already simple time hai, jaise "18:30"
    if (/^\d{1,2}:\d{2}/.test(String(rawTime))) {
        return String(rawTime).slice(0, 5);
    }

    // Agar ISO date-time hai
    const parsedTime = new Date(rawTime);

    if (Number.isNaN(parsedTime.getTime())) {
        return String(rawTime);
    }

    return parsedTime.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });
    }, [time, bookingState.showTime, bookingState.show]);

    // =====================================================
    // SEAT NAMES
    // =====================================================

    const seatNames = selectedSeats
        .map((seat) => {
        return (
            seat?.label ||
            seat?.name ||
            `${seat?.row || ""}${seat?.number || seat?.column || ""}`
        );
        })
        .filter(Boolean);

    // =====================================================
    // SUBTOTAL
    // =====================================================

    const subtotal = useMemo(() => {
        return selectedSeats.reduce((total, seat) => {
        return total + Number(seat?.price || seat?.sectionPrice || 0);
        }, 0);
    }, [selectedSeats]);

    // =====================================================
    // SERVICE CHARGE
    // =====================================================
    const serviceCharge = 50;
    // =====================================================
    // TOTAL
    // =====================================================

    const totalPayment = subtotal + serviceCharge;

    // =====================================================
    // PROCEED TO PAYMENT
    // =====================================================

    const handleProceed = () => {
        navigate("/payment-success", {
        state: {
            ...bookingState,

            movie,
            theater,
            date,
            time,

            seatCount,
            selectedSeats,

            subtotal,
            serviceCharge,
            totalPayment,
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
    // PAGE
    // =====================================================

    return (
        <main
        className="
            min-h-screen
            w-full
            overflow-y-auto
        "
        style={{
            background: pageBackground,
        }}
        >
        <div
            className="
            flex
            min-h-screen
            items-center
            justify-center
            px-5
            py-10
            "
        >
            <div
            className="
                w-full
                max-w-[324px]
                overflow-hidden
                rounded-md
                border
                border-[#1090DF]
                bg-white/40
            "
            >
            {/* =================================================
                TOP SECTION
            ================================================= */}

            <div className="px-6 pb-8 pt-5">

                {/* TITLE */}

                <h1
                className="
                    mb-5
                    text-[27px]
                    font-bold
                    leading-tight
                    text-[#1090DF]
                "
                >
                Booking Detail
                </h1>

                {/* MOVIE TITLE */}

                <div className="mb-4">
                <p className="text-[13px] text-gray-500">
                    Movie Title
                </p>

                <p
                    className="
                    mt-1
                    text-[16px]
                    font-medium
                    uppercase
                    text-gray-400
                    "
                >
                    {movieTitle}
                </p>
                </div>

                {/* DATE */}

                <div className="mb-4">
                <p className="text-[13px] text-gray-500">
                    Date
                </p>

                <p
                    className="
                    mt-1
                    text-[16px]
                    font-medium
                    text-gray-400
                    "
                >
                    {formattedDate}
                </p>
                </div>

                {/* TICKET + TIME */}

                <div className="flex justify-between gap-5">

                {/* TICKET */}

                <div className="min-w-0">
                    <p className="text-[13px] text-gray-500">
                    Ticket ({seatCount})
                    </p>

                    <p
                    className="
                        mt-1
                        truncate
                        text-[16px]
                        font-medium
                        text-gray-400
                    "
                    >
                    {seatNames.length > 0
                        ? seatNames.join(", ")
                        : "-"}
                    </p>
                </div>

                {/* TIME */}

                <div className="shrink-0">
                    <p className="text-[13px] text-gray-500">
                    Hours
                    </p>

                    <p
                    className="
                        mt-1
                        text-[16px]
                        font-medium
                        text-gray-400
                    "
                    >
                    {showTime}
                    </p>
                </div>
                </div>
            </div>

            {/* =================================================
                CUT / DIVIDER
            ================================================= */}
<div
  className="
    relative
    w-full
    max-w-[324px]
    overflow-hidden
    rounded-md
    bg-white/40
  "
>
  {/* TOP BORDER */}

  {/* BOTTOM BORDER */}

  {/* LEFT STRAIGHT - TOP */}
  <div
    className="
      absolute
      left-0
      top-0
      bottom-[50%]
      w-px
      bg-[#1090DF]
    "
  />

  {/* LEFT STRAIGHT - BOTTOM */}
  <div
    className="
      absolute
      bottom-0
      left-0
      top-[50%]
      w-px
      bg-[#1090DF]
    "
  />

  {/* RIGHT STRAIGHT - TOP */}
  <div
    className="
      absolute
      right-0
      top-0
      bottom-[50%]
      w-px
      bg-[#1090DF]
    "
  />

  {/* RIGHT STRAIGHT - BOTTOM */}
  <div
    className="
      absolute
      bottom-0
      right-0
      top-[50%]
      w-px
      bg-[#1090DF]
    "
  />

  {/* LEFT CURVE */}
  <div
    className="
      absolute
      left-0
      top-1/2
      h-[20px]
      w-[20px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      border
      border-[#1090DF]
      bg-white
    "
  />

  {/* RIGHT CURVE */}
  <div
    className="
      absolute
      right-0
      top-1/2
      h-[20px]
      w-[20px]
      translate-x-1/2
      -translate-y-1/2
      rounded-full
      border
      border-[#1090DF]
      bg-white
    "
  />

  {/* 👇 YAHAN TUMHARA EXISTING CONTENT START HOGA */}

  <div className="px-6 pb-8 pt-5">
    {/* Booking Detail + Movie + Date + Ticket... */}
  </div>

  {/* Tumhara existing CUT / DIVIDER section */}
  
  {/* Transaction Detail */}
  
  {/* Buttons */}

</div>
            {/* =================================================
                TRANSACTION DETAIL
            ================================================= */}

            <div className="px-6 pb-5 pt-4">

                <p
                className="
                    mb-2
                    text-[13px]
                    font-medium
                    text-[#1090DF]
                "
                >
                Transaction Detail
                </p>

                {/* SEAT PRICE */}

                <div
                className="
                    flex
                    items-center
                    justify-between
                    text-[12px]
                    text-gray-500
                "
                >
                <span>
                    {seatNames.length > 0
                    ? `${seatNames[0]} Seat`
                    : "Seat"}{" "}
                    (₹{seatCount > 0 ? Math.round(subtotal / seatCount) : 0} x{" "}
                    {seatCount})
                </span>

                <span className="text-gray-700">
                    ₹{subtotal}
                </span>
                </div>

                {/* SERVICE CHARGE */}

                <div
                className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    text-[12px]
                    text-gray-500
                "
                >
                <span>
                    Service Charge (6%)
                </span>

                <span className="text-gray-700">
                    ₹{serviceCharge}
                </span>
                </div>

                {/* LINE */}

                <div className="my-2 border-t border-gray-300" />

                {/* TOTAL */}

                <div
                className="
                    flex
                    items-center
                    justify-between
                    text-[13px]
                    font-medium
                    text-gray-600
                "
                >
                <span>Total payment</span>

                <span>
                    ₹{totalPayment}
                </span>
                </div>
            </div>

            {/* =================================================
                BOTTOM
            ================================================= */}

            <div className="px-6 pb-4">

                <p
                className="
                    mb-4
                    text-[9px]
                    text-gray-300
                "
                >
                *Purchased ticket cannot be canceled
                </p>

                {/* PROCEED */}

                <button
                type="button"
                onClick={handleProceed}
                className="
                    mb-3
                    h-[41px]
                    w-full
                    rounded-[5px]
                    border
                    border-[#1090DF]
                    bg-white
                    text-[13px]
                    font-medium
                    text-[#1090DF]
                    transition
                    duration-200
                    hover:bg-[#1090DF]
                    hover:text-white
                "
                >
                Total Pay ₹{totalPayment} Proceed
                </button>

                {/* CANCEL */}

                <button
                type="button"
                onClick={() => navigate(-1)}
                className="
                    h-[41px]
                    w-full
                    rounded-[5px]
                    border
                    border-gray-300
                    bg-white/60
                    text-[13px]
                    font-medium
                    text-gray-400
                    transition
                    duration-200
                    hover:border-[#1090DF]
                    hover:text-[#1090DF]
                "
                >
                Cancel
                </button>
            </div>
            </div>
        </div>
        </main>
    );
    };

    export default BookingDetail;