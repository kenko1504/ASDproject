import { GoogleAuth } from "google-auth-library";
import axios from "axios"


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
    try{
        const token = getAccessToken()

        if (!req.file) {
        return res.status(400).json({ error: 'no file' });
        }
        const base64Image = req.file.buffer.toString('base64');
        const header = {
        headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json; charset=utf-8'
        }
    }
    const response = await axios.post(
        process.env.GOOGLE_BASE_URI,
        {
            rawDocument: {
            content: base64Image,
            mimeType: req.file.mimetype
            }
        },
        {
            header
        }
    )
    }catch(error){
        console.log(error)
    }
    
}