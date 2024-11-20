import { Router } from "express";
import { login,logout ,check } from "../../controllers/Users/BaseUser.controler.js";


const router = Router();
router.post("", login);
router.post("/logout",logout);
router.get('/check-session', check);
export default router;
