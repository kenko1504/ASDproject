import { GoogleAuth } from "google-auth-library";
import axios from "axios"

//get token from google cloud server
async function getAccessToken() {
  const auth = new GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse;
}

//recieve img file and send request to google
export const requestReceiptOCR = async(req, res) => {
    try{
        const token = (await getAccessToken()).token

        if (!req.file) {
            return res.status(400).json({ error: 'no file' });
        }
        const base64Image = req.file.buffer.toString('base64');
        const response = await axios.post(
            process.env.GOOGLE_BASE_URI,
            {
                rawDocument: {
                content: base64Image,
                mimeType: req.file.mimetype
                }
            },
            {
                headers:{
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }
        )
        if(response){
            const resultArr = response.data.entities;
            
            let productNames = []
            let quantities = []
            let prices = []
            let shoppingDate = ""

            resultArr.forEach(element => {
                switch(element.type){
                    case 'ProductName':
                        productNames.push(element.mentionText)
                        break;
                    case 'Price':
                        prices.push(element.mentionText)
                        break;
                    case 'Quantity':
                        quantities.push(element.mentionText)
                        break;
                    case 'shoppingDate':
                        shoppingDate = element.mentionText
                        break;
                    default:
                        break;
                }
            });
            const inputAutofills = {
                'names': productNames,
               'quantities': quantities,
                'prices': prices,
                'shoppingDate': shoppingDate
            }
            res.status(200).json({result:"success", data: inputAutofills})
        }
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
}