import express from "express";
import {
    createList,
    getLists,
 } from "../controllers/groceryListcontroller.js";

const router = express.Router();

router.post("/", createList);    
router.get("/", getLists);
// router.get("/:id", getList);       
// router.put("/:id", updateList);   
// router.delete("/:id", deleteList);


export default router;
