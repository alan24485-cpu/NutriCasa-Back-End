import express from "express";
import { updateInventoryItem, deleteInventoryItem } from "../controllers/inventory.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.put("/items/:itemId", authMiddleware, updateInventoryItem);

router.delete("/items/:itemId", authMiddleware, deleteInventoryItem);

export default router;