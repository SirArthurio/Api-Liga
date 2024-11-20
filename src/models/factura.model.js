import { GetProductsCarrito, Carrito } from "./carrito.model.js";
import mongoose from "mongoose";
import { Product } from "./products.models.js";
const { Schema } = mongoose;

const FacturaSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "Usuario", required: true },
  productos: [
    {
      product_id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  fecha: { type: Date, default: Date.now },
});

export default mongoose.model("Factura", FacturaSchema);

export const Factura = mongoose.model("Factura", FacturaSchema);

export const CrearFactura = async (usuario_id, res) => {
  try {
    const carro = await GetProductsCarrito(usuario_id);

    if (!carro || carro.length === 0) {
      return res.status(400).json({ message: "Carrito vacío o no encontrado" });
    }
    
    const totalFactura = carro.reduce(
      (total, item) => total + item.subTotal,
      0
    );

    const nuevaFactura = new Factura({
      userId: usuario_id,
      productos: carro.map((item) => ({
        product_id: item.product_id,
        name: item.Producto.name,
        price: item.Producto.price,
        amount: item.amount,
      })),
      total: totalFactura,
    });

    for (const item of carro) {
      await Product.findByIdAndUpdate(
        item.product_id,
        { $inc: { stock: -item.amount } },
        { new: true }
      );
    }

    await nuevaFactura.save();
    await Carrito.deleteMany({ userId: usuario_id });
   
  } catch (error) {
    console.error("Error al crear factura:", error);
    return res
      .status(500)
      .json({ message: "Error al crear la factura", error: error.message });
  }
};

export const GetFacturaUser = async (usuario_id, res) => {
  try {
    const facturas = await Factura.find({ userId: usuario_id })

    if (!facturas) {
      return res.status(404).json({
        message: "No se encontraron facturas para el usuario",
        status: "404",
      });
    }

    return res.json(facturas);
  } catch (error) {
    console.error("Error al obtener facturas:", error.message || error);

    if (!res.headersSent) {
      return res.status(500).json({
        message: "Error al obtener facturas",
        error: error.message || error,
      });
    }
  }
};

//
export const GetFactura = async (userId, res) => {
  try {
    const facturas = await Factura.findOne({ userId: userId });
    if (!facturas || facturas.length === 0) {
      return res.status(404).json({ message: "no hay factuas que mostrar" });
    }
    res.json(facturas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las facturas",
      error: error,
      status: 500,
    });
  }
};
//
export const GetFacturas = async (res) => {
  try {
    const facturas = await Factura.find();
    if (!facturas || facturas.length === 0) {
      return res.status(404).json({ message: "no hay factuas que mostrar" });
    }
    res.json(facturas);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener las facturas",
      error: error,
      status: 500,
    });
  }
};
