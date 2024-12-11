import { PrismaClient } from "@prisma/client";

const getAmenities = async (name) => {
  const prisma = new PrismaClient();

  return prisma.amenity.findMany({
    where: {
      name,
    },
  });
};

export default getAmenities;
