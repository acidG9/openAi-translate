import express from "express";
import {
  doTranslate,
} from "../controller/controller.js";

const router = express.Router();

router.post("/translate", doTranslate);

export default router;
