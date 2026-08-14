import React from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

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

  return (
    <main
      className="
        min-h-screen
        w-full
        overflow-hidden
        hide-scrollbar
      "
      style={{
        background: pageBackground,
      }}
    >
      <div
        className="
          flex
          min-h-screen
          flex-col
          items-center
          justify-center
          px-6
        "
      >
        {/* PAYMENT SUCCESSFUL */}

        <h1
          className="
            mb-8
            text-center
            text-[26px]
            font-bold
            leading-tight
            text-[#111111]
          "
        >
          Payment Successful
        </h1>

        {/* SUCCESS ICON */}

        <div
          className="
            mb-7
            flex
            h-[116px]
            w-[116px]
            items-center
            justify-center
            rounded-full
            bg-green-200
          "
        >
          <div
            className="
              flex
              h-[84px]
              w-[84px]
              items-center
              justify-center
              rounded-full
              bg-[#20F238]
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-[52px] w-[52px]"
            >
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          </div>
        </div>

        {/* BUTTONS */}

        <div
          className="
            flex
            w-[274px]
            flex-col
            gap-[14px]
          "
        >
          {/* VIEW TICKET */}

          <button
            type="button"
            onClick={() => navigate("/my-ticket")}
            className="
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
            View Ticket
          </button>

          {/* BACK TO HOMEPAGE */}

          <button
            type="button"
            onClick={() => navigate("/home")}
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
            Back to Homepage
          </button>
        </div>
      </div>
    </main>
  );
};

export default PaymentSuccess;