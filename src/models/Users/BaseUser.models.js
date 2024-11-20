import mongoose from "mongoose";

const options = { discriminatorKey: "levelUser", timestamps: true };

const baseUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
    },
    levelUser: {
      type: String,
      required: [true, "El rol es obligatorio"],
    },
    user: {
      type: String,
      required: [true, "El usuario es obligatorio"],
    },
    documentType: {
      type: String,
      required: [true, "El Tipo de Documento es obligatorio"],
    },
    document: {
      type: Number,
      required: [true, "El documento es obligatorio"],
    },
    birthdate: {
      type: Date,
      required: [true, "La fecha de nacimiento es obligatoria"],
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    img: [
      {
        public_id: String,
        secure_url: String,
      },
    ],
  },
  options
);

export const BaseUser = mongoose.model("BaseUser", baseUserSchema);

export const userExist = async (user) => {
  const existingUser = await BaseUser.findOne({ user });
  return !!existingUser;
};

export const documentExist = async (document) => {
  const existingDocument = await BaseUser.findOne({ document });
  return !!existingDocument;
};

export const Login = async (req) => {
  try {
    const { user, password } = req.body;
    const userDB = await BaseUser.findOne({ user });
    if (!userDB) {
      return { status: false, message: "Usuario no encontrado" };
    }
    const passwordMatch = userDB.password === password;
    if (!passwordMatch) {
      return { status: false, message: "Contraseña incorrecta" };
    }
    const { password: _, ...userWithoutPassword } = userDB.toObject();
    
    return { status: true, user: userWithoutPassword };
  } catch (error) {
    return { status: false, error: "Error en el servidor" };
  }
};

export const Check=async(req,res)=>{
  try {
    if (req.session.user) {
      return res.status(200).json({ message: "Usuario logueado", user: req.session.user, status:true });
    } else {
      return res.status(401).json({ message: "No estás logueado",status:false  });
    }
  } catch (error) {
    return { status: false, error: "Error al chekear" };
  }
}


export const Logout=async(req,res)=>{
  try {
    req.session.destroy(err => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
        return res.status(500).send("No se pudo cerrar sesión");
      }
      res.clearCookie('mi_sesion'); 
      res.status(200).send("Sesión cerrada correctamente");
    });
  } catch (error) {
    return { status: false, error: "Error en el servidor" };
  }
}
