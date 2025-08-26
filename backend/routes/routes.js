import express from "express";
import {
  doTranslate,
  doVerify,
  getHistory,
  login,
  register,
  save,
} from "../controller/controller.js";
import middleware from "../middleware/middleware.js";

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/verify', middleware, doVerify);
router.post("/translate", middleware, doTranslate);
router.get("/history", middleware, getHistory);
router.post("/save", middleware, save);

export default router;
