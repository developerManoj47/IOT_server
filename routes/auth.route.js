import express from "express";
import { login, visitorSignup } from "../controllers/auth.controller.js";
const router = express.Router();

router.route("/auth/signup").post(visitorSignup); // body - name , email, password
router.route("/auth/signin").post(login); // body - email, password

export default router;
