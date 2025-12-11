import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { connectDB } from "./db/db_conn.js";
import app from "./server.js";
import { log } from "console";

const port = process.env.PORT;

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  // console.log(process.env.AWS_ACCESS_KEY_ID);
});
