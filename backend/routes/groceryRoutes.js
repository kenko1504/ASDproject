import express from "express";
import {
    createList,
    getLists,
    deleteList,
    updateList,
    getItems,
    createItem,
    updateItem,
    deleteItem,
    copyList
 } from "../controllers/groceryListcontroller.js";
 import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Grocery Lists CDRUD
router.post("/:uid", authenticateToken, createList);    
router.get("/:uid", authenticateToken, getLists);
router.put("/:uid/list/:gid", authenticateToken, updateList);
router.delete("/:uid/list/:gid", authenticateToken, deleteList);
router.post("/:uid/list/:gid/copy", authenticateToken, copyList);

// A Grocery Items CDRUD
router.post("/:uid/list/:gid/item", authenticateToken, createItem);
router.get("/:uid/list/:gid/items", authenticateToken, getItems);
router.put("/:uid/list/:gid/item/:itemID", authenticateToken, updateItem);
router.delete("/:uid/list/:gid/item/:itemID", authenticateToken, deleteItem);

export default router;
