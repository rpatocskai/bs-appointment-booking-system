import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import type { Barber } from "../../barbers/types/barber.types";
import type { UserBooking } from "../types/booking.types";
import { Button } from "../../../components/ui/button/Button";

interface MyBookingsTableProps {
  bookings: UserBooking[];
  barbers: Barber[];
  onDeleteClick: (booking: UserBooking) => void;
}

export const MyBookingsTable = ({
  bookings,
  barbers,
  onDeleteClick,
}: MyBookingsTableProps) => {
  const getBarberName = (barberId: string): string => {
    const barber = barbers.find((b) => b.id === barberId);
    return barber ? barber.name : "Ismeretlen Borbély";
  };

  const formatDateTime = (isoString: string): string => {
    const d = new Date(isoString);
    const dateStr = d.toLocaleDateString("hu-HU", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const timeStr = d.toLocaleTimeString("hu-HU", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${dateStr} ${timeStr}`;
  };

  return (
    <Box>
      <Box
        sx={{
          display: { xs: "flex", sm: "none" },
          flexDirection: "column",
          gap: 2,
        }}
      >
        {bookings.map((booking) => (
          <Box
            key={booking.id}
            sx={{
              bgcolor: "#FDFBF7",
              border: "1px solid #E8E2D5",
              borderRadius: 2,
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{
                  color: "#8C6D58",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                Borbély
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#2b1c11", fontWeight: 600 }}
              >
                {getBarberName(booking.barberId)}
              </Typography>
            </Box>

            <Box
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#8C6D58",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Kezdés
                </Typography>
                <Typography variant="body2" sx={{ color: "#2b1c11" }}>
                  {formatDateTime(booking.startTime)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#8C6D58",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Befejezés
                </Typography>
                <Typography variant="body2" sx={{ color: "#2b1c11" }}>
                  {formatDateTime(booking.endTime)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="outline"
              onClick={() => onDeleteClick(booking)}
              sx={{
                mt: 1,
                textTransform: "none",
                borderRadius: 1.5,
                fontWeight: "bold",
                py: 1.2,
                width: "100%",
                color: "#9b1c1c",
                borderColor: "#cbd5e1",
                "&:hover": {
                  backgroundColor: "#fdf2f2",
                  borderColor: "#9b1c1c",
                  color: "#9b1c1c",
                },
              }}
            >
              Időpont Lemondása
            </Button>
          </Box>
        ))}
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          display: { xs: "none", sm: "block" },
          bgcolor: "#FDFBF7",
          boxShadow: "none",
          border: "1px solid #E8E2D5",
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead sx={{ bgcolor: "#f1ede2" }}>
            <TableRow>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#3D2314",
                  fontFamily: "serif",
                }}
              >
                Borbély
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#3D2314",
                  fontFamily: "serif",
                }}
              >
                Kezdés időpontja
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: "bold",
                  color: "#3D2314",
                  fontFamily: "serif",
                }}
              >
                Befejezés időpontja
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  fontWeight: "bold",
                  color: "#3D2314",
                  fontFamily: "serif",
                }}
              >
                Művelet
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow
                key={booking.id}
                sx={{ "&:hover": { bgcolor: "#f7f4eb" } }}
              >
                <TableCell sx={{ color: "#2b1c11", fontWeight: 500 }}>
                  {getBarberName(booking.barberId)}
                </TableCell>
                <TableCell sx={{ color: "#2b1c11" }}>
                  {formatDateTime(booking.startTime)}
                </TableCell>
                <TableCell sx={{ color: "#2b1c11" }}>
                  {formatDateTime(booking.endTime)}
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outline"
                    onClick={() => onDeleteClick(booking)}
                    sx={{
                      textTransform: "none",
                      borderRadius: 1.5,
                      fontWeight: "bold",
                      py: 1,
                      px: 2,
                      color: "#9b1c1c",
                      borderColor: "#e1dacb",
                      "&:hover": {
                        backgroundColor: "#fdf2f2",
                        borderColor: "#9b1c1c",
                        color: "#9b1c1c",
                      },
                    }}
                  >
                    Lemondás
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
