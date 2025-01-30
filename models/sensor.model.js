import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
  },
  battery: {
    type: Number,
  },
  action: {
    has_action: {
      type: Boolean,
      required: true,
    },
    current_status: {
      type: Boolean,
      default: false,
    },
    threshold: {
      type: String,
    },
  },

  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const SensorCol = mongoose.model("SensorCol", SensorSchema);
export default SensorCol;
