import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";

import Home from "./home/jsx/Home.jsx";
import MyTicket from "./home/jsx/MyTIcket.jsx";
import MovieDetails from "./home/jsx/MovieDetails.jsx";
import Theater from "./home/jsx/Theater.jsx";
import TheaterDetails from "./home/jsx/TheaterDetails.jsx";

import Screen from "./screen/Screen.jsx";

import PaymentSuccess from "./common/PaymentSuccess.jsx";
import BookingDetail from "./common/BookingDetail.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* HOME */}
        <Route path="/home" element={<Home />} />
        <Route path="/my-ticket" element={<MyTicket />} />

        {/* MOVIE */}
        <Route path="/movie/:id" element={<MovieDetails />} />

        {/* THEATER */}
        <Route path="/theaters" element={<Theater />} />
        <Route path="/theaters/:id" element={<TheaterDetails />} />

        {/* SEAT SELECTION */}
        <Route
          path="/screen/:screenId"
          element={<Screen />}
        />

        {/* BOOKING DETAIL */}
        <Route
          path="/booking-detail"
          element={<BookingDetail />}
        />

        {/* PAYMENT SUCCESS */}
        <Route
          path="/payment-success"
          element={<PaymentSuccess />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;