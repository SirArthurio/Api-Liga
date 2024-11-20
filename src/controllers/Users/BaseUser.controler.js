import { Login, Logout,Check } from "../../models/Users/BaseUser.models.js";

export const login = async (req, res) => {
  try {
    const { user, password } = req.body;
    if (!user) {
      return res
        .status(400)
        .json({ message: "El usuario es obligatorio", status: false });
    }
    if (!password) {
      return res
        .status(400)
        .json({ message: "La contraseña es obligatoria", status: false });
    }
    const { status, message, user: userData } = await Login(req);

    if (status) {
      req.session.usuario_id = userData._id;
      console.log("Sesión creada:", req.session);

      return res.status(200).json({
        message: "Logueado con éxito",
        status: true,
        user: userData,
      });
    } else {
      return res.status(400).json({
        message: message || "Credenciales incorrectas",
        status: false,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Error en el servidor controlador",
      error: error.message,
      status: false,
    });
  }
};

export const logout=async(req,res)=>{
try {
  await Logout(req,res);
} catch (error) {
  return res.status(500).json({message:"error al cerrar sesion"});
}
};

export const check=async(req,res)=>{
  try {
    await Check(req,res);
  } catch (error) {
    return res.status(500).json({message:"error al chekear sesion"});
  }
}
