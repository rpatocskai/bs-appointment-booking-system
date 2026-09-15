import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAvailability } from "../hooks/useAvailability";
import type { TimeSlot } from "../types/booking.types";

interface DateTimeSelectorProps {
  selectedBarberId: string;
  selectedBarberName: string;
  selectedDate: string;
  onDateChange: (date: string) => void;
  selectedSlot: TimeSlot | null;
  onSlotSelect: (slot: TimeSlot) => void;
}

export const DateTimeSelector = ({
  selectedBarberId,
  selectedBarberName,
  selectedDate,
  onDateChange,
  selectedSlot,
  onSlotSelect,
}: DateTimeSelectorProps) => {
  const { slots, loading, error } = useAvailability(
    selectedBarberId,
    selectedDate,
  );

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <Box sx={{ mt: 2, mx: "auto", maxWidth: 600, width: "100%" }}>
      <Typography
        variant="h5"
        align="center"
        component="h2"
        sx={{
          fontFamily: "serif",
          fontWeight: "bold",
          color: "#2b1c11",
          letterSpacing: 1,
          mb: 1,
        }}
      >
        IDŐPONT VÁLASZTÁSA
      </Typography>
      <Typography
        variant="body2"
        align="center"
        sx={{ color: "#6d5c50", mb: 3 }}
      >
        Válaszd ki a számodra megfelelő napot és szabad idősávot{" "}
        <strong>{selectedBarberName}</strong> naptárából.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              bgcolor: "#f7f4eb",
              border: "1px solid #e1dacb",
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 2.5 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1.5,
                  color: "#2b1c11",
                }}
              >
                <CalendarMonthIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", fontFamily: "serif" }}
                >
                  Dátum kijelölése
                </Typography>
              </Box>

              <TextField
                type="date"
                fullWidth
                value={selectedDate}
                onChange={(e) => onDateChange(e.target.value)}
                slotProps={{
                  htmlInput: {
                    min: todayStr,
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#ffffff",
                    "& fieldset": { borderColor: "#cbd5e1" },
                    "&:hover fieldset": { borderColor: "#2b1c11" },
                    "&.Mui-focused fieldset": { borderColor: "#2b1c11" },
                    "& input::-webkit-calendar-picker-indicator": {
                      cursor: "pointer",
                      filter:
                        "invert(10%) sepia(20%) saturate(1000%) hue-rotate(340deg)",
                    },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card
            sx={{
              bgcolor: "#f7f4eb",
              border: "1px solid #e1dacb",
              borderRadius: 2,
              boxShadow: "none",
              minHeight: 220,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#2b1c11",
                }}
              >
                <AccessTimeIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", fontFamily: "serif" }}
                >
                  Elérhető idősávok
                </Typography>
              </Box>

              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 6,
                  }}
                >
                  <CircularProgress sx={{ color: "#2b1c11" }} />
                </Box>
              )}

              {error && (
                <Alert
                  severity="error"
                  sx={{
                    bgcolor: "#fdf2f2",
                    color: "#9b1c1c",
                    border: "1px solid #fbd5d5",
                  }}
                >
                  {error}
                </Alert>
              )}

              {!loading && !error && slots.length === 0 && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 4,
                    flexGrow: 1,
                  }}
                >
                  <Typography
                    align="center"
                    sx={{ color: "#7f6d5f", fontStyle: "italic" }}
                  >
                    Ezen a napon nincs elérhető szabad időpont, vagy a szalon
                    zárva tart.
                  </Typography>
                </Box>
              )}

              {!loading && !error && slots.length > 0 && (
                <Grid container spacing={1.5}>
                  {slots.map((slot, index) => {
                    const isSelected =
                      selectedSlot?.startTime === slot.startTime;
                    return (
                      <Grid size={{ xs: 4 }} key={index}>
                        <Button
                          fullWidth
                          variant={isSelected ? "contained" : "outlined"}
                          onClick={() => onSlotSelect(slot)}
                          sx={{
                            py: 1.2,
                            borderRadius: 1.5,
                            fontWeight: "bold",
                            textTransform: "none",
                            fontSize: "0.9rem",
                            bgcolor: isSelected ? "#2b1c11" : "#ffffff",
                            color: isSelected ? "#ffffff" : "#2b1c11",
                            borderColor: isSelected ? "#2b1c11" : "#e1dacb",
                            "&:hover": {
                              bgcolor: isSelected ? "#1c120b" : "#f1ede2",
                              borderColor: "#2b1c11",
                            },
                          }}
                        >
                          {formatTime(slot.startTime)}
                        </Button>
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
