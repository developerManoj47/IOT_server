import mongoose from "mongoose";

const ActionSchema = new mongoose.Schema({
  current_status: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model("ActionCol", ActionSchema);
