import { useState } from "react";
import {
  Box,
  Typography,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import axios from "axios";
import type { Barber } from "../features/barbers/types/barber.types";
import { MyBookingsSearchForm } from "../features/bookings/components/MyBookingsSearchForm";
import { MyBookingsTable } from "../features/bookings/components/MyBookingsTable";
import { bookingsApi } from "../features/bookings/services/bookingApi";
import type { UserBooking } from "../features/bookings/types/booking.types";

interface MyBookingsProps {
  barbers: Barber[];
}

export const MyBookings = ({ barbers }: MyBookingsProps) => {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<UserBooking | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const handleFetchBookings = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const data = await bookingsApi.getBookingsByEmail(email);
      setBookings(data);
      if (data.length === 0) {
        setError("Nem találtunk aktív foglalást ehhez az e-mail címhez.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Hiba történt a foglalások lekérése közben.");
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteConfirmation = (booking: UserBooking) => {
    setBookingToDelete(booking);
    setDeleteDialogOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setBookingToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleCancelBooking = async () => {
    if (!bookingToDelete) return;

    setDeleting(true);
    setError(null);
    try {
      await bookingsApi.deleteBooking(bookingToDelete.id);
      setBookings((prev) => prev.filter((b) => b.id !== bookingToDelete.id));
      setSuccessMessage("Időpontodat sikeresen lemondtad.");
      closeDeleteConfirmation();
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Nem sikerült lemondani az időpontot.");
      }
      closeDeleteConfirmation();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Box sx={{ py: 3, mx: "auto", maxWidth: 850 }}>
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontFamily: "serif",
            fontWeight: "bold",
            color: "#3D2314",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          FOGLALÁSAIM KEZELÉSE
        </Typography>
        <Typography variant="body1" sx={{ color: "#8C6D58", mt: 1 }}>
          Add meg az e-mail címedet az aktív foglalásaid megtekintéséhez vagy
          lemondásához.
        </Typography>
      </Box>

      <MyBookingsSearchForm onSearch={handleFetchBookings} loading={loading} />

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            bgcolor: "#fdf2f2",
            color: "#9b1c1c",
            border: "1px solid #fbd5d5",
          }}
        >
          {error}
        </Alert>
      )}
      {successMessage && (
        <Alert
          severity="success"
          sx={{
            mb: 3,
            bgcolor: "#f3faf7",
            color: "#1e4620",
            border: "1px solid #def7ec",
          }}
        >
          {successMessage}
        </Alert>
      )}

      {bookings.length > 0 && (
        <MyBookingsTable
          bookings={bookings}
          barbers={barbers}
          onDeleteClick={openDeleteConfirmation}
        />
      )}

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteConfirmation}
        slotProps={{
          paper: {
            sx: {
              bgcolor: "#FDFBF7",
              borderRadius: 2,
              border: "1px solid #E8E2D5",
              p: 1,
            },
          },
        }}
      >
        <DialogTitle
          sx={{ fontFamily: "serif", fontWeight: "bold", color: "#3D2314" }}
        >
          Időpont lemondása
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#6d5c50" }}>
            Biztosan szeretnéd lemondani ezt az időpontot? Ez a művelet nem
            vonható vissza.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={closeDeleteConfirmation}
            disabled={deleting}
            sx={{ color: "#6d5c50", fontWeight: "bold", textTransform: "none" }}
          >
            Mégse
          </Button>
          <Button
            onClick={handleCancelBooking}
            disabled={deleting}
            variant="contained"
            color="error"
            sx={{
              borderRadius: 1.5,
              fontWeight: "bold",
              textTransform: "none",
              bgcolor: "#9b1c1c",
              "&:hover": { bgcolor: "#771515" },
            }}
          >
            {deleting ? "Törlés..." : "Igen, lemondom"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
