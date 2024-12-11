import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updatePropertyById = async (
  id,
  title,
  description,
  location,
  pricePerNight,
  bedroomCount,
  bathRoomCount,
  maxGuestCount,
  hostId,
  rating
) => {
  const prisma = new PrismaClient();

  const updatedProperty = await prisma.property.updateMany({
    where: {
      id,
    },
    data: {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    },
  });

  if (updatedProperty.count > 0) {
    return {
      message: `Property with id ${id} was updated!`,
    };
  } else {
    throw new NotFoundError("Property", id);
  }
};

export default updatePropertyById;
