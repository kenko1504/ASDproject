import express from "express";
import {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
    getWasteStats,
    getBudgetStats
} from "../controllers/itemController.js";

const router = express.Router();

router.get("/stats", getBudgetStats);   // get user nutrition info

//CRUD endpoints
router.post("/", createItem);     // add item
router.get("/", getItems);        // get item
router.get("/:id", getItem);      // get item by id
router.put("/:id", updateItem);   // update item
router.delete("/:id", deleteItem);// delete item


export default router;