import {
  actualizarNoticia,
  CrearNoticia,
  eliminarNoticia,
  ObtenerNoticias,
  ObtenerNoticia,
} from "../models/noticias.models.js";

export const getNoticias = async (req, res) => {
  try {
    const noticias = await ObtenerNoticias();
    return res.json(noticias);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener noticias", error: error.message });
  }
};
export const getNoticia = async (req, res) => {
  const { id } = req.params;
  try {
    const noticia = await ObtenerNoticia(id);
    return res.json(noticia);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener la noticia", error: error.message });
  }
};

export const createNoticias = async (req, res) => {
  try {
    const { name, date, description, category } = req.body;
    if (!name && !date && !description && !category)
      return res
        .status(400)
        .json({ message: "los campos son obligatorios compae",Status:"400" });
    if (!name)
      return res
        .status(400)
        .json({ message: "El nombre es obligatorio", Status: "400" });
    if (!date)
      return res
        .status(400)
        .json({ message: "La fecha es obligatoria", Status: "400" });
    if (!description)
      return res
        .status(400)
        .json({ message: "La descripción es obligatoria", Status: "400" });
    if (!category)
      return res
        .status(400)
        .json({ message: "La categoría es obligatoria", Status: "400" });

    if (!req.files?.img)
      return res
        .status(400)
        .json({ message: "La imagen es obligatoria", Status: "400" });

    const noticia = await CrearNoticia(req, res);

    return res.status(201).json(noticia);
  } catch (error) {
    console.error("Error al crear la noticia:", error);
    return res
      .status(500)
      .json({ message: "Error al crear la noticia", error: error.message });
  }
};

export const updateNoticias = async (req, res) => {
  try {
    const { name, date, description, category } = req.body;
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: "Y el id compae?" });
    }
    if (!name && !date && !description && !category)
      return res
        .status(400)
        .json({ message: "los campos son obligatorios compae" });
    if (!name)
      return res.status(400).json({ message: "El nombre es obligatorio" });
    if (!date)
      return res.status(400).json({ message: "La fecha es obligatoria" });
    if (!description)
      return res.status(400).json({ message: "La descripción es obligatoria" });
    if (!category)
      return res.status(400).json({ message: "La categoría es obligatoria" });

    await actualizarNoticia(req, res);
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};

export const deleteNoticias = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ message: "Y el id compae?" });
  }
  try {
    await eliminarNoticia(req, res);
  } catch (error) {
    res.status(500).json({ message: "error", error });
  }
};
