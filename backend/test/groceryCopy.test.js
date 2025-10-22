import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { copyList } from '../controllers/groceryListcontroller.js';
import GroceryList from '../models/groceryList.js';
import GroceryItem from '../models/groceryItem.js';
import User from '../models/user.js';

describe('Copy List Controller Tests', () => {
  let mongoServer;
  let app;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    app = express();
    app.use(express.json());
    app.post('/:uid/list/:gid/copy', copyList);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await GroceryList.deleteMany({});
    await GroceryItem.deleteMany({});
  });

  describe('copyList', () => {
    it('should successfully copy a grocery list with all items', async () => {
      // Create test user
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();

      // Create original list
      const originalList = new GroceryList({
        name: 'Original List',
        user: user._id,
        note: 'Test note',
        status: 'active',
        date: new Date()
      });
      await originalList.save();

      // Create items for original list
      const item1 = new GroceryItem({
        name: 'Apple',
        quantity: 5,
        category: 'Fruit',
        checked: true,
        groceryList: originalList._id
      });
      const item2 = new GroceryItem({
        name: 'Bread',
        quantity: 2,
        category: 'Other',
        checked: false,
        groceryList: originalList._id
      });
      await item1.save();
      await item2.save();

      const response = await request(app)
        .post(`/${user._id}/list/${originalList._id}/copy`)
        .send({ name: 'Copied List' });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Copied List');
      expect(response.body.user).toBe(user._id.toString());
      expect(response.body.note).toBe('Test note');
      expect(response.body.status).toBe('active');

      // Verify items were copied
      const copiedItems = await GroceryItem.find({ groceryList: response.body._id });
      expect(copiedItems).toHaveLength(2);
      
      // Verify items are reset to unchecked
      copiedItems.forEach(item => {
        expect(item.checked).toBe(false);
      });

      // Verify item names and quantities
      const itemNames = copiedItems.map(item => item.name);
      expect(itemNames).toContain('Apple');
      expect(itemNames).toContain('Bread');
    });

    it('should return 404 if user not found', async () => {
      const response = await request(app)
        .post('/507f1f77bcf86cd799439011/list/507f1f77bcf86cd799439012/copy')
        .send({ name: 'Copied List' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('User not found');
    });

    it('should return 404 if original list not found or unauthorized', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();

      const response = await request(app)
        .post(`/${user._id}/list/507f1f77bcf86cd799439012/copy`)
        .send({ name: 'Copied List' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Grocery list not found or unauthorized access');
    });

    it('should return 400 if list with new name already exists', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();

      const originalList = new GroceryList({
        name: 'Original List',
        user: user._id,
        note: 'Test note',
        status: 'active',
        date: new Date()
      });
      await originalList.save();

      // Create existing list with same name we want to copy to
      const existingList = new GroceryList({
        name: 'Copied List',
        user: user._id,
        note: 'Existing note',
        status: 'active',
        date: new Date()
      });
      await existingList.save();

      const response = await request(app)
        .post(`/${user._id}/list/${originalList._id}/copy`)
        .send({ name: 'Copied List' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('A grocery list with this name already exists.');
    });

    it('should handle copying a list with no items', async () => {
      const user = new User({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();

      const originalList = new GroceryList({
        name: 'Empty List',
        user: user._id,
        note: 'Test note',
        status: 'active',
        date: new Date()
      });
      await originalList.save();

      const response = await request(app)
        .post(`/${user._id}/list/${originalList._id}/copy`)
        .send({ name: 'Copied Empty List' });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Copied Empty List');

      // Verify no items were copied
      const copiedItems = await GroceryItem.find({ groceryList: response.body._id });
      expect(copiedItems).toHaveLength(0);
    });
  });
});