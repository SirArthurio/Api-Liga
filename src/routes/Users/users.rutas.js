import { Router } from "express";
import {
  createUser,
  getUsers,
  deleteUser,
  getUser,
  updateUser,
  getUserPerfil
} from "../../controllers/Users/User.controler.js";
import fileUpload from "express-fileupload";

const router = Router();

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
