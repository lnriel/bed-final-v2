import express from "express";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";
import NotFoundError from "../errors/NotFoundError.js";
import authMiddleware from "../middleware/auth.js";
import getBookings from "../services/bookings/getBookings.js";
import getBookingById from "../services/bookings/getBookingById.js";
import createBooking from "../services/bookings/createBooking.js";
import updateBookingById from "../services/bookings/updateBookingById.js";
import deleteBookingById from "../services/bookings/deleteBookingById.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const { userId, propertyId } = req.query;
    const bookings = await getBookings(userId, propertyId);

    if (bookings.length === 0) {
      return res
        .status(404)
        .send("No bookings were found matching these filters.");
    }

    res.status(200).json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while getting the bookings!");
  }
});

// GET BY ID
router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const booking = await getBookingById(id);

      res.status(200).json(booking);
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
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus,
    } = req.body;

    if (
      !userId ||
      !propertyId ||
      !checkinDate ||
      !checkoutDate ||
      !numberOfGuests ||
      !totalPrice ||
      !bookingStatus
    ) {
      return res.status(400).send("Missing required fields");
    }

    const newBooking = await createBooking(
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus
    );
    res.status(201).json(newBooking);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while creating this booking!");
  }
});

// UPDATE
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    userId,
    propertyId,
    checkinDate,
    checkoutDate,
    numberOfGuests,
    totalPrice,
    bookingStatus,
  } = req.body;

  try {
    const updatedBooking = await updateBookingById(
      id,
      userId,
      propertyId,
      checkinDate,
      checkoutDate,
      numberOfGuests,
      totalPrice,
      bookingStatus
    );
    res.status(200).json(updatedBooking);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Booking with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while updating this booking!" });
    }
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const booking = await deleteBookingById(id);
    res.status(200).json(booking);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Booking with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while deleting this booking!" });
    }
  }
});

export default router;
