import { Router } from "express";
import {
  createAdmin,
  getUsers,
  deleteUser,
  getUser,
} from "../../controllers/Users/Admin.controler.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get("/user", getUser);
router.get("/users", getUsers);

router.post(
  "/register",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "../uploads",
  }),
  createAdmin
);

router.delete("/delete", deleteUser);
export default router;
