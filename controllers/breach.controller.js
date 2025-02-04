import BreachCol from "../models/breach.model.js";

export const postBreach = async (req, res) => {
  const { deviceId, breach, timestamp } = req.body;
  const errObj = {};
  if (!breach) {
    errObj["breach"] = "Not provided";
  }
  if (!deviceId) {
    errObj["deviceId"] = "Not provided";
  }
  if (!timestamp) {
    errObj["timestamp"] = "Not provided";
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
    const newBreach = new BreachCol({
      device_id: deviceId,
      breach: breach,
      timestamp: timestamp,
      // TODO -- start from here
    });
    const newBreachRes = await newBreach.save();
    return res.status(402).json({
      is_success: true,
      data: newBreachRes,
      message: "New breach added successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      error: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "An error occurred while adding new Breach",
    });
  }
};

export const getBreachOfLast24Hours = async (req, res) => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now);
  twentyFourHoursAgo.setHours(now.getHours() - 24);
  try {
    const countRes = await BreachCol.countDocuments({
      timestamp: {
        $gte: twentyFourHoursAgo,
        $lte: now,
      },
    });

    return res.status(200).json({
      is_success: true,
      data: countRes,
      message: "Count of breach in last 24 hours",
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      error: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "An error occurred while getting breach of last 24 hours",
    });
  }
};
