import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const deletePropertyById = async (id) => {
  const prisma = new PrismaClient();

  const deletedProperty = await prisma.property.deleteMany({
    where: {
      id,
    },
  });

  if (deletedProperty.count > 0) {
    return {
      message: `Property with id ${id} was deleted!`,
    };
  } else {
    throw new NotFoundError("Amenity", id);
  }
};

export default deletePropertyById;
