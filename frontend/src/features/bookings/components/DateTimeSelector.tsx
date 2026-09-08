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

  return (
    <Box sx={{ mt: 4, mx: "auto", maxWidth: 900 }}>
      <Typography
        variant="h4"
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
        variant="body1"
        align="center"
        sx={{ color: "#6d5c50", mb: 4 }}
      >
        Válaszd ki a számodra megfelelő napot és szabad idősávot{" "}
        <strong>{selectedBarberName}</strong> naptárából.
      </Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card
            sx={{
              bgcolor: "#f7f4eb",
              border: "1px solid #e1dacb",
              borderRadius: 2,
              boxShadow: "none",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  color: "#2b1c11",
                }}
              >
                <CalendarMonthIcon sx={{ mr: 1 }} />
                <Typography
                  variant="h6"
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
                  inputLabel: { shrink: true },
                  htmlInput: {
                    min: new Date().toISOString().split("T")[0],
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "#ffffff",
                    "& fieldset": { borderColor: "#cbd5e1" },
                    "&:hover fieldset": { borderColor: "#2b1c11" },
                    "&.Mui-focused fieldset": { borderColor: "#2b1c11" },
                  },
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card
            sx={{
              bgcolor: "#f7f4eb",
              border: "1px solid #e1dacb",
              borderRadius: 2,
              boxShadow: "none",
              minHeight: 200,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 3,
                  color: "#2b1c11",
                }}
              >
                <AccessTimeIcon sx={{ mr: 1 }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: "bold", fontFamily: "serif" }}
                >
                  Elérhető idősávok
                </Typography>
              </Box>

              {loading && (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
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
                <Typography
                  align="center"
                  sx={{ color: "#7f6d5f", py: 4, fontStyle: "italic" }}
                >
                  Ezen a napon nincs elérhető szabad időpont, vagy a szalon
                  zárva tart.
                </Typography>
              )}

              {!loading && !error && slots.length > 0 && (
                <Grid container spacing={1.5}>
                  {slots.map((slot, index) => {
                    const isSelected =
                      selectedSlot?.startTime === slot.startTime;
                    return (
                      <Grid size={{ xs: 4, sm: 3 }} key={index}>
                        <Button
                          fullWidth
                          variant={isSelected ? "contained" : "outlined"}
                          onClick={() => onSlotSelect(slot)}
                          sx={{
                            py: 1.5,
                            borderRadius: 1.5,
                            fontWeight: "bold",
                            textTransform: "none",
                            fontSize: "0.95rem",
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
