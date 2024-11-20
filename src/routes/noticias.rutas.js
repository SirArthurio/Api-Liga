import { Router } from "express";
import {
  getNoticias,
  createNoticias,
  updateNoticias,
  deleteNoticias,
  getNoticia,
} from "../controllers/noticias.controler.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get(["/", "/noticias"], getNoticias);

router.get("/noticias/noticia/:id?", getNoticia);

router.post(
  "/noticias",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  createNoticias,
);

router.put("/noticias/:id", updateNoticias);

router.delete("/noticias/:id?", deleteNoticias);

export default router;
