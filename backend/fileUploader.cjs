require('dotenv').config();
const { exec } = require('child_process');

const csvFile = 'NutritionInfo_clean.csv'; // csv file name
const collection = 'foodData'; // collection name

const mongoUri = process.env.MONGO_URI;

const cmd = `mongoimport --uri="${mongoUri}" --collection="${collection}" --type=csv --headerline --file="${csvFile}"`;

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});