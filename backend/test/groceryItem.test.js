import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
  createItem,
  getItems,
  updateItem,
  deleteItem
} from '../controllers/groceryListcontroller.js';
import GroceryList from '../models/groceryList.js';
import GroceryItem from '../models/groceryItem.js';

describe('Grocery Item Controller Tests', () => {
  let mongoServer;
  let app;
  let testListId;
  let testUserId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    app = express();
    app.use(express.json());

    app.post('/:uid/list/:gid/item', createItem);
    app.get('/:uid/list/:gid/items', getItems);
    app.put('/:uid/list/:gid/item/:itemID', updateItem);
    app.delete('/:uid/list/:gid/item/:itemID', deleteItem);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await GroceryList.deleteMany({});
    await GroceryItem.deleteMany({});

    testUserId = new mongoose.Types.ObjectId();
    
    const testList = new GroceryList({
      name: 'Test List for Items',
      user: testUserId,
      date: new Date(),
      note: 'For testing items',
      status: 'active'
    });
    const savedList = await testList.save();
    testListId = savedList._id.toString();
  });

  describe('createItem', () => {
    it('creates item successfully', async () => {
      const itemData = {
        name: 'Milk',
        quantity: 2,
        category: 'Drink'
      };

      const response = await request(app)
        .post(`/${testUserId}/list/${testListId}/item`)
        .send(itemData)
        .expect(201);

      expect(response.body).toHaveProperty('name', 'Milk');
      expect(response.body).toHaveProperty('quantity', 2);
      expect(response.body).toHaveProperty('category', 'Drink');
      expect(response.body).toHaveProperty('groceryList', testListId);
      expect(response.body).toHaveProperty('checked', false);

      const savedItem = await GroceryItem.findById(response.body._id);
      expect(savedItem).toBeTruthy();
      expect(savedItem.name).toBe('Milk');
    });

    it('rejects negative quantity', async () => {
      const itemData = {
        name: 'Invalid Item',
        quantity: -1,
        category: 'Other'
      };

      const response = await request(app)
        .post(`/${testUserId}/list/${testListId}/item`)
        .send(itemData)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Quantity cannot be negative.');
    });

    it('rejects non-existent list', async () => {
      const fakeListId = new mongoose.Types.ObjectId().toString();
      const itemData = {
        name: 'Test Item',
        quantity: 1,
        category: 'Other'
      };

      const response = await request(app)
        .post(`/${testUserId}/list/${fakeListId}/item`)
        .send(itemData)
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Grocery list not found or doesn\'t belong to this user');
    });


  });

  describe('getItems', () => {
    it('gets all items', async () => {
      const item1 = new GroceryItem({
        name: 'Bread',
        quantity: 1,
        category: 'Other',
        groceryList: testListId,
        price: 0,
        expiryDate: new Date(),
        checked: false
      });
      const item2 = new GroceryItem({
        name: 'Apples',
        quantity: 5,
        category: 'Fruit',
        groceryList: testListId,
        price: 0,
        expiryDate: new Date(),
        checked: true
      });

      await item1.save();
      await item2.save();

      const response = await request(app)
        .get(`/${testUserId}/list/${testListId}/items`)
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('groceryList');
      expect(Array.isArray(response.body.items)).toBe(true);
      expect(response.body.items).toHaveLength(2);

      const itemNames = response.body.items.map(item => item.name);
      expect(itemNames).toContain('Bread');
      expect(itemNames).toContain('Apples');
    });
  });

  describe('updateItem', () => {
    it('updates item successfully', async () => {
      const testItem = new GroceryItem({
        name: 'Original Item',
        quantity: 1,
        category: 'Other',
        groceryList: testListId,
        price: 0,
        expiryDate: new Date(),
        checked: false
      });
      const savedItem = await testItem.save();

      const updateData = {
        name: 'Updated Item',
        quantity: 3,
        category: 'Meat',
        checked: true
      };

      const response = await request(app)
        .put(`/${testUserId}/list/${testListId}/item/${savedItem._id}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty('name', 'Updated Item');
      expect(response.body).toHaveProperty('quantity', 3);
      expect(response.body).toHaveProperty('category', 'Meat');
      expect(response.body).toHaveProperty('checked', true);
    });
  });

  describe('deleteItem', () => {
    it('deletes item successfully', async () => {
      const testItem = new GroceryItem({
        name: 'To Be Deleted',
        quantity: 1,
        category: 'Other',
        groceryList: testListId,
        price: 0,
        expiryDate: new Date(),
        checked: false
      });
      const savedItem = await testItem.save();

      await request(app)
        .delete(`/${testUserId}/list/${testListId}/item/${savedItem._id}`)
        .expect(200);

      const deletedItem = await GroceryItem.findById(savedItem._id);
      expect(deletedItem).toBeNull();
    });
  });
});