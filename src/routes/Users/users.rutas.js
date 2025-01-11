import { Router } from "express";
import {
  createUser,
  getUsers,
  deleteUser,
  getUser,
  updateUser,
  getUserPerfil,me
} from "../../controllers/Users/User.controler.js";
import fileUpload from "express-fileupload";

const router = Router();
router.get("/me", me);
router.get("/user", getUser);
router.get("/user/usuario", getUserPerfil);
router.get("/", getUsers);
router.put("/", updateUser);

router.post(
  "/register",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  createUser
);

router.delete("/", deleteUser);
export default router;
