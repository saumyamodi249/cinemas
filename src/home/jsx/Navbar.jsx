import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  // Home underline should stay active on
  // Home, Movie Details, Theater Details and Screen pages
  const isHomeActive =
    location.pathname === "/home" ||
    location.pathname.startsWith("/movie/") ||
    location.pathname.startsWith("/theaters/") ||
    location.pathname.startsWith("/screen/");

  return (
    <nav className="w-full h-17 from-white to-blue-200 flex items-center justify-between px-10">
      
      {/* Logo */}
      <Link to="/home">
        <img
          src="/cinemas.svg"
          alt="Cinemas"
          className="w-24"
        />
      </Link>

      {/* Navigation */}
      <div className="flex items-center gap-6 h-full">

        {/* Home */}
        <Link
          to="/home"
          className={`
            text-[#1090DF]
            h-full
            flex
            items-center
            relative
            ${
              isHomeActive
                ? "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-4 after:h-0.5 after:bg-[#1090DF]"
                : ""
            }
          `}
        >
          Home
        </Link>

        {/* My Ticket */}
        <NavLink
          to="/my-ticket"
          className={({ isActive }) =>
            `
              text-[#1090DF]
              h-full
              flex
              items-center
              relative
              ${
                isActive
                  ? "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-4 after:h-0.5 after:bg-[#1090DF]"
                  : ""
              }
            `
          }
        >
          My Ticket
        </NavLink>

      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-[#DC0000] text-white px-4 py-2 rounded-lg"
      >
        Logout
      </button>

    </nav>
  );
}

export default Navbar;