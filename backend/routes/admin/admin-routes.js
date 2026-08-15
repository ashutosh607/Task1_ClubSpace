const express = require("express");
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getClubs,
  createClub,
  getRegistrations,
  updateRegistrationStatus,
} = require("../../controllers/admin/admin-controller");
const { authMiddleware } = require("../../controllers/auth/auth-controller");

const router = express.Router();

// Events
router.get("/events", authMiddleware, getEvents);
router.post("/events", authMiddleware, createEvent);
router.put("/events/:id", authMiddleware, updateEvent);
router.delete("/events/:id", authMiddleware, deleteEvent);

// Clubs
router.get("/clubs", authMiddleware, getClubs);
router.post("/clubs", authMiddleware, createClub);

// Registrations
router.get("/registrations", authMiddleware, getRegistrations);
router.put("/registrations/:id/status", authMiddleware, updateRegistrationStatus);

module.exports = router;
