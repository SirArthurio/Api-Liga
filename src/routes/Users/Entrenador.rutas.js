import { Router } from "express";
import {
  createEntrenador,
  getAtletaEntrenador,
  getEntrenador,
  getAtletasEntrenador,
  deleteEntrenador,
  deleteAtletaEntrenador,
  addAtletaEntrenador,
  getEntrenadores, updateEntrenador
} from "../../controllers/Users/Entrenador.controler.js";
import fileUpload from "express-fileupload";
import {updateAtleta} from "../../controllers/Users/Atleta.controler.js";

const router = Router();
router.get("/entrenadores", getEntrenadores);
router.get("/entrenadores/:id?", getEntrenador);
router.get("/atleta", getAtletaEntrenador);
router.get("/atletas", getAtletasEntrenador);

router.post(
  "/entrenadores",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "../uploads",
  }),
  createEntrenador
);

router.put("/entrenadores/:id?", updateEntrenador);
router.put("/entrenadores/atletas/",addAtletaEntrenador);
router.delete("/entrenadores/atletas/delete", deleteAtletaEntrenador);

router.delete("/entrenadores", deleteEntrenador);

export default router;
