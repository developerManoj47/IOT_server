import e from "express";
import {
  getAction,
  updateStatusOfAction,
} from "../controllers/action.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/admin.middleware.js";

const router = e.Router();

router.route("/action").get(getAction);
router
  .route("/action/:action_id")
  .patch(authMiddleware, adminMiddleware, updateStatusOfAction);

export default router;
