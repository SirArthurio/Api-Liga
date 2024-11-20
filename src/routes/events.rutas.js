import { Router } from "express";
import {
  getEvents,
  getEvent,
  createEvents,
  updateEvents,
  deleteEvents,
  addAtletaEvento,
  deleteAtletaEvento,
  getAtletasEvento
} from "../controllers/events.controler.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get(["/", "/eventos"], getEvents);
router.get('/eventos/evento/:id?', getEvent);
router.get('/atletas/eventos/evento/:id?', getAtletasEvento);

router.post(
  "/eventos",
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./uploads",
  }),
  createEvents,
);

router.put("/eventos/:id?", updateEvents);
router.put('/atleta/add/eventos/evento/:id?', addAtletaEvento);
router.put('/atleta/delete/eventos/evento/:id?', deleteAtletaEvento);

router.delete("/eventos/:id?", deleteEvents);

export default router;
