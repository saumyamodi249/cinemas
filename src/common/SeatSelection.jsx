import React, { useState } from "react";

const SeatSelection = ({ isOpen, onClose, onConfirm }) => {
  const [selectedSeats, setSelectedSeats] = useState(0);

  if (!isOpen) {
    return null;
  }

  const seats = Array.from(
    { length: 10 },
    (_, index) => index + 1
  );

  const handleSeatSelect = (seatNumber) => {
    // ONLY ONE SEAT CAN BE SELECTED
    setSelectedSeats(seatNumber);
  };

  const handleClose = () => {
    setSelectedSeats(0);
    onClose();
  };

  const handleConfirm = () => {
    if (selectedSeats < 1) {
      return;
    }

    onConfirm(selectedSeats);
    setSelectedSeats(0);
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[999]
        flex
        items-center
        justify-center
        bg-black/35
        px-4
        backdrop-blur-[1px]
      "
      onClick={handleClose}
    >
      {/* MODAL */}
      <div
        className="
          w-full
          max-w-[400px]
          rounded-2xl
          bg-white
          px-7
          py-7
          shadow-2xl
        "
        onClick={(event) => event.stopPropagation()}
      >
        {/* TITLE */}
        <h2
          className="
            text-center
            text-2xl
            font-bold
          "
          style={{ color: "#1090DF" }}
        >
          How many seats?
        </h2>

        {/* SEAT NUMBERS */}
        <div
          className="
            mx-auto
            mt-8
            grid
            max-w-[300px]
            grid-cols-5
            justify-items-center
            gap-4
          "
        >
          {seats.map((seatNumber) => {
            const isSelected =
              selectedSeats === seatNumber;

            return (
              <button
                key={seatNumber}
                type="button"
                onClick={() =>
                  handleSeatSelect(seatNumber)
                }
                className={`
                  flex
                  h-[48px]
                  w-[48px]
                  items-center
                  justify-center
                  rounded-md
                  border
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    isSelected
                      ? `
                        border-[#1090DF]
                        bg-[#1090DF]
                        text-white
                        shadow-md
                      `
                      : `
                        border-gray-300
                        bg-white
                        text-gray-700
                        hover:border-[#1090DF]
                        hover:bg-[#C2E8FF]
                        hover:text-[#1090DF]
                      `
                  }
                `}
              >
                {seatNumber}
              </button>
            );
          })}
        </div>

        {/* BUTTONS */}
        <div
          className="
            mt-8
            flex
            items-center
            justify-center
            gap-3
          "
        >
          {/* CANCEL */}
          <button
            type="button"
            onClick={handleClose}
            className="
              min-w-[125px]
              rounded-md
              border
              border-gray-300
              bg-white
              px-5
              py-2.5
              text-sm
              font-medium
              text-gray-500
              transition
              hover:bg-gray-100
            "
          >
            Cancel
          </button>

          {/* SELECT SEAT */}
          <button
            type="button"
            disabled={selectedSeats < 1}
            onClick={handleConfirm}
            className={`
              min-w-[125px]
              rounded-md
              border
              px-5
              py-2.5
              text-sm
              font-medium
              transition

              ${
                selectedSeats >= 1
                  ? `
                    border-[#1090DF]
                    bg-white
                    text-[#1090DF]
                    hover:bg-[#1090DF]
                    hover:text-white
                  `
                  : `
                    cursor-not-allowed
                    border-gray-300
                    bg-gray-100
                    text-gray-400
                  `
              }
            `}
          >
            Select seat
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;