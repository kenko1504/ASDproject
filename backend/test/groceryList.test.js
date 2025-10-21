import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
  createList,
  getLists,
  updateList,
  deleteList
} from '../controllers/groceryListcontroller.js';
import GroceryList from '../models/groceryList.js';
import User from '../models/user.js';

describe('GroceryList Controller Tests', () => {
  let mongoServer;
  let app;
  let testUserId;
  let testListId;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    app = express();
    app.use(express.json());
    
    app.post('/:uid', createList);
    app.get('/:uid', getLists);
    app.put('/:uid/list/:gid', updateList);
    app.delete('/:uid/list/:gid', deleteList);
  });
  
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await GroceryList.deleteMany({});

    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',
      characteristics: {
        gender: 'Male',
        age: 25,
        height: 180,
        weight: 75
      }
    });
    const savedUser = await testUser.save();
    testUserId = savedUser._id.toString();
  });

  describe('Grocery List CRUD Operations', () => {
    describe('createList', () => {
      it('should create a new grocery list successfully', async () => {
        const listData = {
          name: 'Weekly Groceries',
          date: new Date().toISOString(),
          note: 'Shopping for the week',
          status: 'active'
        };

        const response = await request(app)
          .post(`/${testUserId}`)
          .send(listData)
          .expect(201);

        expect(response.body).toHaveProperty('name', 'Weekly Groceries');
        expect(response.body).toHaveProperty('note', 'Shopping for the week');
        expect(response.body).toHaveProperty('status', 'active');
        expect(response.body).toHaveProperty('user', testUserId);

        const savedList = await GroceryList.findById(response.body._id);
        expect(savedList).toBeTruthy();
        expect(savedList.name).toBe('Weekly Groceries');
      });

      it('should return 400 for duplicate list name', async () => {
        const listData = {
          name: 'Weekly Groceries',
          date: new Date().toISOString(),
          note: 'First list',
          status: 'active'
        };

        await request(app)
          .post(`/${testUserId}`)
          .send(listData)
          .expect(201);

        const duplicateList = {
          name: 'Weekly Groceries',
          date: new Date().toISOString(),
          note: 'Duplicate list',
          status: 'active'
        };

        const response = await request(app)
          .post(`/${testUserId}`)
          .send(duplicateList)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'A grocery list with this name already exists.');
      });

      it('should return 404 for non-existent user', async () => {
        const fakeUserId = new mongoose.Types.ObjectId().toString();
        const listData = {
          name: 'Test List',
          date: new Date().toISOString(),
          note: 'Test note',
          status: 'active'
        };

        const response = await request(app)
          .post(`/${fakeUserId}`)
          .send(listData)
          .expect(404);

        expect(response.body).toHaveProperty('error', 'User not found');
      });
    });

    describe('getLists', () => {
      it('should get all lists for a user', async () => {
        const list1 = new GroceryList({
          name: 'List 1',
          user: testUserId,
          date: new Date(),
          note: 'First list',
          status: 'active'
        });
        const list2 = new GroceryList({
          name: 'List 2',
          user: testUserId,
          date: new Date(),
          note: 'Second list',
          status: 'completed'
        });

        await list1.save();
        await list2.save();

        const response = await request(app)
          .get(`/${testUserId}`)
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toHaveProperty('name', 'List 1');
        expect(response.body[1]).toHaveProperty('name', 'List 2');
      });
    });

    describe('updateList', () => {
      it('should update a grocery list successfully', async () => {
        const testList = new GroceryList({
          name: 'Original Name',
          user: testUserId,
          date: new Date(),
          note: 'Original note',
          status: 'active'
        });
        const savedList = await testList.save();

        const updateData = {
          name: 'Updated Name',
          date: new Date().toISOString(),
          note: 'Updated note',
          status: 'completed'
        };

        const response = await request(app)
          .put(`/${testUserId}/list/${savedList._id}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty('name', 'Updated Name');
        expect(response.body).toHaveProperty('note', 'Updated note');
        expect(response.body).toHaveProperty('status', 'completed');
      });
    });

    describe('deleteList', () => {
      it('should delete a grocery list successfully', async () => {
        const testList = new GroceryList({
          name: 'To Be Deleted',
          user: testUserId,
          date: new Date(),
          note: 'Will be deleted',
          status: 'active'
        });
        const savedList = await testList.save();

        await request(app)
          .delete(`/${testUserId}/list/${savedList._id}`)
          .expect(200);

        const deletedList = await GroceryList.findById(savedList._id);
        expect(deletedList).toBeNull();
      });
    });
  });
});