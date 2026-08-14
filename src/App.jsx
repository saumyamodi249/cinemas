import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";

import Home from "./home/jsx/Home.jsx";
import MyTicket from "./home/jsx/MyTIcket.jsx";
import MovieDetails from "./home/jsx/MovieDetails.jsx";
import Theater from "./home/jsx/Theater.jsx";
import TheaterDetails from "./home/jsx/TheaterDetails.jsx";

import Screen from "./screen/Screen.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/home" element={<Home />} />
        <Route path="/my-ticket" element={<MyTicket />} />

        <Route path="/movie/:id" element={<MovieDetails />} />

        <Route path="/theaters" element={<Theater />} />
        <Route path="/theaters/:id" element={<TheaterDetails />} />

        <Route path="/screen/:theaterId" element={<Screen />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;