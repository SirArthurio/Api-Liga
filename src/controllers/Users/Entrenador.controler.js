import {
  CreateEntrenador,
  DeleteEntrenador,
  GetAtletaEntrenador,
  GetEntrenador,
  GetAtletasEntrenador,
  AddAtletaEntrenador,
  DeleteAtletaEntrenador,
  GetEntrenadores,
} from "../../models/Users/Entrenador.model.js";
import {
  documentExist,
  userExist,
} from "../../models/Users/BaseUser.models.js";

export const getAtletasEntrenador = async (req, res) => {
  try {
    await GetAtletasEntrenador(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el Entrenador/controler", error });
  }
};
export const getAtletaEntrenador = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { document } = req.body;
    if (!usuario_id) {
      return res.status(400).json({ message: "El ID de usuario es obligatorio", status: 400 });
    }
    if (!document) {
      return res.status(400).json({
        message: "El documento del atleta es obligatorio",
        status: 400,
      });
    }
    return await GetAtletaEntrenador(req, res);
    
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el entrenador/controlador",
      error: error.message,
      status: 500,
    });
  }
};

export const getEntrenador = async (req, res) => {
  try {
    const { document } = req.body;
    if (!document) {
      return res
        .status(400)
        .json({ message: "El id es obligatorio", Status: "400" });
    }
    await GetEntrenador(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el Entrenador/controlador",
      Error: error,
      Status: "500",
    });
  }
};
export const getEntrenadores = async (req, res) => {
  try {
    await GetEntrenadores(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Error al obtener el Entrenador/controlador",
      Error: error,
      Status: "500",
    });
  }
};

export const createEntrenador = async (req, res) => {
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
    if (!req.files?.img) {
      return res
        .status(400)
        .json({ message: "La imagen es obligatoria", Status: "400" });
    }
    await CreateEntrenador(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el admin/ controlador", Error: error });
  }
};
//
export const deleteAtletaEntrenador = async (req, res) => {
  try {
    const { usuario_id } = req.body;
    const { documentoAtleta } = req.body;
    if (!documentoAtleta) {
      return res
        .status(404)
        .json({ message: "Falta el docmuento del atleta", status: 404 });
    }
    if (!usuario_id) {
      return res
        .status(404)
        .json({ message: "Falta el id del entrenador", status: 404 });
    }
    await DeleteAtletaEntrenador(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el atleta del entrenador",
      status: 500,
      error: error,
    });
  }
};
//
export const deleteEntrenador = async (req, res) => {
  try {
    const { document } = req.body;
    if (!document) {
      return res
        .status(400)
        .json({ message: "El documento es obligatorio", Status: "400" });
    }
    await DeleteEntrenador(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el Entrenador", Error: error });
  }
};
//
export const addAtletaEntrenador = async (req, res) => {
  try {
    const { document } = req.body;
    const { usuario_id } = req.session;
    if (!usuario_id) {
      return res.status(401).json({
        message: "falta el id del entrenador realizar esta acción",
        status: 401,
      });
    }
    if (!document) {
      return res
        .status(404)
        .json({ message: "Falta el documento del atleta", status: 400 });
    }
    await AddAtletaEntrenador(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar el atleta en el entrenador",
      error: error,
      status: 500,
    });
  }
};
