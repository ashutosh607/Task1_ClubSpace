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
    registrationDate: {
      type: String,
      required: true,
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
