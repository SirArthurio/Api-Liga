import mongoose from "mongoose";
import { uploadImg, deleteImg } from "../../utils/Cloudinary.js";
import fs from "fs-extra";
import { BaseUser } from "./BaseUser.models.js";

const adminSchema = new mongoose.Schema({});

export const Administrador = BaseUser.discriminator(
  "Administrador",
  adminSchema
);
export const GetUsers = async (req, res) => {
  try {
   const user = await BaseUser.find();
    if (!user || user.length === 0) {
      return res.status(404).json({ Message: "No hay usuarios", status: 404 });
    }
     res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el Usuario model", error:error });
  }
};
export const GetUser = async (req, res) => {
  try {
    const { document } = req.params;
    const encontrado = await BaseUser.findOne(document);
    if (!encontrado) {
      return res
        .status(404)
        .json({ Message: "No se encontro el usuario", Status: "404" });
    }
    return res.status(200).json(encontrado);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el usuario",
      Error: error,
      Status: "500",
    });
  }
};
export const CreateAdmin = async (req, res) => {
  try {
    const {
      name,
      levelUser,
      user,
      documentType,
      document,
      birthdate,
      password,
    } = req.body;

    const newUser = new Administrador({
      name,
      levelUser,
      user,
      documentType,
      document,
      birthdate,
      password,
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

     fs.unlinkSync(req.files.img.tempFilePath);
    await newUser.save();
    res
      .status(201)
      .json({ message: "Se creo el usuario con exito", Status: "201" });
    console.log(newUser);
  } catch (error) {
    console.log(req.body);
    console.log(newUser);
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

export const DeleteUser = async (req, res) => {
  try {
    const { document } = req.params;
    const deleteUser = await BaseUser.findOneAndDelete(document);

    if (!deleteUser) {
      return res
        .status(404)
        .json({ message: "el usuario no se ha  encontrado", status: 404 });
    }
    if (deleteUser.img?.public_id) {
      deleteImg(deleteUser.img.public_id);
    }
    res.json({ message: "el usuario ha sido eliminado", status: 200 });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al eliminar el Administrador",
        error: error,
        status: 500,
      });
  }
};
