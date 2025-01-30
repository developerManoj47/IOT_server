import jwt from "jsonwebtoken";
import envVariable from "../config/envVariables.js";

export const generateJwtToken = (userInfo) => {
  const payload = { ...userInfo };
  const options = {
    expiresIn: "1w",
  };
  const token = jwt.sign(payload, envVariable.JWT_SECRET_KEY, options);
  return token;
};

export const verifyJwtToken = (token) => {
  try {
    const decodedPayload = jwt.verify(token, envVariable.JWT_SECRET_KEY);

    return {
      isVerifiedJWT: true,
      data: decodedPayload,
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return {
        isVerifiedJWT: false,
        error_message: "TOKEN_EXPIRED",
      };
    } else {
      return {
        isVerifiedJWT: false,
        error_message: "TOKEN_INVALID",
      };
    }
  }
};
