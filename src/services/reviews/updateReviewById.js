import { PrismaClient } from "@prisma/client";
import NotFoundError from "../../errors/NotFoundError.js";

const updateReviewById = async (id, userId, propertyId, rating, comment) => {
  const prisma = new PrismaClient();

  const updatedReview = await prisma.review.updateMany({
    where: {
      id,
    },
    data: {
      userId,
      propertyId,
      rating,
      comment,
    },
  });

  if (updatedReview.count > 0) {
    return {
      message: `Review with id ${id} was updated!`,
    };
  } else {
    throw new NotFoundError("Review", id);
  }
};

export default updateReviewById;
