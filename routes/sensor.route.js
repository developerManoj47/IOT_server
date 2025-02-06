import express from "express";
const router = express.Router();
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";
import {
  addNewSensor,
  getSensorData,
  updateActionState,
  updateSensorData,
} from "../controllers/sensor.controller.js";

// without middleware
router.route("/sensor/data/:sensor_id").post(updateSensorData); // body- sensorData , battery (Number)
router.route("/sensor").get(getSensorData);
// With middleware
router.route("/sensor").post(authMiddleware, adminMiddleware, addNewSensor);
router
  .route("/sensor/action/:sensor_id")
  .post(authMiddleware, adminMiddleware, updateActionState); // body - currentState

export default router;
