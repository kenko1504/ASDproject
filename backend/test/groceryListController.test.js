// Testing framework and utilities
import request from 'supertest';  // For making HTTP requests to test API endpoints
import express from 'express';    // Express app for creating test server
import mongoose from 'mongoose';  // MongoDB ODM for database operations

// MongoDB testing utilities
import { MongoMemoryServer } from 'mongodb-memory-server';  // In-memory MongoDB for testing

// Import controllers to test - these are the actual functions we're testing
import { 
  createList,    // Creates a new grocery list
  getLists,      // Gets all grocery lists for a user
  updateList,    // Updates an existing grocery list
  deleteList,    // Deletes a grocery list
  createItem,    // Creates a new item in a grocery list
  getItems,      // Gets all items in a grocery list
  updateItem,    // Updates an existing item (including checked status)
  deleteItem     // Deletes an item from a grocery list
} from '../controllers/groceryListcontroller.js';

// Import models for direct database operations in tests
import GroceryList from '../models/groceryList.js';  // Grocery list model
import GroceryItem from '../models/item.js';         // Grocery item model
import User from '../models/user.js';                // User model

describe('GroceryList Controller Tests', () => {
  // Test variables - these will be shared across all tests
  let mongoServer;  // In-memory MongoDB server instance
  let app;          // Express app for testing HTTP endpoints
  let testUserId;   // ID of test user created for each test
  let testListId;   // ID of test grocery list (used in item tests)

  // Setup before all tests - runs once before the entire test suite
  beforeAll(async () => {
    // Create in-memory MongoDB instance (no real database needed for testing)
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);

    // Setup Express app for testing - mimics our actual server
    app = express();
    app.use(express.json());  // Enable JSON parsing for request bodies
    
    // Setup routes - these mirror the actual API routes in your server
    app.post('/GroceryLists/:UID', createList);         // Create grocery list
    app.get('/GroceryLists/:UID', getLists);            // Get all lists for user
    app.put('/GroceryLists/:GL_ID', updateList);        // Update grocery list
    app.delete('/GroceryLists/:GL_ID', deleteList);     // Delete grocery list
    app.post('/GroceryLists/:GL_ID/items', createItem); // Create item in list
    app.get('/GroceryLists/:GL_ID/items', getItems);    // Get all items in list
    app.put('/GroceryLists/item/:ITEM_ID', updateItem); // Update item (including checked status)
    app.delete('/GroceryLists/item/:ITEM_ID', deleteItem); // Delete item
  });

  // Cleanup after all tests - runs once after the entire test suite
  afterAll(async () => {
    await mongoose.disconnect();  // Close database connection
    await mongoServer.stop();     // Stop the in-memory MongoDB server
  });

  // Setup test data before each individual test - ensures clean state
  beforeEach(async () => {
    // Clear all collections to start with empty database for each test
    // This ensures tests don't interfere with each other
    await User.deleteMany({});
    await GroceryList.deleteMany({});
    await GroceryItem.deleteMany({});

    // Create a fresh test user for each test
    // This user will be used as the owner of grocery lists and items
    const testUser = new User({
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedpassword',  // In real app, this would be bcrypt hashed
      characteristics: {
        gender: 'Male',
        age: 25,
        height: 180,
        weight: 75
      }
    });
    const savedUser = await testUser.save();
    testUserId = savedUser._id.toString();  // Store user ID for use in tests
  });

  describe('Grocery List CRUD Operations', () => {
    // Test the createList controller function
    describe('createList', () => {
      it('should create a new grocery list successfully', async () => {
        // Prepare test grocery list data
        const listData = {
          name: 'Weekly Groceries',
          date: new Date().toISOString(),
          note: 'Shopping for the week',
          status: 'active'
        };

        // Make HTTP POST request to create list endpoint
        const response = await request(app)
          .post(`/GroceryLists/${testUserId}`)  // Use our test user ID
          .send(listData)                       // Send the list data
          .expect(201);                         // Expect HTTP 201 (Created)

        // Verify response contains expected data
        expect(response.body).toHaveProperty('name', 'Weekly Groceries');
        expect(response.body).toHaveProperty('note', 'Shopping for the week');
        expect(response.body).toHaveProperty('status', 'active');
        expect(response.body).toHaveProperty('user', testUserId);

        // Double-check by querying database directly
        // This ensures the data was actually saved, not just returned
        const savedList = await GroceryList.findById(response.body._id);
        expect(savedList).toBeTruthy();
        expect(savedList.name).toBe('Weekly Groceries');
      });

      // Duplicate list names should be rejected
      it('should return 400 for duplicate list name', async () => {
        // First, create a list successfully
        const listData = {
          name: 'Weekly Groceries',
          date: new Date().toISOString(),
          note: 'First list',
          status: 'active'
        };

        await request(app)
          .post(`/GroceryLists/${testUserId}`)
          .send(listData)
          .expect(201);  // This should succeed

        // Now try to create another list with the same name
        const duplicateList = {
          name: 'Weekly Groceries', // Same name as above - should cause error
          date: new Date().toISOString(),
          note: 'Duplicate list',
          status: 'active'
        };

        const response = await request(app)
          .post(`/GroceryLists/${testUserId}`)
          .send(duplicateList)
          .expect(400);  // Expect HTTP 400 (Bad Request)

        // Verify the error message matches what our controller returns
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
          .post(`/GroceryLists/${fakeUserId}`)
          .send(listData)
          .expect(404);

        expect(response.body).toHaveProperty('error', 'User not found');
      });
    });

    // Test the getLists controller function
    describe('getLists', () => {
      it('should get all lists for a user', async () => {
        // Create test lists directly in database (bypassing API for setup)
        // This simulates lists that already exist for the user
        const list1 = new GroceryList({
          name: 'List 1',
          user: testUserId,        // Associate with our test user
          date: new Date(),
          note: 'First list',
          status: 'active'
        });
        const list2 = new GroceryList({
          name: 'List 2',
          user: testUserId,        // Same user, different list
          date: new Date(),
          note: 'Second list',
          status: 'completed'      // Different status to test variety
        });

        // Save both lists to database
        await list1.save();
        await list2.save();

        // Now test the GET endpoint to retrieve all lists
        const response = await request(app)
          .get(`/GroceryLists/${testUserId}`)
          .expect(200);  // Expect HTTP 200 (OK)

        // Verify response is an array containing both lists
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(2);
        expect(response.body[0]).toHaveProperty('name', 'List 1');
        expect(response.body[1]).toHaveProperty('name', 'List 2');
      });
    });

    describe('updateList', () => {
      it('should update a grocery list successfully', async () => {
        // Create a test list
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
          .put(`/GroceryLists/${savedList._id}`)
          .send(updateData)
          .expect(200);

        expect(response.body).toHaveProperty('name', 'Updated Name');
        expect(response.body).toHaveProperty('note', 'Updated note');
        expect(response.body).toHaveProperty('status', 'completed');
      });
    });

    describe('deleteList', () => {
      it('should delete a grocery list successfully', async () => {
        // Create a test list
        const testList = new GroceryList({
          name: 'To Be Deleted',
          user: testUserId,
          date: new Date(),
          note: 'Will be deleted',
          status: 'active'
        });
        const savedList = await testList.save();

        await request(app)
          .delete(`/GroceryLists/${savedList._id}`)
          .expect(200);

        // Verify deletion
        const deletedList = await GroceryList.findById(savedList._id);
        expect(deletedList).toBeNull();
      });
    });
  });

  // Test grocery item operations - these require a grocery list to exist first
  describe('Grocery Item CRUD Operations', () => {
    // Additional setup for item tests - runs before each item test
    beforeEach(async () => {
      // Create a test grocery list that items can be added to
      // Items always belong to a specific grocery list
      const testList = new GroceryList({
        name: 'Test List for Items',
        user: testUserId,  // Associate with our test user
        date: new Date(),
        note: 'For testing items',
        status: 'active'
      });
      const savedList = await testList.save();
      testListId = savedList._id.toString();  // Store list ID for use in item tests
    });

    // Test the createItem controller function
    describe('createItem', () => {
      // Happy path test - creating a valid grocery item
      it('should create a new grocery item successfully', async () => {
        // Prepare item data - minimum required fields for creating an item
        const itemData = {
          name: 'Milk',
          quantity: 2,
          category: 'Drink'  // Must be one of the enum values in our model
        };

        // Make HTTP POST request to create item in our test grocery list
        const response = await request(app)
          .post(`/GroceryLists/${testListId}/items`)  // Add to our test list
          .send(itemData)
          .expect(201);  // Expect HTTP 201 (Created)

        // Verify response contains expected data
        expect(response.body).toHaveProperty('name', 'Milk');
        expect(response.body).toHaveProperty('quantity', 2);
        expect(response.body).toHaveProperty('category', 'Drink');
        expect(response.body).toHaveProperty('groceryList', testListId);
        expect(response.body).toHaveProperty('checked', false);  // Should default to unchecked

        // Double-check by querying database directly
        const savedItem = await GroceryItem.findById(response.body._id);
        expect(savedItem).toBeTruthy();
        expect(savedItem.name).toBe('Milk');
      });

      it('should return 400 for negative quantity', async () => {
        const itemData = {
          name: 'Invalid Item',
          quantity: -1, // Negative quantity
          category: 'Other'
        };

        const response = await request(app)
          .post(`/GroceryLists/${testListId}/items`)
          .send(itemData)
          .expect(400);

        expect(response.body).toHaveProperty('error', 'Quantity cannot be negative.');
      });

      it('should return 404 for non-existent grocery list', async () => {
        const fakeListId = new mongoose.Types.ObjectId().toString();
        const itemData = {
          name: 'Test Item',
          quantity: 1,
          category: 'Other'
        };

        const response = await request(app)
          .post(`/GroceryLists/${fakeListId}/items`)
          .send(itemData)
          .expect(404);

        expect(response.body).toHaveProperty('error', 'Grocery list not found');
      });
    });

    describe('getItems', () => {
      it('should get all items for a grocery list', async () => {
        // Create test items
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
          .get(`/GroceryLists/${testListId}/items`)
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

    // Test the updateItem controller function
    describe('updateItem', () => {
      // Test updating an item including the checked status (important for grocery app functionality)
      it('should update a grocery item successfully including checked status', async () => {
        // First, create an item to update (setup for this specific test)
        const testItem = new GroceryItem({
          name: 'Original Item',
          quantity: 1,
          category: 'Other',
          groceryList: testListId,  // Associate with our test list
          price: 0,                 // Required field from model
          expiryDate: new Date(),   // Required field from model
          checked: false            // Start as unchecked
        });
        const savedItem = await testItem.save();

        // Prepare update data - testing multiple field updates including checked status
        const updateData = {
          name: 'Updated Item',    // Changed name
          quantity: 3,             // Changed quantity
          category: 'Meat',        // Changed category
          checked: true            // Changed to checked - important for grocery list functionality
        };

        // Make HTTP PUT request to update the item
        const response = await request(app)
          .put(`/GroceryLists/item/${savedItem._id}`)
          .send(updateData)
          .expect(200);  // Expect HTTP 200 (OK)

        // Verify all fields were updated correctly
        expect(response.body).toHaveProperty('name', 'Updated Item');
        expect(response.body).toHaveProperty('quantity', 3);
        expect(response.body).toHaveProperty('category', 'Meat');
        expect(response.body).toHaveProperty('checked', true);  // This is crucial for the strikethrough feature
      });
    });

    describe('deleteItem', () => {
      it('should delete a grocery item successfully', async () => {
        // Create a test item
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
          .delete(`/GroceryLists/item/${savedItem._id}`)
          .expect(200);

        // Verify deletion
        const deletedItem = await GroceryItem.findById(savedItem._id);
        expect(deletedItem).toBeNull();
      });
    });
  });
});