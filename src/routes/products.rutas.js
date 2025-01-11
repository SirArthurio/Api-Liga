import { Router } from "express";
import {
  getProducts,
  createProducts,
  updateProducts,
  deleteProducts,
  getProduct,
} from "../controllers/productos.controler.js";
import fileUpload from "express-fileupload";

const router = Router();

router.get("/productos", getProducts);
router.get("/productos/:id?", getProduct);

router.post("/productos",
              fileUpload({
                useTempFiles: true,
                tempFileDir: "./uploads",
              }),createProducts);

router.put("/productos/:id?", updateProducts);
router.delete("/productos/:id?", deleteProducts);

export default router;
