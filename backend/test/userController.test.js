import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { createUser } from '../controllers/userController.js';
import User from '../models/user.js';

describe('UserController Tests', () => {
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
    app.post('/api/users', createUser);
  });

  // Cleanup after all tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear database before each test
  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('createUser', () => {
    it('should create a new user successfully with valid data', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        gender: 'Male',
        age: 25,
        height: 180,
        weight: 75
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      // Check response structure (updated for new format)
      expect(response.body).toHaveProperty('message', 'Registration successful');
      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');

      // Check user object
      expect(response.body.user).toHaveProperty('username', 'testuser');
      expect(response.body.user).toHaveProperty('email', 'test@example.com');
      expect(response.body.user).toHaveProperty('role', 'user');
      expect(response.body.user).toHaveProperty('characteristics');
      expect(response.body.user.characteristics).toEqual({
        gender: 'Male',
        age: 25,
        height: 180,
        weight: 75
      });

      // Verify password is not included in response
      expect(response.body.user.password).toBeUndefined();

      // Verify token is a string
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBeGreaterThan(0);

      // Verify user was saved to database with hashed password
      const savedUser = await User.findOne({ username: 'testuser' });
      expect(savedUser).toBeTruthy();
      expect(savedUser.email).toBe('test@example.com');

      // Verify password is hashed in database
      expect(savedUser.password).not.toBe('password123');
      const isPasswordValid = await bcrypt.compare('password123', savedUser.password);
      expect(isPasswordValid).toBe(true);

      // Verify TOTP fields are initialized
      expect(savedUser.totpEnabled).toBe(false);
      expect(savedUser.totpSecret).toBeNull();
      expect(savedUser.backupCodes).toEqual([]);
    });

    it('should return 400 if username already exists', async () => {
      // Create first user
      const firstUser = {
        username: 'testuser',
        email: 'first@example.com',
        password: 'password123',
        gender: 'Male',
        age: 25,
        height: 180,
        weight: 75
      };

      await request(app)
        .post('/api/users')
        .send(firstUser)
        .expect(201);

      // Try to create second user with same username
      const duplicateUser = {
        username: 'testuser', // Same username
        email: 'second@example.com',
        password: 'password456',
        gender: 'Female',
        age: 30,
        height: 165,
        weight: 60
      };

      const response = await request(app)
        .post('/api/users')
        .send(duplicateUser)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Username or email already in use');
    });

    it('should return 400 if email already exists', async () => {
      // Create first user
      const firstUser = {
        username: 'firstuser',
        email: 'test@example.com',
        password: 'password123',
        gender: 'Male',
        age: 25,
        height: 180,
        weight: 75
      };

      await request(app)
        .post('/api/users')
        .send(firstUser)
        .expect(201);

      // Try to create second user with same email
      const duplicateUser = {
        username: 'seconduser',
        email: 'test@example.com', // Same email
        password: 'password456',
        gender: 'Female',
        age: 30,
        height: 165,
        weight: 60
      };

      const response = await request(app)
        .post('/api/users')
        .send(duplicateUser)
        .expect(400);

      expect(response.body).toHaveProperty('error', 'Username or email already in use');
    });

    it('should handle missing required fields', async () => {
      const incompleteUser = {
        username: 'testuser',
        // Missing email, password, etc.
      };

      const response = await request(app)
        .post('/api/users')
        .send(incompleteUser)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  // Tests Missing: updateUser, deleteUser, getSavedRecipe, addSavedRecipe, removeSavedRecipe
});