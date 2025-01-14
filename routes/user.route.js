import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// ******* PUBLIC ROUTES ********
router.post("/", userController.registerUser)
router.post("/login", userController.loginUser)
router.get("/logout", userController.logout)

// ******* PRIVATE ROUTES ******** ONLY FOR LOGGED IN USERS
router.put("/", protect, userController.updateUserProfile);
router.delete("/", protect, userController.deleteUserProfile);
router.put("/password", protect, userController.changeUserPassword);

// ******* ADMIN ROUTES ******** ONLY FOR ADMINS
router.get("/", protect, admin, userController.getUsers);
router.delete("/:id", protect, admin, userController.deleteUser)

export default router