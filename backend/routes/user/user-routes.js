const express = require("express");
const {
  getPublicClubs,
  getPublicEvents,
  registerForEvent,
  getUserRegistrations,
} = require("../../controllers/user/user-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.get("/clubs", getPublicClubs);
router.get("/events", getPublicEvents);
router.post("/register", authMiddleware, registerForEvent);
router.get("/my-registrations", authMiddleware, getUserRegistrations);

module.exports = router;
