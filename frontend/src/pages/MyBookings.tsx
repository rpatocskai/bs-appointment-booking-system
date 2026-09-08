import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";
import type { Barber } from "../features/barbers/types/barber.types";
import { bookingsApi } from "../features/bookings/services/bookingApi";
import type { UserBooking } from "../features/bookings/types/booking.types";

interface MyBookingsProps {
  barbers: Barber[];
}

export const MyBookings = ({ barbers }: MyBookingsProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<UserBooking | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError("Az e-mail cím megadása kötelező");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setEmailError("Érvénytelen e-mail cím formátum");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleFetchBookings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail(email)) return;

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

  const getBarberName = (barberId: string): string => {
    const barber = barbers.find((b) => b.id === barberId);
    return barber ? barber.name : "Ismeretlen Borbély";
  };

  const formatDateTime = (isoString: string): string => {
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = d.toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} ${timeStr}`;
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

      <Card
        sx={{
          bgcolor: "#f7f4eb",
          border: "1px solid #e1dacb",
          borderRadius: 2,
          boxShadow: "none",
          mb: 4,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            component="form"
            onSubmit={handleFetchBookings}
            noValidate
            sx={{
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "flex-start",
            }}
          >
            <TextField
              fullWidth
              placeholder="pelda@email.hu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              error={Boolean(emailError)}
              helperText={emailError}
              disabled={loading}
              slotProps={{
                input: {
                  startAdornment: (
                    <EmailIcon sx={{ color: "#8c6d58", mr: 1 }} />
                  ),
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#ffffff",
                  "& fieldset": { borderColor: "#e1dacb" },
                  "&:hover fieldset": { borderColor: "#2b1c11" },
                  "&.Mui-focused fieldset": { borderColor: "#2b1c11" },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                py: 2,
                px: 4,
                borderRadius: 1.5,
                fontWeight: "bold",
                textTransform: "uppercase",
                bgcolor: "#2b1c11",
                color: "#ffffff",
                whiteSpace: "nowrap",
                width: { xs: "100%", sm: "auto" },
                "&:hover": { bgcolor: "#1c120b" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#ffffff" }} />
              ) : (
                "Keresés"
              )}
            </Button>
          </Box>
        </CardContent>
      </Card>

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
        <TableContainer
          component={Paper}
          sx={{
            bgcolor: "#FDFBF7",
            boxShadow: "none",
            border: "1px solid #E8E2D5",
            borderRadius: 2,
          }}
        >
          <Table>
            <TableHead sx={{ bgcolor: "#f1ede2" }}>
              <TableRow>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#3D2314",
                    fontFamily: "serif",
                  }}
                >
                  Borbély
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#3D2314",
                    fontFamily: "serif",
                  }}
                >
                  Kezdés időpontja
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    color: "#3D2314",
                    fontFamily: "serif",
                  }}
                >
                  Befejezés időpontja
                </TableCell>
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: "bold",
                    color: "#3D2314",
                    fontFamily: "serif",
                  }}
                >
                  Művelet
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  sx={{ "&:hover": { bgcolor: "#f7f4eb" } }}
                >
                  <TableCell sx={{ color: "#2b1c11", fontWeight: 500 }}>
                    {getBarberName(booking.barberId)}
                  </TableCell>
                  <TableCell sx={{ color: "#2b1c11" }}>
                    {formatDateTime(booking.startTime)}
                  </TableCell>
                  <TableCell sx={{ color: "#2b1c11" }}>
                    {formatDateTime(booking.endTime)}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => openDeleteConfirmation(booking)}
                      sx={{
                        textTransform: "none",
                        borderRadius: 1.5,
                        fontWeight: "bold",
                        borderColor: "#cbd5e1",
                        color: "#9b1c1c",
                        "&:hover": {
                          bgcolor: "#fdf2f2",
                          borderColor: "#9b1c1c",
                        },
                      }}
                    >
                      Lemondás
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
