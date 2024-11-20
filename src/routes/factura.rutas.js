import { Router } from "express";
import { getFacturas, crearFactura,getFacturaUser,getFactura } from "../controllers/factura.controler.js";

const router = Router();

router.get("/getuser", getFacturaUser);
router.get("/getall", getFacturas);
router.get("/get", getFactura);
router.post("/create", crearFactura);

export default router;
