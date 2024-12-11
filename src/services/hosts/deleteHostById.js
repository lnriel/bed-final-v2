import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const deleteHostById = async (id) => {
  const prisma = new PrismaClient();

  const deletedHost = await prisma.host.deleteMany({
    where: {
      id,
    },
  });

  if (deletedHost.count > 0) {
    return {
      message: `Host with id ${id} was deleted!`,
    };
  } else {
    throw new NotFoundError("Host", id);
  }
};

export default deleteHostById;
