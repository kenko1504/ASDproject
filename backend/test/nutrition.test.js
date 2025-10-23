import { jest } from '@jest/globals';
import { getDailyNutritionRequirements } from '../controllers/nutritionController.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import express from 'express';

describe('Nutrition API Test', () => {
  let mongoServer;
  let app;

  function createMockRequest(biometricData, nutritionPlan) {
  return {
    body: {
      characteristics: biometricData,      
      nutritionPlan: nutritionPlan          
    }
  };
}

  function createMockResponse() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  }

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    await mongoose.connect(mongoUri);

    app = express();
    app.use(express.json());
    app.post('/api/nutrition/dailyReq', getDailyNutritionRequirements);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('T601: should return 200 OK when sending valid biometric information', async () => {
    const validBiometricData = {
      age: 22,
      gender: 'Female',
      height: 175,
      weight: 70,
    };
    const nutritionPlan = "maintenance"

    const mockReq = createMockRequest(validBiometricData, nutritionPlan);
    console.log(mockReq)
      console.log('1. mockReq:', JSON.stringify(mockReq, null, 2));
  console.log('2. mockReq.body:', mockReq.body);
  console.log('3. mockReq.body.characteristics:', mockReq.body.characteristics);
  console.log('4. Is characteristics undefined?', mockReq.body.characteristics === undefined);
  
    const mockRes = createMockResponse();



    const result = await getDailyNutritionRequirements(mockReq, mockRes);
      console.log('Was status called?', mockRes.status.mock.calls.length > 0);
    console.log('Status called with:', mockRes.status.mock.calls[0]); // [200] 또는 [500]
    console.log('Json called with:', mockRes.json.mock.calls[0]); // [{ calories: ... }]

    expect(mockRes.status).toHaveBeenCalledWith(200);
  });

  it('T602: should return 500 Internal Server Error when weight is 0', async () => {
    const invalidBiometricData = {
      age: 25,
      gender: 'Male',
      height: 175,
      weight: 0,
    };
    const nutritionPlan = ""

    const mockReq = createMockRequest(invalidBiometricData, nutritionPlan);
    const mockRes = createMockResponse();

    await getDailyNutritionRequirements(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.any(String)
      })
    );
  });
});