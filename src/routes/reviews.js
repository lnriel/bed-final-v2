import express from "express";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";
import NotFoundError from "../errors/NotFoundError.js";
import authMiddleware from "../middleware/auth.js";
import getReviews from "../services/reviews/getReviews.js";
import getReviewById from "../services/reviews/getReviewById.js";
import createReview from "../services/reviews/createReview.js";
import updateReviewById from "../services/reviews/updateReviewById.js";
import deleteReviewById from "../services/reviews/deleteReviewById.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const reviews = await getReviews();
    res.status(200).json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while getting the reviews!");
  }
});

// GET BY ID
router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const review = await getReviewById(id);

      res.status(200).json(review);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// CREATE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { userId, propertyId, rating, comment } = req.body;

    if (!userId || !propertyId || !rating || !comment) {
      return res.status(400).send("Missing required fields");
    }
    const newReview = await createReview(userId, propertyId, rating, comment);
    res.status(201).json(newReview);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while creating this review!");
  }
});

// UPDATE
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { userId, propertyId, rating, comment } = req.body;

  try {
    const updatedReview = await updateReviewById(
      id,
      userId,
      propertyId,
      rating,
      comment
    );
    res.status(200).json(updatedReview);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Review with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while updating this review!" });
    }
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const review = await deleteReviewById(id);
    res.status(200).json(review);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Review with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while deleting this review!" });
    }
  }
});

export default router;
