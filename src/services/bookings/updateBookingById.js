import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updateBookingById = async (
  id,
  userId,
  propertyId,
  checkinDate,
  checkoutDate,
  numberOfGuests,
  totalPrice,
  bookingStatus
) => {
  const prisma = new PrismaClient();

  const updatedBooking = await prisma.booking.updateMany({
    where: {
      id,
    },
    data: {
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    },
  });

  if (updatedBooking.count > 0) {
    return {
      message: `Booking with id ${id} was updated!`,
    };
  } else {
    throw new NotFoundError("Booking", id);
  }
};

export default updateBookingById;
