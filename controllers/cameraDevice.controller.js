import CameraDeviceCol from "../models/cameraDevice.model.js";

export const getSingleDevice = async (req, res) => {
  const { device_id } = req.params;
  if (!device_id) {
    return res.status(400).json({
      is_success: false,
      error_code: "INVALID_REQUEST",
      error_message: "Invalid request: Missing required fields.",
      details: {
        device_id: "Not provided as params in url",
      },
    });
  }
  try {
    const deviceRes = await CameraDeviceCol.findOne({ _id: device_id });
    if (!deviceRes) {
      return res.status(404).json({
        is_success: false,
        error_code: "Not_FOUND",
        error_message: "Device document not found in the DB",
      });
    }

    return res.status(200).json({
      is_success: true,
      data: deviceRes,
      message: "Here is the device data",
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "An error occurred while getting single device document.",
    });
  }
};
export const getDeviceList = async (req, res) => {
  try {
    const deviceListRes = await CameraDeviceCol.find();
    if (!deviceListRes) {
      return res.status(404).json({
        is_success: false,
        error_code: "Not_FOUND",
        error_message: "No device document not found in the DB",
      });
    }

    return res.status(200).json({
      is_success: true,
      data: deviceListRes,
      message: "Here is the list of camera devices",
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      error: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "An error occurred while getting device list.",
    });
  }
};
export const updateBattery = async (req, res) => {
  const { battery } = req.body;
  const { device_id } = req.params;
  const errObj = {};
  if (!battery) {
    errObj["battery"] = "Not provided";
  }
  if (!device_id) {
    errObj["device_id"] = "Not provided as params in url";
  }
  if (Object.keys(errObj).length > 0) {
    return res.status(400).json({
      is_success: false,
      error_code: "INVALID_REQUEST",
      error_message: "Invalid request: Missing required fields",
      details: {
        ...errObj,
      },
    });
  }
  try {
    const updateRes = await CameraDeviceCol.findByIdAndUpdate(
      device_id,
      {
        $set: { battery: battery },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      is_success: true,
      data: updateRes,
      message: "Device Document after updating the doc",
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      error: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "An error occurred while updating device battery percentage.",
    });
  }
};
export const updateDeviceStatus = async (req, res) => {
  const { currentStatus } = req.body;
  const { device_id } = req.params;
  const errObj = {};
  if (currentStatus === undefined) {
    errObj["currentStatus"] = "Not provided";
  }
  if (!device_id) {
    errObj["device_id"] = "Not provided as params in url";
  }
  if (Object.keys(errObj).length > 0) {
    return res.status(400).json({
      is_success: false,
      error_code: "INVALID_REQUEST",
      error_message: "Invalid request: Missing required fields",
      details: {
        ...errObj,
      },
    });
  }
  try {
    const updateStatusResponse = await CameraDeviceCol.findByIdAndUpdate(
      device_id,
      { $set: { current_status: currentStatus } },
      { new: true }
    );
    res.status(200).json({
      is_success: true,
      data: updateStatusResponse,
      message: "Device status updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      error: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "An error occurred while updating the device status",
    });
  }
};
