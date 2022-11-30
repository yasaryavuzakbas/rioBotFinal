const { GoogleSpreadsheet } = require('google-spreadsheet');
const doc = new GoogleSpreadsheet('1QA1Pw4WIjgJ4fIgQKrCVja8Smji7VyhU');
require('dotenv').config();
const creds = require('./creds.json')

async function get(){
  console.log(creds.private_key);
  await doc.useApiKey({
    key: creds.private_key
  });
  await doc.loadInfo()
  console.log(doc.title);


}
get()