
import mongoose from "mongoose";
import { BD_MONGO } from "../config.js";


export async function conexionDB() {
  try {
    console.log("conectado compae");
    await mongoose.connect(BD_MONGO);
  } catch (errors) {
    console.log(errors);
  }
}
