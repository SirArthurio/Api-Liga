import mongoose from "mongoose";
import { Product } from "../models/products.models.js";
import {
  GetProductsCarrito,
  AddToCarrito,
  UpdateProductsCarrito,
  DeleteProductsCarrito,
} from "../models/carrito.model.js";

export const getProductsCarrito = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    if (!mongoose.Types.ObjectId.isValid(usuario_id)) {
      return res
        .status(400)
        .json({
          message: "El ID de usuario no es válido",
          usuario: usuario_id,
        });
    }
    const carrito = await GetProductsCarrito(usuario_id);

    if (!carrito || carrito.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron productos en el carrito" });
    }

    return res.json(carrito);
  } catch (error) {
    console.error("Error al obtener el carrito:", error.message || error);
    res
      .status(500)
      .json({ message: "Error al obtener el carrito/controlador" });
  }
};

export const addToCarrito = async (req, res) => {
  try {
    console.log("Sesión creada:", req.session);
    const { product_id, amount } = req.body;
    const product = await Product.findById(product_id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const { stock } = product;

    if (amount > stock) {
      return res
        .status(400)
        .json({ message: "No hay suficiente stock para agregar" });
    }
    await AddToCarrito(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: " error al agregar al carrito/controlador" });
  }
};

export const updateProductsCarrito = async (req, res) => {
  try {
    const { amount, product_id } = req.body;
    const product = await Product.findById(product_id);
    const { stock } = product;

    if (amount > stock) {
      return res
        .status(400)
        .json({ message: "no hay suficiente stock para agrgar" });
    }
    await UpdateProductsCarrito(req, res);
  } catch (error) {}
};

export const deleteProductsCarrito = async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) {
      return res.status(404).json({ message: "compae y la id pa cuando? " });
    }
    await DeleteProductsCarrito(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el producto del carrito/Controlador",
    });
  }
};
