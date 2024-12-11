import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const deleteAmenityById = async (id) => {
  const prisma = new PrismaClient();

  const deletedAmenity = await prisma.amenity.deleteMany({
    where: {
      id,
    },
  });

  if (deletedAmenity.count > 0) {
    return {
      message: `Amenity with id ${id} was deleted!`,
    };
  } else {
    throw new NotFoundError("Amenity", id);
  }
};

export default deleteAmenityById;
