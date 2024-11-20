import {
  CreateAdmin,
  DeleteUser,
  GetUser,
  GetUsers,
} from "../../models/Users/Admin.model.js";
import {
  BaseUser,
  userExist,
  documentExist,
} from "../../models/Users/BaseUser.models.js";

export const getUsers = async (req, res) => {
  try {
    await GetUsers(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los Usuarios/controler", error });
  }
};
export const getUser = async (req, res) => {
  try {
    const { document } = req.body;
    if (!document) {
      return res
        .status(400)
        .json({ message: "La cedula es obligatoria", Status: "400" });
    }
    await GetUser(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el Usuario/controlador",
      Error: error,
      Status: "500",
    });
  }
};

export const createAdmin = async (req, res) => {
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
    if (
      !name &&
      !levelUser &&
      !user &&
      !documentType &&
      !document &&
      !birthdate &&
      !password &&
      !req.files?.img
    ) {
      return res
        .status(400)
        .json({ message: "Los campos son obligatorios", Status: "400" });
    }
    if (await documentExist(document)) {
      return res.status(400).json({
        message: "Documento ya existe, por favor ingrese otro",
        Status: "400",
      });
    }

    if (await userExist(user)) {
      return res.status(400).json({
        message: "Usuario ya existe, por favor ingrese otro",
        Status: "400",
      });
    }
    if (!name) {
      return res
        .status(400)
        .json({ message: "El nombre es obligatorio", Status: "400" });
    }
    if (!levelUser) {
      return res
        .status(400)
        .json({ message: "El nivel es obligatorio", Status: "400" });
    }
    if (!documentType) {
      return res.status(400).json({
        message: "El tipo de documento es obligatorio",
        Status: "400",
      });
    }
    if (!document) {
      return res
        .status(400)
        .json({ message: "El documento es obligatorio", Status: "400" });
    }
    if (!birthdate) {
      return res.status(400).json({
        message: "El la fecha de nacimiento es obligatoria",
        Status: "400",
      });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "La contraseña es obligatoria", Status: "400" });
    }
    if (req.files?.img) {
      return res
        .status(400)
        .json({ message: "La imagen es obligatoria", Status: "400" });
    }
    await CreateAdmin(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el admin/ controlador", Error: error });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(400)
        .json({ message: "El id es obligatorio", Status: "400" });
    }
    await DeleteUser(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el Evento", Error: error });
  }
};
