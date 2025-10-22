import { getAPI, postAPI, putAPI, deleteAPI } from "../../utils/api";
const rootURI = "/GroceryLists";
const token = localStorage.getItem("token");

const groceryServices = {
    // Grocery Lists Dashboard Management
    createList(uid, data, token){ return postAPI(`${rootURI}/${uid}`, data, token);},
    getList(uid, token){ return getAPI(`${rootURI}/${uid}`, token);},
    updateList(uid, gid, data, token){ return putAPI(`${rootURI}/${uid}/list/${gid}`, data, token);},
    deleteList(uid,gid, token){ return deleteAPI(`${rootURI}/${uid}/list/${gid}`, token);},
    copyList(uid, gid, data, token){ return postAPI(`${rootURI}/${uid}/list/${gid}/copy`, data, token);},

    // Grocery List Item Management
    createItem(uid, gid, data, token){ return postAPI(`${rootURI}/${uid}/list/${gid}/item`, data, token);},
    getItem(uid, gid, token){ return getAPI(`${rootURI}/${uid}/list/${gid}/items`, token);},
    updateItem(uid, gid, itemID, data, token){ return putAPI(`${rootURI}/${uid}/list/${gid}/item/${itemID}`, data, token);},
    deleteItem(uid, gid, itemID, token){ return deleteAPI(`${rootURI}/${uid}/list/${gid}/item/${itemID}`, token);},
}

export default groceryServices;