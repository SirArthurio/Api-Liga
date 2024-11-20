import { Router } from "express";
import RutasProductos from "./products.rutas.js";
import RutasEventos from "./events.rutas.js";
import RutasNoticias from "./noticias.rutas.js";
import RutasUsuarios from "./Users/users.rutas.js";
import RutasCarrito from "./carrito.rutas.js";
import RutaLogin from "./Users/BaseUser.rutas.js";
import RutasAdministrador from "./Users/admin.rutas.js";
import RutasAtletas from "./Users/atleta.rutas.js";
import RutasEntrenadores from "./Users/Entrenador.rutas.js";
import RutasFactura from "./factura.rutas.js";

const Rutas = Router();
Rutas.use(["/", "/productos"], RutasProductos);
Rutas.use(["/", "/eventos"], RutasEventos);
Rutas.use(["/", "/noticias"], RutasNoticias);
Rutas.use(["/user/"], RutasUsuarios);
Rutas.use(["/admin/"], RutasAdministrador);
Rutas.use(["/atletas/"], RutasAtletas);
Rutas.use(["/entrenadores/"], RutasEntrenadores);
Rutas.use([ "/carrito"], RutasCarrito);
Rutas.use(["/login"], RutaLogin);
Rutas.use(["/factura"], RutasFactura);

export default Rutas;
