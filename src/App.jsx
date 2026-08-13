import { BrowserRouter, Routes, Route } from "react-router-dom";

import Signup from "./auth/Signup.jsx";
import Login from "./auth/Login.jsx";

import Home from "./home/jsx/Home";
import MyTicket from "./home/jsx/MyTIcket";
import MovieDetails from "./home/jsx/MovieDetails";
import Theater from "./home/jsx/Theater";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Main */}
        <Route path="/home" element={<Home />} />
        <Route path="/my-ticket" element={<MyTicket />} />

        {/* Movie Details */}
        <Route path="/movie/:id" element={<MovieDetails />} />
        
        {/* Theater */}
        <Route path="/theaters" element={<Theater />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
