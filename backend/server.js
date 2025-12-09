import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/db_conn.js";

//config
const app = express();
dotenv.config({ path: "./.env" });
const port = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

//db connection
connectDB();
// console.log(process.env.MONGO_DB_URI);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
