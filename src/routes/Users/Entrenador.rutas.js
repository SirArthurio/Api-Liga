import { Router } from "express";
import {
  createEntrenador,
  getAtletaEntrenador,
  getEntrenador,
  getAtletasEntrenador,
  deleteEntrenador,
  deleteAtletaEntrenador,
  addAtletaEntrenador,
  getEntrenadores
} from "../../controllers/Users/Entrenador.controler.js";
import fileUpload from "express-fileupload";

const router = Router();
router.get("/users", getEntrenadores);
router.get("/user", getEntrenador);
router.get("/atleta", getAtletaEntrenador);
router.get("/atletas", getAtletasEntrenador);

router.post(
  "/register",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "../uploads",
  }),
  createEntrenador
);

router.put("/atleta/add",addAtletaEntrenador);
router.put("/atleta/delete", deleteAtletaEntrenador);

router.delete("/delete", deleteEntrenador);

export default router;
