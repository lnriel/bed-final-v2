import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const deleteBookingById = async (id) => {
  const prisma = new PrismaClient();

  const deletedBooking = await prisma.booking.deleteMany({
    where: {
      id,
    },
  });

  if (deletedBooking.count > 0) {
    return {
      message: `Booking with id ${id} was deleted!`,
    };
  } else {
    throw new NotFoundError("Booking", id);
  }
};

export default deleteBookingById;
