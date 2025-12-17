import express from "express";
import cors from "cors";
import { foodRouter } from "./routes/food.router.js";
import { healthCheckRouter } from "./routes/healthcheck.router.js";
import { userRouter } from "./routes/user.router.js";
import { cartRouter } from "./routes/cart.router.js";

//config
const app = express();

//middlewares
app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    // origin: ["http://localhost:5173/*", "http://localhost:3000"],
    // methods: ["GET", "POST", "PUT", "DELETE"],
    // credentials: true,
  })
);
// app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//ROUTES
app.use("/api/v1/food", foodRouter);
app.use("/api/v1/healthcheck", healthCheckRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/cart", cartRouter);

app.get("/", (req, res) => {
  // console.log(req);
  res.send("Hello World! this is the home of food del app !");
});

export default app;
