const mongoose = require("mongoose");

const RegistrationSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    eventTitle: {
      type: String,
      required: true,
      trim: true,
    },
    clubName: {
      type: String,
      required: true,
      trim: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    registrationDate: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    collegeId: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      default: "",
    },
    department: {
      type: String,
      default: "",
    },
    answers: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Open", "Waitlist", "Closed", "Cancelled"],
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Registration", RegistrationSchema);

