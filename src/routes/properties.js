import express from "express";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";
import NotFoundError from "../errors/NotFoundError.js";
import authMiddleware from "../middleware/auth.js";
import getProperties from "../services/properties/getProperties.js";
import getPropertyById from "../services/properties/getPropertyById.js";
import createProperty from "../services/properties/createProperty.js";
import updatePropertyById from "../services/properties/updatePropertyById.js";
import deletePropertyById from "../services/properties/deletePropertyById.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const { location, pricePerNight } = req.query;

    const properties = await getProperties(location, pricePerNight);
    res.status(200).json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while getting the properties!");
  }
});

// GET BY ID
router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const property = await getPropertyById(id);

      res.status(200).json(property);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// CREATE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating,
    } = req.body;

    if (
      !title ||
      !description ||
      !location ||
      !pricePerNight ||
      !bedroomCount ||
      !bathRoomCount ||
      !maxGuestCount ||
      !hostId ||
      !rating
    ) {
      return res.status(400).send("Missing required fields");
    }
    const newProperty = await createProperty(
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating
    );
    res.status(201).json(newProperty);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while creating this property!");
  }
});

// UPDATE
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    location,
    pricePerNight,
    bedroomCount,
    bathRoomCount,
    maxGuestCount,
    hostId,
    rating,
  } = req.body;

  try {
    const updatedProperty = await updatePropertyById(
      id,
      title,
      description,
      location,
      pricePerNight,
      bedroomCount,
      bathRoomCount,
      maxGuestCount,
      hostId,
      rating
    );
    res.status(200).json(updatedProperty);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Property with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while updating this property" });
    }
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const property = await deletePropertyById(id);
    res.status(200).json(property);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Property with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while deleting this property!" });
    }
  }
});

export default router;
