import ActionCol from "../models/action.model.js";

export const getAction = async (req, res) => {
  try {
    const actionRes = await ActionCol.find();
    return res.status(200).json({
      is_success: true,
      data: actionRes[0],
      message: "Action document fetched",
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
    });
  }
};
export const updateStatusOfAction = async (req, res) => {
  const { action_id } = req.params;
  const { currentStatus } = req.body;
  const errObj = {};
  if (currentStatus === undefined) {
    errObj["currentStatus"] = "Not provided";
  }
  if (!action_id) {
    errObj["action_id"] = "Not provided";
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
    const updateActionRes = await ActionCol.findByIdAndUpdate(
      action_id,
      { $set: { current_status: currentStatus } },
      { new: true }
    );

    return res.status(200).json({
      is_success: true,
      data: updateActionRes,
      message: "Document after updating of current status",
    });
  } catch (error) {
    return res.status(500).json({
      is_success: false,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "Error while updating the status of action",
    });
  }
};
