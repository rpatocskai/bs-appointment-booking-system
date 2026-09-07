import { Card, CardContent, Typography, Avatar, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ContentCutIcon from "@mui/icons-material/ContentCut";

import { Button } from "../../../components/ui/button/Button";
import type { Barber, WorkSchedule } from "../types/barber.types";

interface BarberCardProps {
  barber: Barber;
  isSelected: boolean;
  onSelect: (barber: Barber) => void;
}

interface DayItem {
  label: string;
  key: keyof WorkSchedule;
}

const DAYS_CONFIG: DayItem[] = [
  { label: "Hétfő", key: "monday" },
  { label: "Kedd", key: "tuesday" },
  { label: "Szerda", key: "wednesday" },
  { label: "Csütörtök", key: "thursday" },
  { label: "Péntek", key: "friday" },
  { label: "Szombat", key: "saturday" },
  { label: "Vasárnap", key: "sunday" },
];

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("");

export const BarberCard = ({
  barber,
  isSelected,
  onSelect,
}: BarberCardProps) => {
  return (
    <Card
      elevation={isSelected ? 8 : 1}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: isSelected ? "#3D2314" : "#E6DCCE",
        backgroundColor: isSelected ? "#3D2314" : "#F7F3EB",
        color: isSelected ? "#FDFBF7" : "#2C1A0E",
        transition: "all 0.3s ease",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        "&:hover": {
          borderColor: "#B59279",
          boxShadow: isSelected ? 8 : 4,
        },
      }}
    >
      <CardContent sx={{ p: 3, flexGrow: 1 }}>
        {/* Header section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: isSelected ? "#C19A6B" : "#E8D3B9",
              color: "#3D2314",
              fontWeight: "bold",
              fontFamily: "serif",
              border: "2px solid",
              borderColor: isSelected ? "#E8D3B9" : "#C19A6B",
            }}
          >
            {getInitials(barber.name)}
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              component="h3"
              sx={{ fontWeight: "bold", fontFamily: "serif" }}
            >
              {barber.name}
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 0.5,
                alignItems: "center",
              }}
            >
              <ContentCutIcon
                sx={{ fontSize: 14, color: isSelected ? "#C19A6B" : "#8C6D58" }}
              />
              <Typography
                variant="caption"
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontWeight: 600,
                  color: isSelected ? "#C19A6B" : "#8C6D58",
                }}
              >
                Mesterborbély
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Dynamic opnening section */}
        <Box
          sx={{
            p: 2,
            borderRadius: "12px",
            backgroundColor: isSelected ? "#2A180D" : "#EFE9DD",
            color: isSelected ? "#E8D3B9" : "#5C4033",
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 1,
              alignItems: "center",
              mb: 1,
            }}
          >
            <AccessTimeIcon sx={{ fontSize: 16, opacity: 0.8 }} />
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              Nyitvatartás
            </Typography>
          </Box>

          {DAYS_CONFIG.map(({ label, key }) => {
            const daySchedule = barber?.workSchedule?.[key];
            const isClosed =
              !daySchedule || !daySchedule.start || !daySchedule.end;
            const timeText = isClosed
              ? "Zárva"
              : `${daySchedule.start} – ${daySchedule.end}`;

            return (
              <Box
                key={key}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  py: 0.5,
                  opacity: isClosed ? 0.5 : 1,
                }}
              >
                <Typography variant="body2">{label}:</Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: "bold",
                    fontFamily: isClosed ? "inherit" : "monospace",
                  }}
                >
                  {timeText}
                </Typography>
              </Box>
            );
          })}
        </Box>

        {/* Action button */}
        <Button
          variant={isSelected ? "secondary" : "primary"}
          onClick={() => onSelect(barber)}
          startIcon={isSelected ? <CheckIcon /> : undefined}
          fullWidth
        >
          {isSelected ? "Kiválasztva" : "Borbély Kiválasztása"}
        </Button>
      </CardContent>
    </Card>
  );
};
