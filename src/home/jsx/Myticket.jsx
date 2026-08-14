import { useState } from "react";
import Navbar from "./Navbar";

const MyTicket = () => {
  const [activeTab, setActiveTab] = useState("upcoming");

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
      className="min-h-screen overflow-y-auto hide-scrollbar"
      style={{
        background: pageBackground,
      }}
    >
      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <section className="px-6 py-8">
        <div className="mx-auto max-w-7xl">
          {/* TABS */}
          <div className="flex items-center gap-5">
            {/* UPCOMING */}
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`
                rounded-md
                px-8
                py-2.5
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                  activeTab === "upcoming"
                    ? "bg-[#1090DF] text-white"
                    : "bg-white text-[#1090DF] hover:bg-[#C2E8FF]"
                }
              `}
            >
              Upcoming
            </button>

            {/* HISTORY */}
            <button
              type="button"
              onClick={() => setActiveTab("history")}
              className={`
                rounded-md
                
                px-8
                py-2.5
                text-sm
                font-medium
                transition-all
                duration-200
                ${
                  activeTab === "history"
                    ? "bg-[#1090DF] text-white"
                    : "bg-white text-[#1090DF] hover:bg-[#C2E8FF]"
                }
              `}
            >
              History
            </button>
          </div>

          {/* UPCOMING */}
          {activeTab === "upcoming" && (
            <div className="mt-8">
              <div className="rounded-xl bg-white/70 p-10 text-center">
                <p className="text-sm text-gray-500">No upcoming tickets.</p>
              </div>
            </div>
          )}

          {/* HISTORY */}
          {activeTab === "history" && (
            <div className="mt-8">
              <div className="rounded-xl bg-white/70 p-10 text-center">
                <p className="text-sm text-gray-500">No ticket history.</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default MyTicket;
