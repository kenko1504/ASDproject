import express from "express";
import {
    createList,
    getLists,
    deleteList,
    updateList,
    getItems,
    createItem,
    updateItem,
    deleteItem
 } from "../controllers/groceryListcontroller.js";

const router = express.Router();

// Grocery Lists CDRUD
router.post("/:UID", createList);    
router.get("/:UID", getLists);
router.put("/:GL_ID", updateList);
router.delete("/:GL_ID", deleteList);
// A Grocery List Items CDRUD
router.post("/:GL_ID/items", createItem);
router.get("/:GL_ID/items", getItems);
router.put("/item/:ITEM_ID", updateItem);
router.delete("/item/:ITEM_ID", deleteItem);


// router.get("/:id", getList);       
// router.put("/:id", updateList);   
// router.delete("/:id", deleteList);


export default router;
