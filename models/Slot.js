import mongoose from "mongoose";

const slotSchema = new mongoose.Schema(
  {
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    day: {
      type: String,
      enum: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      required: true,
    },
    startTime: {
      type: String, // Format: "HH:mm" e.g., "14:00"
      required: true,
    },
    endTime: {
      type: String, // Format: "HH:mm" e.g., "17:00"
      required: true,
    },
  },
  { timestamps: true }
);

const Slot = mongoose.model("Slot", slotSchema);
export default Slot;
