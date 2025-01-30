import bcrypt from "bcrypt";
import envVariable from "../config/envVariables.js";
import UserCol from "../models/user.model.js";
import { checkValidEmail } from "../utils/function.js";
import { generateJwtToken } from "../utils/jwt.utils.js";

export const visitorSignup = async (req, res) => {
  const { name, email, password } = req.body;
  // Data validation
  const errorObj = {};
  if (!name || name.trim().length === 0) {
    errorObj["name"] = "Not provided";
  } else if (name.length < 5) {
    errorObj["name"] = "Name should contain minimum 5 character";
  }
  if (!email || email.trim().length === 0) {
    errorObj["email"] = "Not provided";
  }
  if (!password || password.trim().length === 0) {
    errorObj["password"] = "Not provided";
  }
  if (Object.keys(errorObj).length > 0) {
    return res.status(400).json({
      is_success: false,
      error_code: "REQUIRED_FIELD_MISSING",
      error_message: "Required fields to proceed request are missing.",
      details: {
        ...errorObj,
      },
    });
  }
  try {
    // here goes sign up logic
    const isValidEmail = checkValidEmail(email);
    if (!isValidEmail) {
      return res.status(400).json({
        is_success: false,
        error_code: "EMAIL_NOT_VALID",
        error_message: "Email is not valid, please provide a valid email.",
      });
    }
    // hash the password
    const saltRound = parseInt(envVariable.BCRYPT_SALT_ROUND);
    const hashedPassword = await bcrypt.hash(password, saltRound);

    // create new user doc and save info
    const newUser = new UserCol({
      name: name,
      email: email,
      password: hashedPassword,
    });
    const newUserRes = await newUser.save();

    // Generate and save JWT token
    const payload = {
      _id: newUserRes._id,
      name: newUserRes.name,
      email: newUserRes.email,
      role: newUserRes.role,
    };
    const token = generateJwtToken(payload);
    const updatedRes = await UserCol.findByIdAndUpdate(
      newUserRes._id,
      { $set: { token: token } },
      { new: true }
    );
    // TODO - project on fields that are not required

    return res.status(201).json({
      is_success: true,
      data: updatedRes,
      message: "User created successfully",
    });
  } catch (error) {
    // mongoose error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        is_success: false,
        error_code: "USER_ALREADY_EXIST",
        error_message: error.message,
        message: `${field} must be unique. The provided value ${error.keyValue[field]} is already taken`,
      });
    }

    res.status(500).json({
      is_success: false,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "Error while creating user",
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Data validation
  const errorObj = {};
  if (!email || email.trim().length === 0) {
    errorObj["email"] = "Not provided";
  }
  if (!password || password.trim().length === 0) {
    errorObj["password"] = "Not provided";
  }
  if (Object.keys(errorObj).length > 0) {
    return res.status(400).json({
      is_success: false,
      error_code: "REQUIRED_FIELD_MISSING",
      error_message: "Required fields to proceed request are missing.",
      details: {
        ...errorObj,
      },
    });
  }
  try {
    // validate email
    if (!checkValidEmail(email))
      return res.status(400).json({
        is_success: false,
        error_code: "EMAIL_NOT_VALID",
        error_message:
          "Provided email is not a valid email, Please check your email and try again",
      });

    const user = await UserCol.findOne({ email });
    if (!user) {
      return res.status(404).json({
        is_success: false,
        error_code: "USER_NOT_FOUND",
        error_message:
          "Not validated as a registered user. Please log in with a registered account.",
      });
    }

    // Password
    console.log(
      "password : " + password + " hashed password : " + user.password
    );
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        is_success: false,
        error_code: "INCORRECT_PASSWORD",
        error_message:
          "Provided password is incorrect, Please check password and try again",
      });
    }

    // generate new JWT token and store
    const payload = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    const token = generateJwtToken(payload);
    const updatedUserRes = await UserCol.findByIdAndUpdate(
      user._id,
      { $set: { token } },
      { new: true }
    );

    return res.status(200).json({
      is_success: true,
      data: updatedUserRes,
      message: "User logged in successfully",
    });
  } catch (error) {
    res.status(500).json({
      is_success: false,
      error_code: "INTERNAL_SERVER_ERROR",
      error_message: error.message,
      message: "Error while logging in to your account",
    });
  }
};
