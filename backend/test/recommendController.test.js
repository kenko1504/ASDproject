import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { searchByQuery } from '../controllers/recommendController.js';
import FoodNutrition from '../models/foodNutrition.js';

describe('RecommendController Tests', () => {
  let mongoServer;
  let app;

  // Setup before all tests
  beforeAll(async () => {
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Connect to the in-memory database
    await mongoose.connect(mongoUri);

    // Setup Express app for testing
    app = express();
    app.use(express.json());
    app.get('/api/recommendations/search', searchByQuery);
  });

  // Cleanup after all tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear database before each test
  beforeEach(async () => {
    await FoodNutrition.deleteMany({});
  });

  describe('searchByQuery', () => {
    it('should return search results based on query parameters', async () => {
      // Seed database with test data
      await FoodNutrition.create([
        { foodName: 'Chicken', protein: 25, type: 'Meat' },
        { foodName: 'Spinach', protein: 3, type: 'Vegetable' },
      ]);

      const queryParams = {
        searchTerm: 'Chicken',
        foodType: 'Meat',
        filters: ['protein']
      };

      const response = await request(app)
        .get(`/api/recommendations/search?query=${encodeURIComponent(JSON.stringify(queryParams))}`)
        .expect(200);

      // Check response structure
      expect(response.body).toHaveProperty('results');
      expect(response.body.results).toHaveLength(1);
      expect(response.body.results[0]).toHaveProperty('foodName', 'Chicken');
      expect(response.body.results[0]).toHaveProperty('protein', 25);
    });

    it('should return an empty array if no results match the query', async () => {
      const queryParams = {
        searchTerm: 'Beef',
        foodType: 'Meat',
        filters: ['protein']
      };

      const response = await request(app)
        .get(`/api/recommendations/search?query=${encodeURIComponent(JSON.stringify(queryParams))}`)
        .expect(200);

      // Check response structure
      expect(response.body).toHaveProperty('results');
      expect(response.body.results).toHaveLength(0);
    });
  });
  describe('searchByNutrition', () => {
    it('should return an empty array if the user already reached nutrition goal', async() => {

    })
    it('should ')
  })
});