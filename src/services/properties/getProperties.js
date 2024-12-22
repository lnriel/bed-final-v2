import { PrismaClient } from "@prisma/client";

const getProperties = async (location, pricePerNight) => {
  const prisma = new PrismaClient();

  const filter = {};

  if (location) {
    filter.location = {
      contains: location,
    };
  }

  if (pricePerNight) {
    filter.pricePerNight = parseFloat(pricePerNight);
  }

  return prisma.property.findMany({
    where: filter,
  });
};

export default getProperties;
