import { Router } from "express";
import {
  getProductsCarrito,
  addToCarrito,
  updateProductsCarrito,
  deleteProductsCarrito,
} from "../controllers/Carrito.controler.js";

const router = Router();

router.get("/carrito", getProductsCarrito);
router.post("/carrito", addToCarrito);
router.put("/carrito/:_id?", updateProductsCarrito);
router.delete("/carrito/:_id?",deleteProductsCarrito);

export default router;
