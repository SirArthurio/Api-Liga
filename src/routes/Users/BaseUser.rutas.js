import { Router } from "express";
import {
  login,
  logout,
  check,
} from "../../controllers/Users/BaseUser.controler.js";
import { Check } from "../../models/Users/BaseUser.models.js";

const router = Router();
router.post("/login", login);
router.post("/logout", logout);
router.get("/user/check-session", Check);
export default router;
