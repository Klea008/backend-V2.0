import express from 'express';
import * as booksController from '../controllers/book.controller.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// ******* PUBLIC ROUTES ********
router.get("/", booksController.getBooks);
router.get("/:id", booksController.getBookById);
router.get("/rated/top", booksController.getTopRatedBooks)
router.get("/random/all", booksController.getRandomBooks);

// ******* ADMIN ROUTES ******** ONLY FOR ADMINS
router.put("/:id", protect, admin, booksController.updateBook)
router.delete("/:id", protect, admin, booksController.deleteBook)
router.delete("/", protect, admin, booksController.deleteAllBooks)
router.post("/", protect, admin, booksController.createBook)
router.post("/import", protect, admin, booksController.importBooks)

export default router;