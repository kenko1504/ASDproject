import express from "express";
import {
    createList,
    getLists,
    deleteList
 } from "../controllers/groceryListcontroller.js";

const router = express.Router();

router.post("/:UID", createList);    
router.get("/:UID", getLists);
router.delete("/:GL_ID", deleteList);
// router.get("/:id", getList);       
// router.put("/:id", updateList);   
// router.delete("/:id", deleteList);


export default router;
