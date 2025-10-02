import { jest } from '@jest/globals';
import { requestReceiptOCR } from '../controllers/receiptUploadController.js';

// Mock modules before importing
jest.unstable_mockModule('google-auth-library', () => ({
  GoogleAuth: jest.fn()
}));

jest.unstable_mockModule('axios', () => ({
  default: {
    post: jest.fn()
  }
}));

describe('Receipt OCR Tests', () => {
  let mockReq;
  let mockRes;
  let mockGetAccessToken;
  let mockGetClient;

  beforeEach(() => {
    // Request Mock
    mockReq = {
      file: null
    };

    // Response Mock
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    // Google Auth Mock setup
    mockGetAccessToken = jest.fn().mockResolvedValue({
      token: 'mock-access-token'
    });

    mockGetClient = jest.fn().mockResolvedValue({
      getAccessToken: mockGetAccessToken
    });

    GoogleAuth.mockImplementation(() => ({
      getClient: mockGetClient
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 400 error when no file is provided', async () => {
    mockReq.file = null;

    await requestReceiptOCR(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({ error: 'no file' });
  });
  test('should handle access token retrieval failure', async () => {
    mockReq.file = {
      buffer: Buffer.from('fake-image-data'),
      mimetype: 'image/jpeg'
    };

    mockGetAccessToken.mockRejectedValue(new Error('Auth Error'));

    await requestReceiptOCR(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
  });

});