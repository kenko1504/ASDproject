import { jest } from '@jest/globals';
import { requestReceiptOCR, getAccessToken} from '../controllers/receiptUploadController.js';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Item from '../models/ingredient.js';
import multer from 'multer';

describe('ReceiptOCR Test', () => {
  let googleToken;
  let mongoServer;
  let app;

  beforeAll(async () => {
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
  });

  it('should return 400 when it receives mock request', async() => {
    
  });

  it('should return 500 when it receives non-image file', async() => {

  })

  it('should return empty response when the image contains no text', async() => {

  })

  it('should return 5 objects when it receives image with 5 items', async() => {

  })
  
  it('should convert kg to g when it receives image contains kg unit', async() => {

  })

  it('should return one weeks after from today if the receipt does not contain shoppingDate', async() => {
    
  })
});

// kg to g translation - get true

// list creation - 

// list modification