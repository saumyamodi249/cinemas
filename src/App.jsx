import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";

import Home from "./home/jsx/Home.jsx";
import MyTicket from "./home/jsx/MyTicket.jsx";
import MovieDetails from "./home/jsx/MovieDetails.jsx";
import Theater from "./home/jsx/Theater.jsx";
import TheaterDetails from "./home/jsx/TheaterDetails.jsx";

import Screen from "./screen/Screen.jsx";

import PaymentSuccess from "./common/PaymentSuccess.jsx";
import BookingDetail from "./common/BookingDetail.jsx";
import ProtectedRoute from "./common/ProtectedRoute.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* AUTH (PUBLIC) */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* PROTECTED ROUTES */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/my-ticket" element={<MyTicket />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/theaters" element={<Theater />} />
          <Route path="/theaters/:id" element={<TheaterDetails />} />
          <Route path="/screen/:screenId" element={<Screen />} />
          <Route path="/booking-detail" element={<BookingDetail />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;