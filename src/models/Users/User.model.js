import mongoose from "mongoose";
import { uploadImg, deleteImg } from "../../utils/Cloudinary.js";
import fs from "fs-extra";
import { BaseUser } from "./BaseUser.models.js";

const userSchema = new mongoose.Schema({});

export const Usuario = BaseUser.discriminator("Usuario", userSchema);
export const CreateUser = async (req, res) => {
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

    const newUser = new Usuario({
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
      newUser.img.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
      await fs.unlink(req.files.img.tempFilePath);
    }

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};
export const DeleteUser = async (req, res) => {
  try {
    const { document } = req.body;
    const deleteUser = await Usuario.findOneAndDelete(document);

    if (!deleteUser) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", status: 404 });
    }
    if (deleteUser.img?.public_id) {
      deleteImg(deleteUser.img.public_id);
    }
    res.json({ message: "Usuario eliminado", status: 200 });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el usuario",
      error: error,
      status: 500,
    });
  }
};

export const GetUser = async (req, res) => {
  try {
    const { document } = req.body;
    const user = await Usuario.findOne(document);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", status: 404 });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el Usuario",
      error: error,
      status: 500,
    });
  }
};
export const GetUserPerfil = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const id = usuario_id;
    const user = await BaseUser.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", status: 404 });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el Usuario",
      error: error,
      status: 500,
    });
  }
};
export const GetUsers = async (req, res) => {
  try {
    const user = await Usuario.find();
    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuarios no encontrados", status: 404 });
    }
    return res.json(user);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los Usuarios",
      error: error,
      status: 500,
    });
  }
};
export const UpdateUser = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const id = usuario_id;
    const { name, documentType, password } = req.body;

    const updateEvent = await BaseUser.findByIdAndUpdate(
      id,
      { name, documentType, password },
      { new: true }
    );
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el Usuario", error });
  }
};
export const Me = (req, res) => {
  try {
    if (req.session) {
      return res.status(200).json({ user: req.session.user });
    } else {
      return res.status(401).json({ message: "No autenticado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el Usuario", error });
  }
};
