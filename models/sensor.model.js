import mongoose from "mongoose";

const SensorSchema = new mongoose.Schema({
  name: {
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
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
  },
});

const SensorCol = mongoose.model("SensorCol", SensorSchema);
export default SensorCol;
