import mongoose from "mongoose";

const SensorDataSchema = new mongoose.Schema({
  sensor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "SensorCol",
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
  timestamp: {
    type: Date,
  },
});

const SensorDataCol = mongoose.model("SensorDataCol", SensorDataSchema);
export default SensorDataCol;
