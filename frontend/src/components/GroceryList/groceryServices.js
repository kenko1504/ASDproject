import { getAPI, postAPI, putAPI, deleteAPI } from "../../utils/api";
const rootURI = "/GroceryLists";
const token = localStorage.getItem("token");

const groceryServices = {
    // Grocery Lists Dashboard Management
    createList(uid, data){ return postAPI(`${rootURI}/${uid}`, data, token);},
    getList(uid){ return getAPI(`${rootURI}/${uid}`, token);},
    updateList(uid, gid, data){ return putAPI(`${rootURI}/${uid}/list/${gid}`, data, token);},
    deleteList(uid,gid){ return deleteAPI(`${rootURI}/${uid}/list/${gid}`, token);},
    copyList(uid, gid, data){ return postAPI(`${rootURI}/${uid}/list/${gid}/copy`, data, token);},

    // Grocery List Item Management
    createItem(uid, gid, data){ return postAPI(`${rootURI}/${uid}/list/${gid}/item`, data, token);},
    getItem(uid, gid){ return getAPI(`${rootURI}/${uid}/list/${gid}/items`, token);},
    updateItem(uid, gid, itemID, data){ return putAPI(`${rootURI}/${uid}/list/${gid}/item/${itemID}`, data, token);},
    deleteItem(uid, gid, itemID){ return deleteAPI(`${rootURI}/${uid}/list/${gid}/item/${itemID}`, token);},
}

export default groceryServices;