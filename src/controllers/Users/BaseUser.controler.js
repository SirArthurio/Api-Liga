import { Login, Logout, Check } from "../../models/Users/BaseUser.models.js";

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
    const { status, message, user: userDB, token } = await Login(req);
    console.log("userDB", userDB);
    if (status) {
      req.session.usuario_id = userDB._id;
      console.log("Sesión creada 1:", req.session);
      res.cookie("jwt", token, {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        secure: false, 
        sameSite: "lax",
      });

      return res.status(200).json({
        message: "Logueado con éxito",
        status: true,
        user: userDB,
        token,
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

export const logout = async (req, res) => {
  try {
    await Logout(req, res);
  } catch (error) {
    return res.status(500).json({ message: "error al cerrar sesion" });
  }
};

export const check = async (req, res) => {
  try {
    await Check(req, res);
  } catch (error) {
    return res.status(500).json({ message: "error al chekear sesion" });
  }
};
