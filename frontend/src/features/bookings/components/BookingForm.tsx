import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import type { TimeSlot } from "../types/booking.types";

interface BookingFormProps {
  barberName: string;
  selectedDate: string;
  selectedSlot: TimeSlot;
  onSubmit: (email: string) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
}

export const BookingForm = ({
  barberName,
  selectedDate,
  selectedSlot,
  onSubmit,
  isSubmitting,
  submitError,
}: BookingFormProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [selectedSlot]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      onSubmit(email);
    }
  };

  const formatTime = (isoString: string): string => {
    return new Date(isoString).toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box ref={formRef} sx={{ mt: 5, mx: "auto", maxWidth: 600 }}>
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
        FOGLALÁS VÉGLEGESÍTÉSE
      </Typography>
      <Typography
        variant="body1"
        align="center"
        sx={{ color: "#6d5c50", mb: 4 }}
      >
        Kérjük, ellenőrizd az adatokat, és add meg az e-mail címed a foglalás
        rögzítéséhez.
      </Typography>

      <Card
        sx={{
          bgcolor: "#f7f4eb",
          border: "1px solid #e1dacb",
          borderRadius: 2,
          boxShadow: "none",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              bgcolor: "#f1ede2",
              p: 2,
              borderRadius: 1.5,
              mb: 4,
              border: "1px dashed #cbd5e1",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                color: "#2b1c11",
              }}
            >
              <ContentPasteIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", fontFamily: "serif" }}
              >
                A kiválasztott időpont részletei:
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ color: "#2b1c11", ml: 3.5, mb: 0.5 }}
            >
              <strong>Borbély:</strong> {barberName}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#2b1c11", ml: 3.5, mb: 0.5 }}
            >
              <strong>Dátum:</strong> {selectedDate}
            </Typography>
            <Typography variant="body2" sx={{ color: "#2b1c11", ml: 3.5 }}>
              <strong>Idősáv:</strong> {formatTime(selectedSlot.startTime)} –{" "}
              {formatTime(selectedSlot.endTime)}
            </Typography>
          </Box>

          {submitError && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                bgcolor: "#fdf2f2",
                color: "#9b1c11",
                border: "1px solid #fbd5d5",
              }}
            >
              {submitError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", color: "#2b1c11", mb: 1 }}
            >
              E-mail címed
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="pelda@email.hu"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError(null);
              }}
              error={Boolean(emailError)}
              helperText={emailError}
              disabled={isSubmitting}
              slotProps={{
                input: {
                  startAdornment: (
                    <EmailIcon sx={{ color: "#8c6d58", mr: 1 }} />
                  ),
                },
              }}
              sx={{
                mb: 4,
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
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{
                py: 2,
                borderRadius: 1.5,
                fontWeight: "bold",
                fontSize: "1.05rem",
                textTransform: "uppercase",
                letterSpacing: 1,
                bgcolor: "#2b1c11",
                color: "#ffffff",
                "&:hover": {
                  bgcolor: "#1c120b",
                },
              }}
            >
              {isSubmitting ? "Foglalás rögzítése..." : "Időpont lefoglalása"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
