import { PrismaClient } from "@prisma/client";

const getBookings = async (id) => {
  const prisma = new PrismaClient();

  return prisma.booking.findMany({
    where: {
      userId: {
        contains: id,
      },
    },
  });
};

export default getBookings;
