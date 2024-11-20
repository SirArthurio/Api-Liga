import app from "./app.js";
import { conexionDB } from "./utils/DB.js";

async function main() {
  await conexionDB();
  app.listen(app.get("port"), () => {
    console.log(`Server on port ${app.get("port")}`);
  });
}
main();

