import express from "express";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";
import NotFoundError from "../errors/NotFoundError.js";
import authMiddleware from "../middleware/auth.js";
import getAmenities from "../services/amenities/getAmenities.js";
import getAmenityById from "../services/amenities/getAmenityById.js";
import createAmenity from "../services/amenities/createAmenity.js";
import updateAmenityById from "../services/amenities/updateAmenityById.js";
import deleteAmenityById from "../services/amenities/deleteAmenityById.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;

    const amenities = await getAmenities(name);
    res.status(200).json(amenities);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while getting the amenities!");
  }
});

// GET BY ID
router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const amenity = await getAmenityById(id);

      res.status(200).json(amenity);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// CREATE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send("Missing required fields");
    }
    const newAmenity = await createAmenity(name);
    res.status(201).json(newAmenity);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while creating this amenity!");
  }
});

// UPDATE
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const updatedAmenity = await updateAmenityById(id, name);
    res.status(200).json(updatedAmenity);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Amenity with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while updating this amenity!" });
    }
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const amenity = await deleteAmenityById(id);
    res.status(200).json(amenity);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Amenity with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while deleting this amenity" });
    }
  }
});

export default router;
