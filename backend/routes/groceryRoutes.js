import express from "express";
import {
    createList,
    getLists,
    deleteList,
    updateList
 } from "../controllers/groceryListcontroller.js";

const router = express.Router();

router.post("/:UID", createList);    
router.get("/:UID", getLists);
router.put("/:GL_ID", updateList);
router.delete("/:GL_ID", deleteList);
// router.get("/:id", getList);       
// router.put("/:id", updateList);   
// router.delete("/:id", deleteList);


export default router;
