import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./pages/home/Home";
import HotelList from "./pages/hotelList/HotelList";
import Hotel from "./pages/hotel/Hotel";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Admin from "./pages/admin/Admin";
import Reservations from "./pages/reservations/Reservations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hotels/:destination" element={<HotelList />} />
        <Route path="/hotel/:id" element={<Hotel />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element = {<Admin />}/>
        <Route path="/dashboard" element = {<Reservations />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;