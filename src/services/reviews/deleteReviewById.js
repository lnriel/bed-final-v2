import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const deleteReviewById = async (id) => {
  const prisma = new PrismaClient();

  const deletedReview = await prisma.review.deleteMany({
    where: {
      id,
    },
  });

  if (deletedReview.count > 0) {
    return {
      message: `Review with id ${id} was deleted!`,
    };
  } else {
    throw new NotFoundError("Review", id);
  }
};

export default deleteReviewById;
