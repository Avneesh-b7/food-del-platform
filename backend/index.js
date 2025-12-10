import { connectDB } from "./db/db_conn.js";
import dotenv from "dotenv";
import app from "./server.js";

dotenv.config({ path: "./.env" });

const port = process.env.PORT;

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
