import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { BookingPage } from "./pages/BookingPage";

// TODO temp
const MyBookingsPage = () => (
  <div style={{ padding: 20 }}>Saját foglalásaim oldal</div>
);

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/booking" replace />} />

        <Route path="/booking" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookingsPage />} />

        <Route
          path="*"
          element={<div style={{ padding: 20 }}>Az oldal nem található!</div>}
        />
      </Routes>
    </BrowserRouter>
  );
};
