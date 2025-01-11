import mongoose from "mongoose";
import { uploadImg, deleteImg } from "../utils/Cloudinary.js";
import { Entrenador } from "./Users/Entrenador.model.js";
import { Atleta } from "./Users/Atleta.model.js";
import fs from "fs-extra";
import { Administrador } from "./Users/Admin.model.js";

//

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "La fecha es obligatoria"],
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: [true, "La categoria es obligatoria"],
    },
    place: {
      type: String,
      required: [true, "El lugar es obligatorio"],
    },
    athletes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Atleta",
        required: false,
        default: null,
      },
    ],
    img: [
      {
        public_id: {
          type: String,
        },
        secure_url: {
          type: String,
        },
      },
    ],
    athletes: [
      {
        type: Number,
        ref: "Atleta",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Event = mongoose.model("Event", eventSchema);

//

export const GetEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error("Error al obtener eventos:", error);
    res.status(500).json({ message: "Error al obtener eventos", error });
  }
};
export const GetEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    return res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el Evento", error });
  }
};

//

export const CreateEvents = async (req, res) => {
  try {
    const { name, date, description, category, place } = req.body;

    const event = new Event({
      name,
      date,
      description,
      category,
      place,
    });
    if (req.files?.img) {
      const result = await uploadImg(req.files.img.tempFilePath);
      event.img = {
        event_id: result.public_id,
        secure_url: result.secure_url,
      };

      await fs.unlink(req.files.img.tempFilePath);
      console.log("Archivo temporal eliminado:", req.files.img.tempFilePath);
    } else {
      console.log("No se ha recibido ninguna imagen.");
    }

    await event.save();
    res.status(201).json(event);
    console.log(event);
  } catch (error) {
    console.log(req.body);
    res.status(500).json({ message: "Error al crear el evento", error });
  }
};

//

export const UpdateEvents = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, date, description, category, place } = req.body;

    const updateEvent = await Event.findByIdAndUpdate(
      id,
      { name, date, description, category, place },
      { new: true }
    );

    if (!updateEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.json(updateEvent);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el Evento", error });
  }
};

//

export const DeleteEvents = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    if (Event.img?.public_id) {
      deleteImg(Event.img.public_id);
    }
    res.json({ message: "Evento eliminado" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el Evento", error });
  }
};

//

export const AddAtletaEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { document } = req.body;

    const atleta = await Atleta.findOne({ document: document });
    if (!atleta) {
      return res
        .status(404)
        .json({ message: "Atleta no encontrado", Status: "404" });
    }
    const Atletaaevent = await Event.findOne({ athletes: document });
    if (Atletaaevent) {
      return res.status(404).json({ message: "Atleta ya registrado" });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }
    event.athletes.push(atleta.document);
    await event.save();

    res
      .status(200)
      .json({ message: "Atleta agregado con éxito", Status: 200 });
  } catch (error) {
    res.status(500).json({
      message: "Error al agregar el atleta",
      error: error.message,
      Status: "500",
    });
  }
};

//

export const DeleteAtletaEvento = async (req, res) => {
  try {
    const { usuario_id } = req.session;
    const { documentoAtleta } = req.body;
    const { id } = req.params;

    const admin = await Administrador.findById(usuario_id);
    const entrenador = await Entrenador.findById(usuario_id);

    if (!entrenador && !admin) {
      return res
        .status(404)
        .json({ message: "Entrenador o Admin no encontrado", Status: "404" });
    }

    const atleta = entrenador.athletes.some(
      (athlete) => String(athlete.document) === String(documentoAtleta)
    );

    if (!atleta) {
      return res.status(404).json({
        message: "Atleta no encontrado en la lista del entrenador",
        Status: "404",
      });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res
        .status(404)
        .json({ message: "Evento no encontrado", Status: "404" });
    }

    event.athletes = event.athletes.filter(
      (athlete) => String(athlete.document) !== String(documentoAtleta)
    );
    await event.save();
    res.status(200).json({ message: "Atleta eliminado", Status: 200});
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el atleta",
      error: error.message,
      Status: "500",
    });
  }
};

//

export const GetAtletasEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const evento = await Event.findById(id);
    if (!evento) {
      return res.status(404).json({
        message: "Evento no encontrado",
        status: 404,
      });
    }
    const athletes = await Atleta.find({ document: { $in: evento.athletes } });
    return res.status(200).json({ athletes });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error al obtener los atletas del evento",
        status: 500,
        error: error,
      });
  }
};
