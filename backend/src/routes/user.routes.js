import express from "express";
import { loginUserController, refresh, logout } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", loginUserController);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
