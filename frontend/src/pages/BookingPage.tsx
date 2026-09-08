import { useState } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { BarberSelector } from "../features/barbers/components/BarberSelector";
import { DateTimeSelector } from "../features/bookings/components/DateTimeSelector";
import { BookingForm } from "../features/bookings/components/BookingForm";
import { useBarbers } from "../features/barbers/hooks/useBarber";
import type { Barber } from "../features/barbers/types/barber.types";
import type { TimeSlot } from "../features/bookings/types/booking.types";

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

  const { barbers, isLoading, error } = useBarbers();

  const handleSelectBarber = (barber: Barber) => {
    setSelectedBarberId(barber.id);
    setSelectedSlot(null);
  };

  const handleClosePopup = () => {
    setSelectedBarberId(undefined);
    setSelectedSlot(null);
    setSubmitError(null);
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
      console.log("Küldés a backendre:", {
        barberId: selectedBarberId,
        customerEmail: email,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      });
    } catch (err: unknown) {
      setSubmitError(
        err instanceof Error ? err?.message : "Sikertelen foglalás.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedBarber = (barbers as Barber[]).find(
    (b) => b.id === selectedBarberId,
  );

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
              "& .MuiSvgIcon-root": { color: "#3D2314" },
              "&:hover": { bgcolor: "#f1ede2" },
              zIndex: 1,
            }}
          >
            <CloseIcon />
          </IconButton>

          <DialogContent sx={{ pt: 4 }}>
            {selectedBarber && (
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
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </Container>
  );
};
