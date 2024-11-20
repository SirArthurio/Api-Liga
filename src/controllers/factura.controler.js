import mongoose from "mongoose";
import {
  CrearFactura,
  GetFacturas,
  GetFactura,
  GetFacturaUser,
} from "../models/factura.model.js";
import { BaseUser } from "../models/Users/BaseUser.models.js";
import { GetProductsCarrito } from "../models/carrito.model.js";
import { Administrador } from "../models/Users/Admin.model.js";
import { Product } from "../models/products.models.js";

export const getFactura = async (req, res) => {
  try {
    const { document } = req.body;
    if (!document) {
      return res
        .status(404)
        .json({ message: "El documento es obligatorio", status: 404 });
    }
    const user = await BaseUser.findOne({ document: document });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const userId = user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "El ID de usuario no es válido" });
    }
    await GetFactura(userId, res);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el carrito/controlador",
      error: error.message,
      status: 500,
    });
  }
};

//

export const getFacturas = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    if (!usuario_id) {
      return res.status(404).json({ message: "logueate compae", status: 404 });
    }
    const admin = await Administrador.findById(usuario_id);
    if (!admin) {
      return res
        .status(404)
        .json({ message: "No tienes permiso de administrador", status: 404 });
    }
    await GetFacturas(res);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error Al obtener las facturas",
        error: error,
        status: 500,
      });
  }
};
//
export const crearFactura = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    if (!usuario_id) {
      return res.status(401).json({
        message: "Debes estar logueado para realizar esta acción.",
        status: 401,
      });
    }
    const carro = await GetProductsCarrito(usuario_id);
    if (!carro || carro.length === 0) {
      return res.status(400).json({
        message: "El carrito está vacío o no se encontró.",
      });
    }
    for (const item of carro) {
      const producto = await Product.findById(item.product_id);

      if (!producto) {
        return res.status(404).json({
          message: `Producto con ID ${item.product_id} no encontrado.`,
        });
      }

      if (producto.stock < item.amount) {
        return res.status(400).json({
          message: `Stock insuficiente para el producto ${producto.name}. Disponible: ${producto.stock}, solicitado: ${item.amount}`,
        });
      }
    }

    await CrearFactura(usuario_id, res);
    return res
    .status(201)
    .json({ message: "Factura creada con éxito", status:201 });
  } catch (error) {
    console.error("Error al crear la factura:", error);
    res.status(500).json({
      message: "Ocurrió un error en el servidor al crear la factura.",
      error: error.message,
    });
  }
};

//
export const getFacturaUser = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    if (!usuario_id) {
      return res.status(404).json({ message: "logueate compae", status: 404 });
    }
    await GetFacturaUser(usuario_id, res);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error Al obtener las facturas",
        error: error,
        status: 500,
      });
  }
};
