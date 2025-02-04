import express from "express";
import {
  getDeviceList,
  getSingleDevice,
  updateBattery,
  updateDeviceStatus,
} from "../controllers/cameraDevice.controller.js";

const router = express.Router();

router.route("/camera-device/:device_id").get(getSingleDevice);
router.route("/camera-device").get(getDeviceList);
router.route("/camera-device/battery/:device_id").patch(updateBattery);
router.route("/camera-device/status/:device_id").patch(updateDeviceStatus);

export default router;
