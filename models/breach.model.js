import mongoose from "mongoose";

const BreachSchema = new mongoose.Schema({
  device_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CameraDeviceCol",
  },
  breach: {
    type: Boolean,
    required: true,
  },
  timestamp: {
    type: Date, //
  },
});

export default mongoose.model("BreachCol", BreachSchema);
