import express from "express";
import {
  getBreachOfLast24Hours,
  postBreach,
} from "../controllers/breach.controller.js";
const router = express.Router();

router.route("/breach").get(getBreachOfLast24Hours).post(postBreach);

export default router;
