import express from "express";
const router = express.Router();
import SensorDataCol from "../models/sensorData.model.js";

const getLatestSensorData = async (req, res) => {
  try {
    const latestSensorData = await SensorDataCol.aggregate([
      { $sort: { timestamp: -1 } },
      {
        $group: {
          _id: "$sensor_id",
          latestData: { $first: "$data" },
          timestamp: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "SensorCol",
          localField: "_id",
          foreignField: "_id",
          as: "sensorDetails",
        },
      },
      {
        $unwind: "$sensorDetails",
      },
    ]);

    res.status(200).json({
      data: latestSensorData,
      message: "Latest sensor data retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal server error",
      error_message: error.message,
      message: "Unable to retrieve latest sensor data",
    });
  }
};

const postNewSensorData = async (req, res) => {
  const { sensorId, sensorData } = req.body;
  if (!sensorId || Object.keys(sensorData).length === 0) {
    return res.status(400).json({
      error: "Invalid request: Missing required fields",
      details: {
        sensorData: sensorId || "Not provided",
        sensorData:
          Object.keys(sensorData).length === 0 ? "Not provided" : sensorData,
      },
    });
  }

  try {
    //
  } catch (error) {}
};

router.route("/sensor-data").get(getLatestSensorData).post(postNewSensorData);
