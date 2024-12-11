import express from "express";
import notFoundErrorHandler from "../middleware/notFoundErrorHandler.js";
import NotFoundError from "../errors/NotFoundError.js";
import authMiddleware from "../middleware/auth.js";
import getHosts from "../services/hosts/getHosts.js";
import getHostById from "../services/hosts/getHostById.js";
import createHost from "../services/hosts/createHost.js";
import updateHostById from "../services/hosts/updateHostById.js";
import deleteHostById from "../services/hosts/deleteHostById.js";

const router = express.Router();

// GET ALL
router.get("/", async (req, res) => {
  try {
    const { name } = req.query;

    const hosts = await getHosts(name);
    res.status(200).json(hosts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while getting the hosts!");
  }
});

// GET BY ID
router.get(
  "/:id",
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const host = await getHostById(id);

      res.status(200).json(host);
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
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe,
    } = req.body;

    if (
      !username ||
      !password ||
      !name ||
      !email ||
      !phoneNumber ||
      !profilePicture ||
      !aboutMe
    ) {
      return res.status(400).send("Missing required fields");
    }
    const newHost = await createHost(
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe
    );
    res.status(201).json(newHost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong while creating this host!");
  }
});

// UPDATE
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    username,
    password,
    name,
    email,
    phoneNumber,
    profilePicture,
    aboutMe,
  } = req.body;

  try {
    const updatedHost = await updateHostById(
      id,
      username,
      password,
      name,
      email,
      phoneNumber,
      profilePicture,
      aboutMe
    );
    res.status(200).json(updatedHost);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Host with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while updating this host!" });
    }
  }
});

// DELETE
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const host = await deleteHostById(id);
    res.status(200).json(host);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: `Host with id ${id} does not exist.` });
    } else {
      console.error(error);
      res
        .status(500)
        .json({ error: "Something went wrong while deleting this host!" });
    }
  }
});

export default router;
