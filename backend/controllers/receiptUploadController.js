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
            const resultArr = response.data.document.entities;
            
            console.log(resultArr)

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
                        if(element.mentionText.includes("x")){
                            const text = element.mentionText.replace('g', ''); // remove all whitespace
                            const qty = element.mentionText.split("x")[1].trim();
                            const unit = element.mentionText.split("x")[0].trim();
                            quantities.push(qty * unit);
                        }else if(element.mentionText.includes("kg")){
                            const text = element.mentionText.replace('kg', '').trim();
                            const qty = parseFloat(text) * 1000; // convert kg to g
                            quantities.push(qty);
                        }else{
                            const text = element.mentionText.replace('g', '').trim();
                            const qty = parseFloat(text);
                            quantities.push(qty);
                        }
                        break;
                    case 'ShoppingDate':
                        shoppingDate = element.mentionText
                        break;
                    default:
                        break;
                }
            });
            if(shoppingDate === ""){
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = String(currentDate.getMonth() + 1).padStart(2, '0');
                const day = String(currentDate.getDate()).padStart(2, '0');
                shoppingDate = `${year}-${month}-${day}`;
            }
            const inputAutofills = {
                'names': productNames,
               'quantities': quantities,
                'prices': prices,
                'shoppingDate': shoppingDate
            }
            console.log(inputAutofills)
            res.status(200).json({result:"success", data: inputAutofills})
        }
    }catch(error){
        res.status(500).json({
            success: false,
            error: error.response?.data || error.message
        });
    }
}