import express from "express";
import {
    createList,
    getLists,
 } from "../controllers/groceryListcontroller.js";

const router = express.Router();

router.post("/:UID", createList);    
router.get("/:UID", getLists);
// router.get("/:id", getList);       
// router.put("/:id", updateList);   
// router.delete("/:id", deleteList);


export default router;
