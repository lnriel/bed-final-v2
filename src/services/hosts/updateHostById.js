import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updateHostById = async (
  id,
  username,
  password,
  name,
  email,
  phoneNumber,
  profilePicture,
  aboutMe
) => {
  const prisma = new PrismaClient();

  const updatedHost = await prisma.host.updateMany({
    where: {
      id,
    },
    data: {
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    },
  });

  if (updatedHost.count > 0) {
    return {
      message: `Host with id ${id} was updated!`,
    };
  } else {
    throw new NotFoundError("Host", id);
  }
};

export default updateHostById;
