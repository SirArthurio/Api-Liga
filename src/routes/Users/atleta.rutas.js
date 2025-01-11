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

router.get("/atletas", getAtletas); // ?idEntrenador=:idEntrenador?&idAtleta=:idAtleta?
router.get("/atletas/atleta", getAtleta);
// router.get("/atletas", getAtletas);
// router.get("/entrenadores/:id?/atletas/:id?", getAtletaEntrenador);
// router.get("/entrenadores/:id?/atletas", getAtletasEntrenador);


router.put("/atletas/:id?", updateAtleta);
router.put("/atletas/:id?/deportes", addSportAtleta);
router.delete("/atletas/:id?/deportes/:id?", deleteSportAtleta);


router.post(
  "/atletas",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "../uploads",
  }),
  createAtleta
);

router.delete("/atletas", deleteAtleta);
export default router;
