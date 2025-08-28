import express from "express";
import { loginUserController, loginAdminController, refresh, logout } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/login", loginUserController);
router.post("/admin/login", loginAdminController);
router.put("/refresh-token", refresh);
router.post("/logout", logout);

export default router;
