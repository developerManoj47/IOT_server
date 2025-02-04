import mongoose from "mongoose";

const CameraDeviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  battery: {
    type: Number,
  },
  current_status: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("CameraDeviceCol", CameraDeviceSchema);
