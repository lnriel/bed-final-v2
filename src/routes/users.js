import express from "express";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";
import NotFoundError from "../errors/NotFoundError.js";
import authMiddleware from "../middleware/auth.js";
import getUsers from "../services/users/getUsers.js";
import getUserById from "../services/users/getUserById.js";
import createUser from "../services/users/createUser.js";
import updateUserById from "../services/users/updateUserById.js";
import deleteUserById from "../services/users/deleteUserById.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const { username, email } = req.query;

    const users = await getUsers(username, email);
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while getting the users!");
  }
});

// GET BY ID
router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const user = await getUserById(id);

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },
  notFoundErrorHandler
);

// CREATE
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { username, password, name, email, phoneNumber, profilePicture } =
      req.body;

    if (
      !username ||
      !password ||
      !name ||
      !email ||
      !phoneNumber ||
      !profilePicture
    ) {
      return res.status(400).send("Missing required fields");
    }
    const newUser = await createUser(
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture
    );
    res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while creating this user!");
  }
});

// UPDATE
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, name, email, phoneNumber, profilePicture } =
      req.body;

    const updatedUser = await updateUserById(
      id,
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `This user does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while updating this user!" });
    }
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user = await deleteUserById(id);
    res.status(200).json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `User with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while deleting this user!" });
    }
  }
});

export default router;
