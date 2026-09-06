import { Typography, Box } from "@mui/material";
import type { Barber } from "../types/barber.types";
import { BarberCard } from "./BarberCard";

interface BarberSelectorProps {
  barbers: Barber[];
  selectedBarberId?: string;
  onSelectBarber: (barber: Barber) => void;
}

export const BarberSelector = ({
  barbers,
  selectedBarberId,
  onSelectBarber,
}: BarberSelectorProps) => {
  return (
    <Box sx={{ py: 5 }}>
      {/* Titles section */}
      <Box sx={{ textAlign: "center", mb: 5 }}>
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontFamily: "serif",
            fontWeight: "bold",
            color: "#3D2314",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Válassz Mesterborbélyt
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: "#8C6D58", mt: 1, fontWeight: 500 }}
        >
          Tapasztalt borbélyaink készen állnak a tökéletes stílus kialakítására.
        </Typography>
      </Box>

      {/* Barber cards*/}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {barbers.map((barber) => (
          <BarberCard
            key={barber.id}
            barber={barber}
            isSelected={barber.id === selectedBarberId}
            onSelect={onSelectBarber}
          />
        ))}
      </Box>
    </Box>
  );
};
