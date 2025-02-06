import SensorCol from "../models/sensor.model.js";

export const getSensorData = async (req, res) => {
  try {
    const sensorData = await SensorCol.find();
    const resObj = {
      is_success: true,
      data: sensorData,
      message:
        sensorData.length > 0
          ? "Sensor data list is here"
          : "Sensor data not available",
    };

    res.status(200).json(resObj);
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "Unable to retrieve sensor data",
    });
  }
};

export const updateActionState = async (req, res) => {
  const { currentState } = req.body;
  const { sensor_id } = req.params;

  // console.log("current state is : ", currentState);

  if (currentState === undefined || !sensor_id) {
    return res.status(400).json({
      is_success: false,
      error_code: "INVALID_REQUEST",
      error_message: "Invalid request: Missing required fields.",
      details: {
        sensor_id: sensor_id || "Not provided as params in url",
        currentState: currentState || "Not provided",
      },
    });
  }

  try {
    const updatedSensor = await SensorCol.findByIdAndUpdate(
      sensor_id,
      {
        $set: { "action.current_status": currentState },
      },
      { new: true }
    );

    // Case where sensor is not found
    if (!updatedSensor) {
      return res.status(404).json({
        is_success: false,
        error_code: "SENSOR_NOT_FOUND",
        error_message: `No sensor found with ID: ${sensor_id}`,
      });
    }

    res.status(200).json({
      is_success: true,
      data: updatedSensor,
      message: "Sensor action state updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "An error occurred while updating the sensor document",
    });
  }
};

export const updateSensorData = async (req, res) => {
  const { sensorData, battery, timestamp } = req.body;
  const { sensor_id } = req.params;
  const errObj = {};
  if (!battery) {
    errObj["battery"] = "Not provided";
  }
  if (!sensor_id) {
    errObj["sensor_id"] = "Not provided as params in url";
  }
  if (!timestamp) {
    errObj["timestamp"] = "Not provided";
  }
  if (Object.keys(sensorData).length === 0) {
    errObj["sensorData"] = "Data object have no data";
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
    const updateSensorDataRes = await SensorCol.findByIdAndUpdate(
      sensor_id,
      {
        $set: {
          data: { ...sensorData },
          battery: parseInt(battery),
          updated_at: timestamp,
        },
      },
      { new: true }
    );

    if (!updateSensorDataRes) {
      return res.status(404).json({
        is_success: false,
        error_code: "SENSOR_NOT_FOUND",
        error_message: `No sensor found with ID: ${sensor_id}`,
      });
    }

    res.status(200).json({
      is_success: true,
      data: updateSensorDataRes,
      message: "Sensor data updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "An error occurred while updating the sensor data",
    });
  }
};
// temporary post route
export const addNewSensor = async (req, res) => {
  const sensorData = req.body.sensorData;
  try {
    // const sensor = {
    //   type: "manoj",
    //   location: "Warehouse",
    //   status: true,
    //   action: {
    //     has_action: true,
    //     currentState: false,
    //     threshold: "",
    //   },
    //   data: {},
    // };
    // console.log("sensor data is here :", sensorData);

    const newSensor = new SensorCol({
      ...sensorData,
    });

    const addSensorRes = await newSensor.save();
    res.status(200).json({
      is_success: true,
      data: addSensorRes,
      message: "New Sensor added successfully in DB",
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "Error while adding new sensor to DB",
    });
  }
};
