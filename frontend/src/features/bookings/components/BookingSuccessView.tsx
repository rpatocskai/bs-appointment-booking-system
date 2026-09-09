import { Box, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Button } from "../../../components/ui/button/Button"; // <-- A TE SAJÁT GOMBI IMPORTOD!
import type { TimeSlot } from "../types/booking.types";

interface BookingSuccessViewProps {
  barberName: string;
  selectedDate: string;
  selectedSlot: TimeSlot;
  savedEmail: string;
  onClose: () => void;
}

export const BookingSuccessView = ({
  barberName,
  selectedDate,
  selectedSlot,
  savedEmail,
  onClose,
}: BookingSuccessViewProps) => {
  const formatTime = (isoString: string): string => {
    return new Date(isoString).toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box sx={{ textAlign: "center", py: 5, px: 2, mx: "auto", maxWidth: 500 }}>
      <CheckCircleIcon sx={{ fontSize: "5rem", color: "#2e7d32", mb: 2 }} />

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
        Időpontodat sikeresen rögzítettük <strong>{barberName}</strong>{" "}
        naptárában.
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
        <Typography variant="body2" sx={{ mb: 1, color: "#2b1c11" }}>
          <strong>Dátum:</strong> {selectedDate}
        </Typography>
        <Typography variant="body2" sx={{ mb: 1, color: "#2b1c11" }}>
          <strong>Időpont:</strong> {formatTime(selectedSlot.startTime)} –{" "}
          {formatTime(selectedSlot.endTime)}
        </Typography>
        <Typography variant="body2" sx={{ color: "#2b1c11" }}>
          <strong>Visszaigazolás küldve:</strong> {savedEmail}
        </Typography>
      </Box>

      <Button
        onClick={onClose}
        variant="primary"
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
  );
};
