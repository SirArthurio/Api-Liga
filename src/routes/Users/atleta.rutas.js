import { Router } from "express";
import {
  createAtleta,
  getAtleta,
  getAtletas,
  updateAtleta,
  deleteAtleta,
  addSportAtleta,
  deleteSportAtleta
} from "../../controllers/Users/Atleta.controler.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get("/user", getAtleta);
router.get("/users", getAtletas);

router.put("/update", updateAtleta);
router.put("/sport/add", addSportAtleta);
router.put("/sport/delete", deleteSportAtleta);

router.post(
  "/register",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "../uploads",
  }),
  createAtleta
);

router.delete("/delete", deleteAtleta);
export default router;
