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
Rutas.use(["/"], RutasProductos);
Rutas.use(["/"], RutasEventos);
Rutas.use(["/"], RutasNoticias);
Rutas.use(["/user"], RutasUsuarios);
Rutas.use(["/"], RutasAdministrador);
Rutas.use(["/"], RutasAtletas);
Rutas.use(["/"], RutasEntrenadores);
Rutas.use(["/carritos"], RutasCarrito);
Rutas.use(["/"], RutaLogin);
Rutas.use(["/facturas"], RutasFactura);

export default Rutas;
