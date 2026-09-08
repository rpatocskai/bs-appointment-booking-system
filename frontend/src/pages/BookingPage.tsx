import { useState, useRef, useEffect } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { BarberSelector } from "../features/barbers/components/BarberSelector";
import { DateTimeSelector } from "../features/bookings/components/DateTimeSelector";
import { BookingForm } from "../features/bookings/components/BookingForm";
import { bookingsApi } from "../features/bookings/services/bookingApi";
import { useBarbers } from "../features/barbers/hooks/useBarber";
import type { Barber } from "../features/barbers/types/barber.types";
import type { TimeSlot } from "../features/bookings/types/booking.types";
import axios from "axios";

export const BookingPage = () => {
  const [selectedBarberId, setSelectedBarberId] = useState<string | undefined>(
    undefined,
  );
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isSuccess, setIsSuccess] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  const successRef = useRef<HTMLDivElement>(null);

  const { barbers, isLoading, error } = useBarbers();

  // Agresszív és golyóálló felgördülés a siker-képernyő tetejére
  useEffect(() => {
    if (isSuccess) {
      // 1. Megkeressük a Dialog összes létező belső konténerét és felpörgetjük őket
      const dialogScrollContainers = document.querySelectorAll(
        ".MuiDialog-container, .MuiDialog-paper, .MuiDialogContent-root",
      );

      dialogScrollContainers.forEach((container) => {
        container.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        container.scrollTop = 0; // Biztonsági fallback
      });

      // 2. Felküldjük a teljes külső HTML dokumentumot és ablakot is
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      if (document.body) {
        document.body.scrollTop = 0;
      }
    }
  }, [isSuccess]);

  const handleSelectBarber = (barber: Barber) => {
    setSelectedBarberId(barber.id);
    setSelectedSlot(null);
    setIsSuccess(false);
  };

  const handleClosePopup = () => {
    setSelectedBarberId(undefined);
    setSelectedSlot(null);
    setSubmitError(null);
    setIsSuccess(false);
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookingSubmit = async (email: string) => {
    if (!selectedBarberId || !selectedSlot) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await bookingsApi.createBooking({
        barberId: selectedBarberId,
        customerEmail: email,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });

      setSavedEmail(email);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else {
        setSubmitError(
          err instanceof Error
            ? err.message
            : "Sikertelen foglalás. Az időpont időközben betelt.",
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBarber = (barbers as Barber[]).find(
    (b) => b.id === selectedBarberId,
  );

  const formatTime = (isoString: string): string => {
    return new Date(isoString).toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress sx={{ color: "#3D2314" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 5, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          backgroundColor: "#FDFBF7",
          p: { xs: 2, md: 4 },
          borderRadius: "24px",
          border: "1px solid #E8E2D5",
        }}
      >
        <BarberSelector
          barbers={barbers as Barber[]}
          selectedBarberId={selectedBarberId}
          onSelectBarber={handleSelectBarber}
        />

        <Dialog
          open={Boolean(selectedBarberId && selectedBarber)}
          onClose={handleClosePopup}
          maxWidth="md"
          fullWidth
          scroll="body"
          slotProps={{
            paper: {
              sx: {
                bgcolor: "#FDFBF7",
                borderRadius: 3,
                border: "1px solid #E8E2D5",
                p: 2,
                position: "relative",
              },
            },
          }}
        >
          <IconButton
            onClick={handleClosePopup}
            sx={{
              position: "absolute",
              right: 16,
              top: 16,
              color: "#3D2314",
              "&:hover": { bgcolor: "#f1ede2" },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent sx={{ pt: 4 }}>
            {selectedBarber &&
              (isSuccess ? (
                <Box
                  ref={successRef}
                  sx={{
                    textAlign: "center",
                    py: 5,
                    px: 2,
                    mx: "auto",
                    maxWidth: 500,
                  }}
                >
                  <CheckCircleIcon
                    sx={{ fontSize: "5rem", color: "#2e7d32", mb: 2 }}
                  />
                  <Typography
                    variant="h4"
                    sx={{
                      fontFamily: "serif",
                      fontWeight: "bold",
                      color: "#2b1c11",
                      mb: 2,
                    }}
                  >
                    SIKERES FOGLALÁS!
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#6d5c50", mb: 4 }}>
                    Időpontodat sikeresen rögzítettük{" "}
                    <strong>{selectedBarber.name}</strong> naptárában.
                  </Typography>

                  <Box
                    sx={{
                      bgcolor: "#f1ede2",
                      p: 3,
                      borderRadius: 2,
                      mb: 4,
                      textAlign: "left",
                      border: "1px solid #e1dacb",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "#2b1c11" }}
                    >
                      <strong>Dátum:</strong> {selectedDate}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ mb: 1, color: "#2b1c11" }}
                    >
                      <strong>Időpont:</strong>{" "}
                      {formatTime(selectedSlot!.startTime)} –{" "}
                      {formatTime(selectedSlot!.endTime)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#2b1c11" }}>
                      <strong>Visszaigazolás küldve:</strong> {savedEmail}
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    onClick={handleClosePopup}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 1.5,
                      fontWeight: "bold",
                      bgcolor: "#2b1c11",
                      color: "#ffffff",
                      "&:hover": { bgcolor: "#1c120b" },
                    }}
                  >
                    Bezárás
                  </Button>
                </Box>
              ) : (
                <>
                  <DateTimeSelector
                    selectedBarberId={selectedBarber.id}
                    selectedBarberName={selectedBarber.name}
                    selectedDate={selectedDate}
                    onDateChange={handleDateChange}
                    selectedSlot={selectedSlot}
                    onSlotSelect={handleSlotSelect}
                  />

                  {selectedSlot && (
                    <Box sx={{ mt: 2 }}>
                      <Divider sx={{ my: 4, borderColor: "#E8E2D5" }} />
                      <BookingForm
                        barberName={selectedBarber.name}
                        selectedDate={selectedDate}
                        selectedSlot={selectedSlot}
                        onSubmit={handleBookingSubmit}
                        isSubmitting={isSubmitting}
                        submitError={submitError}
                      />
                    </Box>
                  )}
                </>
              ))}
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};
