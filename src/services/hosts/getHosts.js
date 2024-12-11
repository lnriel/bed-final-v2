import { PrismaClient } from "@prisma/client";

const getHosts = async (id) => {
  const prisma = new PrismaClient();

  return prisma.host.findMany({
    where: {
      name: {
        contains: id,
      },
    },
  });
};

export default getHosts;
