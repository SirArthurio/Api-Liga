import {
  GetAtleta,
  GetAtletas,
  DeleteAtleta,
  CreateAtleta,
  UpdateAtleta,
  AddSportAtleta,
  DeleteSportAtleta,
} from "../../models/Users/Atleta.model.js";
import {
  userExist,
  documentExist,
} from "../../models/Users/BaseUser.models.js";

export const getAtletas = async (req, res) => {
  try {
    await GetAtletas(req, res);
  } catch (error) {
    res.status(500).json({
      message: "error al obtener el atleta/controlador",
      status: "500",
    });
  }
};
//
export const getAtleta = async (req, res) => {
  try {
    const { document } = req.body;
    if (!document) {
      return res
        .status(404)
        .json({ messsage: "y el documento?", status: "404" });
    }
    await GetAtleta(document, res);
  } catch (error) {
    res.status(500).json({
      message: "error al obtener el atleta/controlador",
      status: "500",
    });
  }
};
//
export const deleteAtleta = async (req, res) => {
  try {
    const { document } = req.body;
    if (!document) {
      return res
        .status(404)
        .json({ message: "ingrese la cedula?", status: "404" });
    }
    await DeleteAtleta(req, res);
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el atleta/controlador",
      status: "500",
    });
  }
};
//
export const createAtleta = async (req, res) => {
  try {
    const {
      name,
      coach,
      user,
      password,
      documentType,
      document,
      birthdate,
      sport,
    } = req.body;
    if (
      !name &&
      !coach &&
      !user &&
      !password &&
      !document &&
      !documentType &&
      !birthdate &&
      !sport
    ) {
      return res
        .status(404)
        .json({ message: "Los campos son obligatorios", status: "404" });
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
      return res.status(404).json({ message: "El nombre es obligatorio" });
    }
    if (!coach) {
      return res.status(404).json({ message: "El coach es obligatorio" });
    }
    if (!user) {
      return res.status(404).json({ message: "El usuario es obligatorio" });
    }
    if (!password) {
      return res.status(404).json({ message: "La contraseña es obligatoria" });
    }
    if (!coach) {
      return res.status(404).json({ message: "El coach es obligatorio" });
    }
    if (!document) {
      return res.status(404).json({ message: "El documento es obligatorio" });
    }
    if (!documentType) {
      return res
        .status(404)
        .json({ message: "El tipo de documento es obligatorio" });
    }
    if (!birthdate) {
      return res
        .status(404)
        .json({ message: "La fecha de nacimiento es obligatoria" });
    }
    if (!sport) {
      return res.status(404).json({ message: "El deporte es obligatorio" });
    }
    await CreateAtleta(req, res);
  } catch (error) {
    res.status(500).json({
      message: "error al crear el atleta controlador",
      status: 500,
      error: error,
    });
  }
};
//
export const updateAtleta = async (req, res) => {
  try {
    try {
      const { document } = req.body;
      if (!document) {
        return res
          .status(404)
          .json({ message: "el documento es obligatorio", status: 404 });
      }
      await UpdateAtleta(req, res);
    } catch (error) {
      res.status(500).json({
        message: "Error al actualizar el usuario/controlador",
        status: 500,
        error: error,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "error al actualizar el atleta controlador",
      status: 500,
      error: error,
    });
  }
};
//
export const addSportAtleta = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { sport } = req.body;
    if (!usuario_id) {
      return res.status(404).json({ message: "No tenes permiso", status: 404 });
    }
    if (!sport) {
      return res
        .status(404)
        .json({ message: "El deporte es obligatorio", status: 404 });
    }
    await AddSportAtleta(req, res);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al agregar el dporte al atleta / controlador",
        status: 500,
        error: error,
      });
  }
};
//
export const deleteSportAtleta = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { sport } = req.body;
    if (!usuario_id) {
      return res.status(404).json({ message: "No tenes permiso", status: 404 });
    }
    if (!sport) {
      return res
        .status(404)
        .json({ message: "El deporte es obligatorio", status: 404 });
    }
    await DeleteSportAtleta(req,res);
  } catch (error) {
    res.status(500).json({message:"Error al eliminar el deporte",status:500,error:error})
  }
};
