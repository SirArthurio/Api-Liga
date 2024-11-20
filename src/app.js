import express from "express";
import morgan from "morgan";
import Rutas from "./routes/rutas.js";
import cors from "cors";
import session from "express-session";

const app = express();
app.set("port", process.env.PORT || 3000);
app.set("json spaces", 2);
app.use(
    session({
      name: 'mi_sesion',
      secret: "tu_secreto_unico",
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, 
        secure: false, 
        httpOnly: true,
        sameSite: 'lax', 
      },
    })
  );
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true, 
    })
  );
app.use(morgan("dev"));
app.use(express.json());
app.use(Rutas);

export default app;