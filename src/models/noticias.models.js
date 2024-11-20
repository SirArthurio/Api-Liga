import mongoose from "mongoose";
import fs from "fs-extra";
import { uploadImg, deleteImg } from "../utils/Cloudinary.js";

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "La categoria es obligatoria"],
    },
    img: [
      {
        public_id: {
          type: String,
        },
        secure_url: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Noticia = mongoose.model("Noticia", eventSchema);

export const ObtenerNoticias = async () => {
  try {
    const noticias = await Noticia.find();
    return noticias;
  } catch (error) {
    throw new Error("Error al obtener la noticia");
  }
};

export const ObtenerNoticia = async (id) => {
  try {
    const noticia = await Noticia.findById(id);
    return noticia;
  } catch (error) {
    throw new Error("Error al obtener la noticia");
  }
};

export const CrearNoticia = async (req, res) => {
  try {
    const { name, date, description, category } = req.body;
    const noticia = new Noticia({
      name,
      date,
      description,
      category,
    });

    if (req.files?.img) {
      const result = await uploadImg(req.files.img.tempFilePath);
      noticia.img = {
        event_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.unlink(req.files.img.tempFilePath);
      console.log("Archivo temporal eliminado:", req.files.img.tempFilePath);
    } else {
      console.log("No se ha recibido ninguna imagen.");
    }

    await noticia.save();
    console.log("Noticia guardada:", noticia);
  } catch (error) {
    console.error("Error al crear la noticia:", error);
    return res
      .status(500)
      .json({ message: "Error al crear la noticia", error: error.message });
  }
};
export const actualizarNoticia = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, description, category } = req.body;

    const updateNoticias = await Noticia.findByIdAndUpdate(
      id,
      { name, date, description, category },
      { new: true }
    );
    console.log(updateNoticias);
    if (!updateNoticias) {
      return res.status(404).json({ message: "Noticia no encontrado" });
    }
    res.json(updateNoticias);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar la noticia", error });
  }
};

export const eliminarNoticia = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedNoticias = await Noticia.findByIdAndDelete(id);

    if (!deletedNoticias) {
      return res.status(404).json({ message: "Noticia no encontrada" });
    }
    if (Noticia.image?.public_id) {
      deleteImg(Noticia.image.public_id);
    }
    res.json({ message: "Noticia eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la noticia", error });
  }
};
