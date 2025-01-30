import UserCol from "../models/user.model.js";
import { verifyJwtToken } from "../utils/jwt.utils.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // console.log("auth header :", authHeader);
  // console.log("token :", token);
  // console.log("RAW req headers :", req.headers);

  if (!token)
    return res.status(401).json({
      is_success: false,
      error_code: "UNAUTHORIZED_USER",
      error_message: "No authorization token was found.",
    });

  try {
    const verifyTokenResponse = verifyJwtToken(token);
    // JWT token validation
    if (!verifyTokenResponse.isVerifiedJWT) {
      if (verifyTokenResponse.error_message === "TOKEN_INVALID")
        return res.status(403).json({
          is_success: false,
          error_code: verifyTokenResponse.error_message,
          error_message:
            "Invalid authentication token. Please provide a valid token or log in again to obtain a new token",
        });
      else if (verifyTokenResponse.error_message === "TOKEN_EXPIRED")
        return res.status(403).json({
          is_success: false,
          error_code: verifyTokenResponse.error_message,
          error_message:
            "Authorization token expired. Please log in to obtain a new token.",
        });
    }
    // console.log("verify token response : ", verifyTokenResponse);
    const payloadData = verifyTokenResponse.data;
    const userDataRes = await UserCol.findById(payloadData._id);

    if (!userDataRes)
      return res.status(404).json({
        is_success: false,
        error_code: "USER_NOT_FOUND", // in front end when receive  user not found - alert not validated as a registered user or removed by admin, Please login with a registered account
        error_message:
          "Not validated as a registered user. Please log in with a registered account.",
      });

    req.userId = payloadData._id;
    req.userRole = payloadData.role;
    next();
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "Error while authenticating user in middleware",
    });
  }
};

export default authMiddleware;
