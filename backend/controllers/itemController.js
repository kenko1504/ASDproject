import Item from "../models/item.js";
import item from "../models/item.js";


//Create item
export const createItem = async (req, res) => {
    try {
        const newItem = new Item(req.body);
        await newItem.save();
        res.json(newItem);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

// Read all items
export const getItems = async (req, res) => {
    const items = await Item.find();
    res.json(items);
};

// Read one item
export const getItem = async (req, res) => {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({message: "Item not found"});
    res.json(item);
};

// Update
export const updateItem = async (req, res) => {
    try {
        const updated = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true} // return the updated data
        );
        if (!updated) return res.status(404).json({message: "Item not found"});
        res.json(updated);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

// Delete
export const deleteItem = async (req, res) => {
    try {
        const deleted = await Item.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({message: "Item not found"});
        res.json({message: "Item is deleted"});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


//Get items by category
export const getItemsByCategory = async (req, res) => {
    try {
        const items = await Item.find({category: req.params.category});
        res.json(items);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


//Get expiring items
export const getExpiringItems = async (req, res) => {
    try {
        const now = new Date();
        const soon = new Date();
        soon.setDate(now.getDate() + 3); // 3 天后
        const items = await Item.find({expiryDate: {$lte: soon}});
        res.json(items);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};


//Get budget
export const getBudgetStats = async (req, res) => {
    try {
        const items = await Item.find();
        const totalValue = items.reduce((sum, item) =>
            sum + Number(item.price) * (Number(item.quantity) || 1), 0 //calculate item's value
        );
        res.json({totalValue, count: items.length});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

//Get waste data, including those that have expired and are about to expire
export const getWasteStats = async (req, res) => {
    try {
        const now = new Date();
        const soon = new Date();
        soon.setDate(now.getDate() + 3);

        const expired = await Item.find({ expiryDate: { $lt: now } });
        const expiringSoon = await Item.find({ expiryDate: { $gte: now, $lte: soon } });

        const wastedValue = expired.reduce((sum, i) =>
            sum + Number(i.price) * (Number(i.quantity) || 1), 0 //calculate waste value
        );

        res.json({
            expired,
            expiringSoon,
            wastedValue
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};