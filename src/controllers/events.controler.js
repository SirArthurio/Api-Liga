import {
  GetEvents,
  GetEvent,
  CreateEvents,
  UpdateEvents,
  DeleteEvents,
  AddAtletaEvento,
  DeleteAtletaEvento,
  GetAtletasEvento,
} from "../models/events.model.js";

//

export const getEvents = async (req, res) => {
  try {
    await GetEvents(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener los Eventos/controlador ", error });
  }
};

export const getEvent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Falta el ID!" });
    }
    await GetEvent(req, res);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener el Evento/controlador ", error });
  }
};

//

export const createEvents = async (req, res) => {
  try {
    const { name, date, description, category, place } = req.body;
    if (
      !name &&
      !date &&
      !description &&
      !category &&
      !place &&
      !req.files?.img
    ) {
      return res.status(400).json({ message: "Los campos son obligatorios" });
    }
    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }
    if (!date) {
      return res.status(400).json({ message: "La fecha es obligatoria" });
    }
    if (!description) {
      return res.status(400).json({ message: "La descripcion es obligatoria" });
    }
    if (!category) {
      return res.status(400).json({ message: "La categoria es obligatoria" });
    }
    if (!place) {
      return res.status(400).json({ message: "El lugar es obligatorio" });
    }
    if (!req.files?.img) {
      return res.status(400).json({ message: "Falta la imagen" });
    }
    await CreateEvents(req, res);
  } catch (error) {}
};

//

export const updateEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, description, category, place } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Y el id!?" });
    }
    if (!name && !date && !description && !category && !place) {
      return res.status(400).json({ message: "los campos son obligatorios" });
    }
    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }
    if (!date) {
      return res.status(400).json({ message: "La fecha es obligatoria" });
    }
    if (!description) {
      return res.status(400).json({ message: "La descripcion es obligatoria" });
    }
    if (!category) {
      return res.status(400).json({ message: "La categoria es obligatoria" });
    }
    if (!place) {
      return res.status(400).json({ message: "El lugar es obligatorio" });
    }
    await UpdateEvents(req, res);
  } catch (error) {}
};

//

export const deleteEvents = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Y el id!?" });
    }
    await DeleteEvents(req, res);
  } catch (error) {}
};

//

export const addAtletaEvento = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { id } = req.params;
    const { document } = req.body;

    if (!usuario_id) {
      return res.status(400).json({ message: "Debes estar logueado" });
    }
    if (!document) {
      return res
        .status(400)
        .json({ message: "El documento es obligatorio", status: 404 });
    }
    if (!id) {
      return res.status(404).json({
        message: "Falta el id del eveneto",
        status: 404,
      });
    }
    await AddAtletaEvento(req, res);
  } catch (error) {
    return res.status(500).json({
      message: "Error al agregar el atleta al avento",
      status: 500,
      error: error,
    });
  }
};

//

export const deleteAtletaEvento = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { id } = req.params;
    const { document } = req.body;

    if (!usuario_id) {
      return res.status(400).json({ message: "Debes estar logueado" });
    }
    if (!document) {
      return res
        .status(400)
        .json({ message: "El documento es obligatorio", status: 404 });
    }
    if (!id) {
      return res.status(404).json({
        message: "Falta el id del eveneto",
        status: 404,
      });
    }
    await DeleteAtletaEvento(req, res);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error al eliminar el atleta del evento",
        error: error,
        status: 500,
      });
  }
};

//

export const getAtletasEvento = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res
        .status(404)
        .json({ message: "Falta el id del evento", status: 404 });
    }
    await GetAtletasEvento(req, res);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al obtener los atletas del evento",
        error: error,
        status: 500,
      });
  }
};
