import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
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
    <TableContainer
      component={Paper}
      sx={{
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
              sx={{ fontWeight: "bold", color: "#3D2314", fontFamily: "serif" }}
            >
              Borbély
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#3D2314", fontFamily: "serif" }}
            >
              Kezdés időpontja
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", color: "#3D2314", fontFamily: "serif" }}
            >
              Befejezés időpontja
            </TableCell>
            <TableCell
              align="center"
              sx={{ fontWeight: "bold", color: "#3D2314", fontFamily: "serif" }}
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
  );
};
