import { useState } from "react";
import { Container, Box, CircularProgress, Typography } from "@mui/material";
import { BarberSelector } from "../features/barbers/components/BarberSelector";
import { useBarbers } from "../features/barbers/hooks/useBarber";
import type { Barber } from "../features/barbers/types/barber.types";

export const BookingPage = () => {
  const [selectedBarberId, setSelectedBarberId] = useState<string | undefined>(
    undefined,
  );

  // Invite barber hook
  const { barbers, isLoading, error } = useBarbers();

  const handleSelectBarber = (barber: Barber) => {
    setSelectedBarberId(barber.id);
    console.log("Kiválasztott borbély:", barber.name);
  };

  // Handle loading state
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

  // Error handling
  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 5, textAlign: "center" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }

  // Barber page impl
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          backgroundColor: "#FDFBF7",
          p: { xs: 2, md: 4 },
          borderRadius: "24px",
        }}
      >
        <BarberSelector
          barbers={barbers}
          selectedBarberId={selectedBarberId}
          onSelectBarber={handleSelectBarber}
        />
      </Box>
    </Container>
  );
};
