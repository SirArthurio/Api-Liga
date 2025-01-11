import mongoose from "mongoose";
import { BaseUser } from "./BaseUser.models.js";
import { Atleta } from "./Atleta.model.js";
import { uploadImg, deleteImg } from "../../utils/Cloudinary.js";
import fs from "fs-extra";

const coachSchema = new mongoose.Schema({
  athletes: [
    {
      type: Number,
      ref: "Atleta",
      required: false,
    }
  ],
});

export const Entrenador = BaseUser.discriminator("Entrenador", coachSchema);
//
export const CreateEntrenador = async (req, res) => {
  try {
    const {
      name,
      levelUser,
      user,
      documentType,
      document,
      birthdate,
      password,
      athletes,
    } = req.body;

    const newUser = new Entrenador({
      name,
      levelUser,
      user,
      documentType,
      document,
      birthdate,
      password,
      athletes,
    });

  
    if (req.files?.img) {
      const result = await uploadImg(req.files.img.tempFilePath);
      newUser.img = {
        public_id: result.public_id,
        secure_url: result.secure_url,
      };
      fs.unlinkSync(req.files.img.tempFilePath);
    } else {
      console.log("No se ha recibido ninguna imagen.");
    }

    await newUser.save();
    res
      .status(201)
      .json({ message: "Se creo el nuevo entrenador", Status: "201" });
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el entrenador modelo",
      error: error,
      Status: "500",
    });
  }
};
///

export const UpdateEntrenador = async (req, res) => {
  try {
    const { document, name, documentType, password, sport } = req.body;
    const updateEntrenador = await Atleta.findOneAndUpdate(
        { document },
        { name, documentType, password, sport },
        { new: true, runValidators: true }
    );
    if (!updateEntrenador) {
      return res.status(404).json({
        message: "Atleta no encontrado",
        status: 404,
      });
    }

    res.status(200).json({
      message: "Atleta actualizado exitosamente",
      atleta: updateEntrenador,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el atleta",
      error: error,
      status: 500,
    });
  }
};

export const GetAtletasEntrenador = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const entrenador = await Entrenador.findById(usuario_id)
    if (!entrenador) {
      return res.status(404).json({
        message: "Entrenador no encontrado",
        status: 404,
      });
    }
    const atletas = await Atleta.find({ document: { $in: entrenador.athletes } });
    return res.status(200).json({ atletas });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los atletas en entrenador",
      error,
      Status: "500",
    });
  }
};
///
export const GetEntrenador = async (req, res) => {
  try {
    const {id} = req.params;
    const user = await Entrenador.findById(id);
    if (!user || user.length === 0) {
      return res
        .status(404)
        .json({ message: "Entrenador no encontrado", Status: "404" });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el entrenador",
      error: error,
      Status: "500",
    });
  }
};
export const GetEntrenadores = async (req, res) => {
  try {
    const user = await Entrenador.find();
    if (!user || user.length === 0) {
      return res.status(404).json({
        message: "Entrenadores no encontrados o no hay",
        Status: "404",
      });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el entrenador",
      error: error,
      Status: "500",
    });
  }
};
///
export const GetAtletaEntrenador = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { document } = req.body;
    const entrenador = await Entrenador.findById(usuario_id)
    if (!entrenador) {
      return res.status(404).json({
        message: "Entrenador no encontrado",
        status: 404,
      });
    }
    const atletaExiste = entrenador.athletes.find((athleteDoc) => athleteDoc === Number(document));
    if (!atletaExiste) {
      return res.status(404).json({
        message: "Atleta no encontrado en la lista del entrenador",
        status: 404,
      });
    }

   const atletas = await Atleta.find({ document: atletaExiste});
    return res.status(200).json({ atletas });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el atleta en entrenador /controlador",
      status: 500,
      error: error,
    });
  }
};

///
export const DeleteEntrenador = async (req, res) => {
  try {
    const { documento } = req.body;
    const entrenador = await Entrenador.findOneAndDelete(documento);
    if (!entrenador) {
      return res
        .status(404)
        .json({ message: "el entrenador no se ha  encontrado", status: 404 });
    }
    if (entrenador.img?.public_id) {
      deleteImg(entrenador.img.public_id);
    }
    res.json({ message: "el usuario ha sido eliminado", status: 200 });
  } catch (error) {
    res.status(500).json({
      message: "error al eliminarl el entrenador",
      status: 500,
      error: error,
    });
  }
};
//
export const DeleteAtletaEntrenador = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { documentoAtleta } = req.body;
    const entrenador = await Entrenador.findById(usuario_id).populate(
      "athletes"
    );
    if (!entrenador) {
      return res
        .status(404)
        .json({ message: "Entrenador no encontrado", Status: "404" });
    }
    const atletaExiste = entrenador.athletes.some(
      (athlete) => athlete.document === documentoAtleta
    );
    if (!atletaExiste) {
      return res.status(404).json({
        message: "Atleta no encontrado en la lista del entrenador",
        Status: "404",
      });
    }
    entrenador.athletes = entrenador.athletes.filter(
      (athlete) => athlete.document !== documentoAtleta
    );
    await entrenador.save();

    res.status(200).json({ message: "Atleta eliminado de la lista", Status: "200" });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el atleta",
      error: error.message,
      Status: "500",
    });
  }
};
///
export const AddAtletaEntrenador = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { document } = req.body;
    const entrenador = await Entrenador.findById(usuario_id).populate(
      "athletes"
    );
    if (!entrenador) {
      return res
        .status(404)
        .json({ message: "Entrenador no encontrado", Status: "404" });
    }
    const atletaExiste = entrenador.athletes.some(
      (athlete) => athlete.document === document
    );
    if (atletaExiste) {
      return res.status(400).json({
        message: "El atleta ya está asignado a este entrenador",
        Status: "400",
      });
    }
    const atleta = await Atleta.findOne({ document: document });
    if (!atleta) {
      return res
        .status(404)
        .json({ message: "Atleta no encontrado", Status: "404" });
    }

    entrenador.athletes.push(atleta.document);
    await entrenador.save();

    res
      .status(200)
      .json({ message: "Atleta agregado con éxito", Status: "200" });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar el atleta",
      error: error.message,
      Status: "500",
    });
  }
};
