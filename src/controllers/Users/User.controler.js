import {
  Usuario,
  GetUser,
  CreateUser,
  DeleteUser,
  GetUsers,
  UpdateUser,
GetUserPerfil,Me} from "../../models/Users/User.model.js";
import {
  BaseUser,
  documentExist,
  userExist,
} from "../../models/Users/BaseUser.models.js";

export const getUsers = async (req, res) => {
  try {
    await GetUsers(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los Usuarios / controlador",
      error: error,
      status: 500,
    });
  }
};

export const createUser = async (req, res) => {
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
    if (!user) {
      return res
        .status(400)
        .json({ message: "El usuario es obligatorio", Status: "400" });
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
        message: "La fecha de nacimiento es obligatoria",
        Status: "400",
      });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "La contraseña es obligatoria", Status: "400" });
    }
    if (!req.files?.img) {
      return res
        .status(400)
        .json({ message: "La imagen es obligatoria", Status: "400" });
    }

    await CreateUser(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el usuario controler", Error: error });
  }
};
export const deleteUser = async (req, res) => {
  try {
    const { document } = req.body;
    if (!document) {
      return res.status(404).json({ message: "y la cedula?", status: 404 });
    }
    return await DeleteUser(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el Usuario/controlador",
      error: error,
      status: 500,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const { document } = req.body;
    if (!document) {
      return res.status(404).json({ message: "y la cedula?", status: "404" });
    }
    await GetUser(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el Usuario", error: error });
  }
};

export const getUserPerfil = async (req, res) => {
  try {
    const { usuario_id  } = req.session;
    const id = usuario_id;
    if (!id) {
      return res.status(404).json({ message: "no hay id", status: "404" });
    }
    await GetUserPerfil(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el Usuario", error: error });
  }
};
export const updateUser = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const id = usuario_id;
    if (!id) {
      return res
        .status(404)
        .json({ message: "No se encuentra el usuario", status: 404 });
    }
    await UpdateUser(req, res);
    return res.status(200).json({message:"Se actualizo esa vaina", status:200})
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el usuario/controlador",
      status: 500,
      error: error,
    });
  }
};

export const me =async(req,res)=>{
  try {
    await Me(req,res);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener ifno del usuario/controlador",
      status: 500,
      error: error,
    });
  }
  };
