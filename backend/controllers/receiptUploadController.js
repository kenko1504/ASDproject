import { GoogleAuth } from "google-auth-library";
import axios from "axios"

//get token from google cloud server
export async function getAccessToken() {
  try {

    //Private Key Auth
    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.CLIENT_EMAIL,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
      },
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();

    return accessToken.token;
  } catch (error) {
    console.error('Failed to get Google Access Token:', error.message);
    throw error;
  }
}

//recieve img file and send request to google
export const requestReceiptOCR = async(req, res) => {
    try{
        // Verify is file exists before proceeding
        if (!req.file) {
            return res.status(400).json({ error: 'no file' });
        }

        //types other than these are not supported
        //google cloud blocks by itself, but added just in case
        const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        
        if (!allowedMimeTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ 
                error: 'Invalid file type. Only image files are allowed.',
                receivedType: req.file.mimetype
            });
        }
        
        const token = await getAccessToken()
        const base64Image = req.file.buffer.toString('base64');

        console.log(req.file.mimeType)
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

            let products = []
            let shoppingDate = ""

            const resultArr = response.data.document.entities;
            resultArr.forEach(element => {
                if(element.type === "Product"){
                    console.log(element)
                        let name = "";
                        let quantity = "";
                        let price = "";
                    element.properties.forEach(labels => {
                            if(labels.type === "ProductName"){
                                name = labels.mentionText;
                            }else if(labels.type === "Quantity"){

                                //integrate units to g(gram)
                                quantity = labels.mentionText;
                                if(quantity.includes(".") || quantity.includes("kg")){
                                    quantity = parseFloat(quantity.replace("kg","")) * 1000;
                                }else if(quantity.includes("g")){
                                    quantity = parseFloat(quantity.replace("g",""));
                                }else if(quantity.includes("L")){
                                    quantity = parseFloat(quantity.replace("L","")) * 1000;
                                }else if(quantity.includes("ml")){
                                    quantity = parseFloat(quantity.replace("ml",""));
                                }else if(quantity.includes("x")){
                                    const qty = quantity.split("x")[0];
                                    const weight = quantity.split("x")[1];
                                    quantity = parseInt(qty) * parseInt(weight);
                                }
                            }else if(labels.type === "Price"){
                                price = labels.mentionText;
                            }
                    })
                    products.push({
                        'name': name,
                        'quantity': quantity,
                        'price': price
                    });
                }else if(element.type === "ShoppingDate"){
                    shoppingDate = element.mentionText;
                }
            });
            //default expiry date = 7 days after shopping date
            if(!Date.parse(shoppingDate)){
                const sevenDaysLater = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                shoppingDate = sevenDaysLater.toISOString().split('T')[0];
            }
            const inputAutofills = {
                'products': products,
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
        throw error;
    }
}