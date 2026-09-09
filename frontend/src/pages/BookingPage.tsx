import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Dialog,
  DialogContent,
  IconButton,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import { BarberSelector } from "../features/barbers/components/BarberSelector";
import { DateTimeSelector } from "../features/bookings/components/DateTimeSelector";
import { BookingForm } from "../features/bookings/components/BookingForm";
import { BookingSuccessView } from "../features/bookings/components/BookingSuccessView";
import { MyBookings } from "../features/bookings/components/MyBookings";
import { bookingsApi } from "../features/bookings/services/bookingApi";
import { useBarbers } from "../features/barbers/hooks/useBarber";
import type { Barber } from "../features/barbers/types/barber.types";
import type { TimeSlot } from "../features/bookings/types/booking.types";
import axios from "axios";

export const BookingPage = () => {
  const [activeTab, setActiveTab] = useState(0);
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

  useEffect(() => {
    if (isSuccess) {
      const dialogScrollContainers = document.querySelectorAll(
        ".MuiDialog-container, .MuiDialog-paper, .MuiDialogContent-root",
      );
      dialogScrollContainers.forEach((container) => {
        container.scrollTo({ top: 0, behavior: "smooth" });
        container.scrollTop = 0;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [isSuccess]);

  const handleTabChange = (_e: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    handleClosePopup();
  };

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
          err instanceof Error ? err.message : "Sikertelen foglalás.",
        );
      }
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
          borderBottom: 1,
          borderColor: "#E8E2D5",
          mb: 4,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="inherit"
          slotProps={{ indicator: { sx: { bgcolor: "#3D2314", height: 3 } } }}
          sx={{
            "& .MuiTab-root": {
              fontFamily: "serif",
              fontWeight: "bold",
              fontSize: "1.05rem",
              color: "#8C6D58",
              textTransform: "none",
              px: 4,
              py: 2,
              "&.Mui-selected": { color: "#3D2314" },
            },
          }}
        >
          <Tab
            icon={<CalendarMonthIcon sx={{ mr: 1 }} />}
            iconPosition="start"
            label="Új Időpont Foglalása"
          />
          <Tab
            icon={<ContentPasteSearchIcon sx={{ mr: 1 }} />}
            iconPosition="start"
            label="Foglalásaim Kezelése"
          />
        </Tabs>
      </Box>

      <Box
        sx={{
          backgroundColor: "#FDFBF7",
          p: { xs: 2, md: 4 },
          borderRadius: "24px",
          border: "1px solid #E8E2D5",
        }}
      >
        {activeTab === 0 && (
          <BarberSelector
            barbers={barbers as Barber[]}
            selectedBarberId={selectedBarberId}
            onSelectBarber={handleSelectBarber}
          />
        )}

        {activeTab === 1 && <MyBookings barbers={barbers as Barber[]} />}

        <Dialog
          open={Boolean(activeTab === 0 && selectedBarberId && selectedBarber)}
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
                <Box ref={successRef}>
                  <BookingSuccessView
                    barberName={selectedBarber.name}
                    selectedDate={selectedDate}
                    selectedSlot={selectedSlot!}
                    savedEmail={savedEmail}
                    onClose={handleClosePopup}
                  />
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
