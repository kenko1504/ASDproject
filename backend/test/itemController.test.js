import request from "supertest";
import express from "express";
import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server";
import Item from "../models/item.js";
import {
    createItem,
    getItems,
    getItem,
    updateItem,
    deleteItem,
} from "../controllers/itemController.js";


describe("ItemController Tests", () => {
    let mongoServer;
    let app;

    // setup before all tests
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create(); // start in-memory database instance
        const mongoUri = mongoServer.getUri();

        await mongoose.connect(mongoUri); // connect in-memory database

        //setup Express App
        app = express();
        app.use(express.json());
        app.post("/api/items", createItem);
        app.get("/api/items", getItems);
        app.get("/api/items/:id", getItem);
        app.put("/api/items/:id", updateItem);
        app.delete("/api/items/:id", deleteItem);
    });

    //clean up after all tests
    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    //clean up database before each test
    beforeEach(async () => {
        await Item.deleteMany({});
    });

    //test creating an item
    describe("Create a new Item", () => {
        it('should create a new item successfully', async () => {
            const newItem = {
                name: "pear",
                quantity: 10,
                price: 2.5,
                category: "Fruit",
                expiryDate: "2025-10-09",
                imgUrl: "pear.jpg"
            };

            const response = await request(app)
                .post("/api/items")
                .send(newItem)
                .expect(200);

            //check response
            expect(response.body).toHaveProperty("_id");
            expect(response.body.name).toBe("pear");
            expect(response.body.quantity).toBe(10);
            expect(response.body.price).toBe(2.5);
            expect(response.body.category).toBe("Fruit");

            //verify database
            const saved = await Item.findOne({name: "pear"});
            expect(saved).not.toBeNull();
            expect(saved.quantity).toBe(10);
            expect(saved.price).toBe(2.5);
            expect(saved.category).toBe("Fruit");
        });

        it("should return 500 if required fields are missing", async () => {
            const incompleteItem = {name: "apple"}; // missing price, quantity, category
            const response = await request(app)
                .post("/api/items")
                .send(incompleteItem)
                .expect(500);

            expect(response.body).toHaveProperty("error");
        });
    });

    //test reading all items
    describe("Get all items", () => {
        it("should return all items", async () => {
            await Item.create([
                {name: "pear", price: 5, quantity: 2, category: "Fruit", expiryDate: "2025-10-01", imgUrl: "pear.jpg"},
                {name: "beef", price: 20, quantity: 1, category: "Meat", expiryDate: "2025-11-01", imgUrl: "beef.jpg"},
            ]);

            const response = await request(app).get("/api/items").expect(200);

            expect(response.body.length).toBe(2);
            expect(response.body[0]).toHaveProperty("name");
        });
    })

    //test getting an item by its id
    describe("Get item by id", () => {
        it("should return a single item by id", async () => {
            const item = await Item.create({
                name: "pear",
                price: 3,
                quantity: 5,
                category: "Fruit",
                expiryDate: "2025-12-01",
                imgUrl: "pear.jpg"
            });

            const response = await request(app)
                .get(`/api/items/${item._id}`)
                .expect(200);

            expect(response.body).toHaveProperty("name", "pear");
        });

        it("should return 404 if the item is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app).get(`/api/items/${fakeId}`).expect(404);
            expect(response.body).toHaveProperty("message", "Item not found");
        });
    });

    //test updating an item
    describe("Update an item", () => {
        it("should update an existing item", async () => {
            const item = await Item.create({
                name: "beef",
                price: 4,
                quantity: 8,
                category: "Meat",
                expiryDate: "2025-12-05",
                imgUrl: "beef.jpg"
            });

            const response = await request(app)
                .put(`/api/items/${item._id}`)
                .send({price: 6})
                .expect(200);

            expect(response.body).toHaveProperty("price", 6);

            const updated = await Item.findById(item._id);
            expect(updated.price).toBe(6);
        });

        it("should return 404 if the item is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app)
                .put(`/api/items/${fakeId}`)
                .send({price: 99})
                .expect(404);

            expect(response.body).toHaveProperty("message", "Item not found");
        });
    });


    //test deleting an item
    describe("Delete an item", () => {
        it("should delete an item", async () => {
            const item = await Item.create({
                name: "beef",
                price: 10,
                quantity: 2,
                category: "Meat",
                expiryDate: "2025-12-10",
                imgUrl: "beef.jpg"
            });

            const response = await request(app)
                .delete(`/api/items/${item._id}`)
                .expect(200);

            expect(response.body).toHaveProperty("message", "Item is deleted");

            const deleted = await Item.findById(item._id);
            expect(deleted).toBeNull();
        });

        it("should return 404 if the item is not found", async () => {
            const fakeId = new mongoose.Types.ObjectId();
            const response = await request(app).delete(`/api/items/${fakeId}`).expect(404);
            expect(response.body).toHaveProperty("message", "Item not found");
        });
    });
})