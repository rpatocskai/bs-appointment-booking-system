import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";

interface MyBookingsSearchFormProps {
  onSearch: (email: string) => Promise<void>;
  loading: boolean;
}

export const MyBookingsSearchForm = ({
  onSearch,
  loading,
}: MyBookingsSearchFormProps) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      handleSearchAsync(email);
    }
  };

  const handleSearchAsync = async (searchEmail: string) => {
    await onSearch(searchEmail);
  };

  return (
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
          onSubmit={handleSubmit}
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
                startAdornment: <EmailIcon sx={{ color: "#8c6d58", mr: 1 }} />,
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
  );
};
