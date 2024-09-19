import express from 'express';
import * as listController from '../controllers/list.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ******* PRIVATE ROUTES ******** ONLY FOR LOGGED IN USERS
router.post("/", protect, listController.createList)
router.delete("/", protect, listController.deleteList)
router.get("/", protect, listController.getListsFromUser)
router.get("/published", protect, listController.getPublicLists)

router.get("/listItems", protect, listController.getBooksFromList)
router.post("/listItems", protect, listController.addBookToList)
router.delete("/listItems", protect, listController.deleteBookFromList)

export default router