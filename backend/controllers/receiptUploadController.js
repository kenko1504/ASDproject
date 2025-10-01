import { GoogleAuth } from "google-auth-library";
import multer from "multer";
import axios from "axios"

function getUploadedImage(){

}

//get token from google cloud server
async function getAccessToken() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
}

export const requestReceiptOCR = async(req, res) => {
  const token = getAccessToken()
  const header = {
    headers:{
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json; charset=utf-8'
    }
  }
  const response = await axios.post(process.env.GOOGLE_BASE_URI, header)
}