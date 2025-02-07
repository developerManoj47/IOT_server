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

const getSensorDataToDownload = async (req, res) => {
  try {
    const currentTime = new Date();
    const time24HoursAgo = new Date(currentTime - 24 * 60 * 60 * 1000);

    // console.log("time24hoursAgo:", time24HoursAgo.toISOString());

    const sensorDataLast24Hours = await SensorDataCol.aggregate([
      { $match: { timestamp: { $gte: time24HoursAgo } } },
      {
        $group: {
          _id: "$sensor_id",
          data: { $push: { data: "$data", timestamp: "$timestamp" } },
        },
      },
      {
        $lookup: {
          from: "SensorCol",
          localField: "_id",
          foreignField: "_id",
          as: "sensor_details",
        },
      },
      // {
      //   $unwind: {
      //     path: "$sensor_details",
      //   },
      // },
    ]);

    // console.log("Data retrieved from DB:", sensorDataLast24Hours);
    res.status(200).json({
      data: sensorDataLast24Hours,
      message: "Sensor data from the last 24 hours retrieved successfully",
    });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      error: "Internal server error",
      error_message: error.message,
      message: "Unable to retrieve sensor data",
    });
  }
};

router
  .route("/sensor-data")
  .get(getSensorDataToDownload)
  .post(postNewSensorData);

export default router;
