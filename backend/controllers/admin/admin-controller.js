const Event = require("../../models/Event");
const Club = require("../../models/Club");
const Registration = require("../../models/Registration");

// Events Controllers
const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const { title, club, category, date, venue, capacity, status, description, image } = req.body;
    if (!title || !club || !date || !venue) {
      return res.status(400).json({
        success: false,
        message: "Please fill in title, club, date, and venue.",
      });
    }

    // Verify hosting club exists on the platform
    const existingClub = await Club.findOne({
      name: { $regex: new RegExp(`^${club.trim()}$`, "i") },
    });

    if (!existingClub) {
      return res.status(400).json({
        success: false,
        message: `Club "${club}" is not registered on the platform. Please select a valid campus club.`,
      });
    }

    const newEvent = new Event({
      title,
      club: existingClub.name, // Use canonical registered name
      category: category || existingClub.category || "General",
      date,
      venue,
      capacity: Number(capacity) || 50,
      registrationsCount: 0,
      status: status || "Open",
      description: description || "",
      image: image || "",
    });

    await newEvent.save();
    return res.status(201).json({
      success: true,
      message: "Event created successfully!",
      event: newEvent,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, club, category, date, venue, capacity, status, description, image } = req.body;

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { title, club, category, date, venue, capacity: Number(capacity), status, description, image },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ success: false, message: "Event not found." });
    }

    return res.status(200).json({
      success: true,
      message: "Event updated successfully!",
      event: updatedEvent,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Event deleted successfully." });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Clubs Controllers
const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, clubs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createClub = async (req, res) => {
  try {
    const { name, category, leadName, email, description, logo } = req.body;
    if (!name || !category || !leadName || !email) {
      return res.status(400).json({
        success: false,
        message: "Please fill in club name, category, lead name, and email.",
      });
    }

    const newClub = new Club({
      name,
      category,
      leadName,
      email,
      description: description || "",
      logo: logo || "",
      status: "Active",
    });

    await newClub.save();
    return res.status(201).json({
      success: true,
      message: "Club registered successfully!",
      club: newClub,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Registrations Controllers
const getRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, registrations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const registration = await Registration.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Status updated successfully.",
      registration,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getClubs,
  createClub,
  getRegistrations,
  updateRegistrationStatus,
};
