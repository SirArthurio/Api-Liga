import mongoose from "mongoose";
import { BaseUser } from "./BaseUser.models.js";
import { uploadImg, deleteImg } from "../../utils/Cloudinary.js";
import fs from "fs-extra";
import { Entrenador } from "./Entrenador.model.js";
const athleteSchema = new mongoose.Schema(
  {
    sport: {
      type: [String],
      required: [true, "El deporte es obligatorio"],
    },
    coach: [
      {
        type: Number,
        ref: "Entrenador",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const Atleta = BaseUser.discriminator("Atleta", athleteSchema);

export const GetAtletas = async (req, res) => {
  try {
    const user = await Atleta.find();
    if (!user || user.length === 0) {
      return res
        .status(404)
        .json({ message: "Atletas no encontrados o no hay", status: "404" });
    }
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener Atletas",
      error: error,
      status: "500",
    });
  }
};

export const CreateAtleta = async (req, res) => {
  try {
    const {
      name,
      user,
      password,
      levelUser,
      documentType,
      document,
      birthdate,
      coach,
      sport,
    } = req.body;

    const newUser = new Atleta({
      name,
      user,
      password,
      levelUser,
      documentType,
      document,
      birthdate,
      coach,
      sport,
    });

    if (req.files?.img) {
      const result = await uploadImg(req.files.img.tempFilePath);
      newUser.img = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
    } else {
      console.log("No se ha recibido ninguna imagen.");
    }
    const entrenador = await Entrenador.findOne({ document: coach });
    if (!entrenador) {
      return res.status(404).json({
        message:
          "Entrenador no encontrado, por favor verifica el documento del entrenador",
        Status: "404",
      });
    }
    entrenador.athletes.push(newUser.document);
    await entrenador.save();

    await fs.unlinkSync(req.files.img.tempFilePath);
    await newUser.save();
    res.status(201).json({ message: "se creo el nuevo atleta", status: 201 });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el atleta", error: error, status: 500 });
  }
};
export const DeleteAtleta = async (req, res) => {
  try {
    const { document } = req.body;
    const atleta = await Atleta.findOne({ document: document });
    if (!atleta) {
      return res
        .status(404)
        .json({ message: "Atleta no encontrado", status: 404 });
    }
    if (atleta.img?.public_id) {
      await deleteImg(atleta.img.public_id);
    }
    await Entrenador.updateMany(
      { athletes: atleta.document },
      { $pull: { athletes: atleta.document } }
    );
    await atleta.deleteOne();

    res.status(200).json({
      message: "Atleta eliminado junto con sus referencias en los entrenadores",
      status: 200,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el Atleta",
      error: error.message,
      status: 500,
    });
  }
};
//
export const UpdateAtleta = async (req, res) => {
  try {
    const { document, name, documentType, password, sport } = req.body;
    const updateAtleta = await Atleta.findOneAndUpdate(
      { document },
      { name, documentType, password, sport },
      { new: true, runValidators: true }
    );
    if (!updateAtleta) {
      return res.status(404).json({
        message: "Atleta no encontrado",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Atleta actualizado exitosamente",
      atleta: updateAtleta,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el atleta",
      error: error,
      status: 500,
    });
  }
};

export const GetAtleta = async (document, res) => {
  try {
    if (!document) {
      return res
        .status(404)
        .json({ message: "y el documento?", status: "404" });
    }
    const user = await Atleta.findOne({ document });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Atleta no encontrado", status: 404 });
    }
    const { password, ...userWithoutPassword } = user.toObject();

    return res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el Atleta",
      error: error,
      status: 500,
    });
  }
};

export const AddSportAtleta = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { sport } = req.body;
    const atleta = await Atleta.findById(usuario_id);
    if (!atleta) {
      return res
        .status(404)
        .json({ message: "Atleta no encontrado", Status: "404" });
    }
    const deporteExiste = atleta.sport.includes(sport);
    if (deporteExiste) {
      return res.status(400).json({
        message: "El deporte ya está agregado al atleta",
        Status: "400",
      });
    }
    atleta.sport.push(sport);
    await atleta.save();

    res.status(200).json({
      message: "deporte agragado al Atleta agregado con éxito",
      Status: "200",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar el deporte",
      error: error.message,
      Status: "500",
    });
  }
};
//
export const DeleteSportAtleta = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { sport } = req.body;

    const atleta = await Atleta.findById(usuario_id);
    if (!atleta) {
      return res
        .status(404)
        .json({ message: "Atleta no encontrado", Status: "404" });
    }

    if (!Array.isArray(atleta.sport)) {
      return res.status(400).json({
        message: "No hay deportes asociados al atleta",
        Status: "400",
      });
    }

    const deporteExiste = atleta.sport.includes(sport);
    if (!deporteExiste) {
      return res.status(404).json({
        message: "Deporte no encontrado en la lista del atleta",
        Status: "404",
      });
    }
    atleta.sport = atleta.sport.filter((deporte) => deporte !== sport);
    await atleta.save();

    res.status(200).json({ message: "Deporte eliminado", Status: "200" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el deporte",
      error: error.message,
      Status: "500",
    });
  }
};
