const Club = require("../../models/Club");
const Event = require("../../models/Event");
const Registration = require("../../models/Registration");

// Fetch active clubs
const getPublicClubs = async (req, res) => {
  try {
    const clubs = await Club.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, clubs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch active events
const getPublicEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, events });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Register for an event
const registerForEvent = async (req, res) => {
  try {
    const {
      studentName,
      email,
      eventTitle,
      clubName,
      eventId,
      phone,
      collegeId,
      year,
      department,
      answers,
    } = req.body;

    if (!studentName || !email || !eventTitle || !clubName) {
      return res.status(400).json({
        success: false,
        message: "Student name, email, event title, and club name are required.",
      });
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newRegistration = new Registration({
      studentName,
      email: email.toLowerCase(),
      eventTitle,
      clubName,
      eventId: eventId || null,
      registrationDate: todayStr,
      phone: phone || "",
      collegeId: collegeId || "",
      year: year || "",
      department: department || "",
      answers: answers || "",
      status: "Open",
    });

    await newRegistration.save();

    // Increment event registration count if eventId exists or by title matching
    if (eventId) {
      await Event.findByIdAndUpdate(eventId, { $inc: { registrationsCount: 1 } });
    } else {
      await Event.findOneAndUpdate(
        { title: eventTitle },
        { $inc: { registrationsCount: 1 } }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Successfully registered for event!",
      registration: newRegistration,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's registration history
const getUserRegistrations = async (req, res) => {
  try {
    const userEmail = req.user?.email || req.query.email;
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required to fetch registrations.",
      });
    }

    const registrations = await Registration.find({
      email: userEmail.toLowerCase(),
    }).sort({ createdAt: -1 });

    return res.status(200).json({ success: true, registrations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPublicClubs,
  getPublicEvents,
  registerForEvent,
  getUserRegistrations,
};
