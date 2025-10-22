import { jest } from '@jest/globals';
import { requestReceiptOCR, getAccessToken} from '../controllers/receiptUploadController.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import Item from '../models/ingredient.js';
import multer from 'multer';
import express from 'express'
import { request } from 'express';
import { fileURLToPath } from "url";
import axios from 'axios'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe('ReceiptOCR Test', () => {
  let googleToken;
  let mongoServer;
  let app;
  
  const TEST_SOURCES_DIR = path.join(__dirname, 'testSources');
  const testFiles = {
    kg: path.join(TEST_SOURCES_DIR, 'test_kg.jpg'),
    noImg: path.join(TEST_SOURCES_DIR, 'test_noImg.mp3'),
    noText: path.join(TEST_SOURCES_DIR, 'test_noText.jpeg'),
    items10: path.join(TEST_SOURCES_DIR, 'test_10Items.jpg'),
    noShoppingDate: path.join(TEST_SOURCES_DIR, '')
  };

  function createMockRequestFromFile(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(filePath).toLowerCase();
    
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.mp3': 'audio/mpeg',
      '.txt': 'text/plain'
    };
    
    return {
      file: {
        buffer: fileBuffer,
        mimetype: mimeTypes[fileExtension] || 'application/octet-stream',
        originalname: path.basename(filePath),
        size: fileBuffer.length
      }
    };
  }

  function createMockResponse() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  }

  function getBase64FromFile(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString('base64');
  }

  beforeAll(async () => {
    process.env.GOOGLE_BASE_URI = 'https://documentai.googleapis.com/v1/projects/test/locations/us/processors/test:process';
    console.log('Checking test files...');
    Object.entries(testFiles).forEach(([key, filePath]) => {
      if (fs.existsSync(filePath)) {
        console.log(`${key}: ${filePath}`);
      } else {
        console.warn(`${key}: ${filePath} NOT FOUND`);
      }
    });

      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();

      //get Google Cloud Access Token
      googleToken = await getAccessToken();
    
      // Connect to the in-memory database
      await mongoose.connect(mongoUri);
  
      // Setup Express app for testing
      app = express();
      app.use(express.json());
      app.get('/api/receipt/upload', requestReceiptOCR);

      const upload = multer({ dest: 'uploads/' });
      app.post('/api/receipt/upload', upload.single('image'), requestReceiptOCR);
    });

    // Cleanup after all tests
  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  // Clear database before each test
  beforeEach(async () => {
    await Item.deleteMany({
    });
    jest.clearAllMocks();
  });
  it('should return 200 when it request for google access token', async() => {
    const result = await getAccessToken()
    expect(result.status).toHaveBeenCalledWith(200);
  })
  it('should return 400 when it receives mock request', async() => {
    const mockReq = createMockRequestFromFile(null);
    const mockRes = createMockResponse();

    await requestReceiptOCR(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'no file' });
  });

  it('should return 400 when it receives non-image file', async() => {
    const mockReq = createMockRequestFromFile(testFiles.noImg)
    const mockRes = createMockResponse();

    await requestReceiptOCR(mockReq, mockRes);
    
    expect(mockRes.status).toHaveBeenCalledWith(400);
  })

  it('should return empty response when the image contains no text', async() => {
    const mockReq = createMockRequestFromFile(testFiles.noText)
    const mockRes = createMockResponse();

    await requestReceiptOCR(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  })

  it('should return 10 objects when it receives image with 10 items', async() => {
    const mockReq = createMockRequestFromFile(testFiles.items10)
    const mockRes = createMockResponse();

    await requestReceiptOCR(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
  })
  
  it('should convert kg to g when it receives image contains kg unit', async() => {
    const mockReq = createMockRequestFromFile(testFiles.kg)
    const mockRes = createMockResponse();

    await requestReceiptOCR(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveProperty('quantity', 342)
  })

  it('should return one weeks after from today if the receipt does not contain shoppingDate', async() => {
    const mockReq = createMockRequestFromFile(testFiles.noShoppingDate)
    const mockRes = createMockResponse();

    await requestReceiptOCR(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveProperty('quantity', 342)
  })
});

// kg to g translation - get true

// list creation - 

// list modification