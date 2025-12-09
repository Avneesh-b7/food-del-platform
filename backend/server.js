import express from "express";
import { configDotenv } from "dotenv";
import cors from "cors";

//config
const app = express();
const port = process.env.PORT;

//middlewares
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
