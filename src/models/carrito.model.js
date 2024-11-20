import mongoose from "mongoose";

const carritoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BaseUser",
      required: [true, "el id de usuario es obligatorio"],
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "el id del producto es obligatorio"],
    },
    size: { type: String,  required: [true, "la talla del producto es obligatorio"], },
    amount: {
      type: Number,
      default: 0,
      min: [0, "La cantidad no puede ser menor a 0"],
    },
  },
  {
    timestamps: true,
  }
);
export const Carrito = mongoose.model("Carrito", carritoSchema);

export const GetProductsCarrito = async (usuario_id) => {
  try {
    const carrito = await Carrito.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(usuario_id) } },
      {
        $lookup: {
          from: "products",
          localField: "product_id",
          foreignField: "_id",
          as: "Producto",
        },
      },
      { $unwind: "$Producto" },
      {
        $project: {
          userId: 1,
          _id: 1,
          size:1,
          product_id: 1,
          amount: 1,
          Producto: {
            name: 1,
            price: 1,
            img: 1,
          },
          subTotal: { $multiply: ["$amount", "$Producto.price"] },
        },
      },
    ]);

    return carrito;
  } catch (error) {
    return res.status(500).json({
      messsage: "error al buscar el carrito",
      status: 500,
      error: error,
    });
  }
};

export const AddToCarrito = async (req, res) => {
  try {
    const { product_id, amount, size } = req.body;
    const { usuario_id } = req.session;

    // Verificar si el usuario está logueado
    if (!usuario_id) {
      return res.status(401).json({
        success: false,
        message: "Debes estar logueado para agregar productos al carrito.",
      });
    }

    const userId = usuario_id;
    if (!product_id || !amount || !size) {
      return res.status(400).json({
        success: false,
        message:
          "Todos los campos (product_id, amount, size) son obligatorios.",
      });
    }
    const existe = await Carrito.findOne({ userId, product_id, size });

    if (existe) {
      const updatedCarrito = await Carrito.findByIdAndUpdate(
        existe._id,
        { $inc: { amount: amount } },
        { new: true }
      );

      return res.status(200).json({
        success: true,
        message: "Cantidad del producto actualizada en el carrito.",
        carrito: updatedCarrito,
      });
    }
    const carrito = new Carrito({
      userId,
      product_id,
      amount,
      size,
    });

    await carrito.save();

    return res.status(201).json({
      success: true,
      message: "Producto agregado al carrito.",
      carrito,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);

    return res.status(500).json({
      success: false,
      message: "Error al agregar el producto al carrito.",
      error: error.message,
    });
  }
};

export const UpdateProductsCarrito = async (req, res) => {
  try {
    const { _id } = req.params;
    const { amount } = req.body;

    const updateProductsCarrito = await Carrito.findByIdAndUpdate(
      _id,
      { amount: amount },
      { new: true }
    );

    if (!updateProductsCarrito) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(updateProductsCarrito);
    res.json(uptadeamount);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto", error });
  }
};

export const DeleteProductsCarrito = async (req, res) => {
  try {
    const { _id } = req.params;
    const deleteProductsCarrito = await Carrito.findByIdAndDelete(_id);

    if (!deleteProductsCarrito) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto", error });
  }
};
