import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updateAmenityById = async (id, name) => {
  const prisma = new PrismaClient();

  const updatedAmenity = await prisma.amenity.updateMany({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  if (updatedAmenity.count > 0) {
    return {
      message: `Amenity with id ${id} was updated!`,
    };
  } else {
    throw new NotFoundError("Amenity", id);
  }
};

export default updateAmenityById;
