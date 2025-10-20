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
router.post("/:uid", createList);    
router.get("/:uid", getLists);
router.put("/:uid/list/:gid", updateList);
router.delete("/:gid", deleteList);
// A Grocery List Items CDRUD
router.post("/:gid/items", createItem);
router.get("/:gid/items", getItems);
router.put("/item/:id", updateItem);
router.delete("/item/:id", deleteItem);


// router.get("/:id", getList);       
// router.put("/:id", updateList);   
// router.delete("/:id", deleteList);


export default router;
