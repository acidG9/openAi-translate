import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import routes from "./routes/routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

const startServer = async () => {
  try {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error(err);
  }
};

startServer();
