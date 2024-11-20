import mongoose from "mongoose";
import { uploadImg, deleteImg } from "../utils/Cloudinary.js";
import fs from "fs-extra";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      default: 0,
      min: [0, "El precio no puede ser negativo"],
    },
    stock: {
      type: Number,
      min: [0, "el stock no puede ser negativo"],
    },
    size: {
      type: [String],
    },
    img: [
      {
        public_id: String,
        secure_url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);

export const GetProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener productos", error });
  }
};

export const GetProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado", "STATUS":404});
    }
    return res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto", error });
  }
};

export const CreateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, size } = req.body;

    const product = new Product({
      name,
      description,
      price,
      stock,
      size,
    });

    if (req.files?.img) {
      const result = await uploadImg(req.files.img.tempFilePath);
      product.img = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    } else {
      console.log("No se ha recibido ninguna imgn.");
    }

     fs.unlinkSync(req.files.img.tempFilePath);

    await product.save();
    res.status(201).json(product);
    console.log(product);
  } catch (error) {
    console.log(req.body);
    res
      .status(500)
      .json({ message: "Error al crear el producto en modelo", error });
  }
};
export const UpdateProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, size } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, stock, size },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
};
export const DeleteProducts = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    if (deletedProduct.img?.public_id) {
      deleteImg(deletedProduct.img.public_id);
    }
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto", error });
  }
};
