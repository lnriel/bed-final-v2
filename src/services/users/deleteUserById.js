import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const deleteUserById = async (id) => {
  const prisma = new PrismaClient();

  const deletedUser = await prisma.user.deleteMany({
    where: {
      id,
    },
  });

  if (deletedUser.count > 0) {
    return {
      message: `User with id ${id} was deleted!`,
    };
  } else {
    throw new NotFoundError("User", id);
  }
};

export default deleteUserById;
