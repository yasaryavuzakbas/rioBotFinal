const fs = require('fs').promises;
const path = require('path');
const process = require('process');
const {authenticate} = require('@google-cloud/local-auth');
const {google} = require('googleapis');
const { Client, Intents } = require('discord.js');
global.client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_VOICE_STATES
    ]
    // disableMentions: 'everyone',
});

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');


async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

async function listMajors(auth) {
    let data=[]
  const sheets = google.sheets({version: 'v4', auth});
  const res = await sheets.spreadsheets.get({
    spreadsheetId: '1If0-bcs3dlXeuBZT4mpOjNOD02Kh9WkeG4aVQTpFipI',
    includeGridData:true
  });
  const rows = res;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }

for(let i =1;i<rows.data.sheets[0].data[0].rowData.length;i++){
    let row =rows.data.sheets[0].data[0].rowData[i].values
    if(i>4&&row[0]==undefined)break
    if(row[2].formattedValue!==undefined&&row[4].formattedValue!==undefined&&row[1].formattedValue!==undefined&&row[4].userEnteredFormat.numberFormat?.type==='DATE'&&row[2].effectiveFormat.backgroundColor.red!==0.59607846){
        data.push({
            name: row[1].formattedValue,
            birthDay: row[2].formattedValue,
            startDay: row[4].formattedValue
        })
    }

}
 return data
}
client.config = require('./configs');
let birthdays=[]
let startDays=[]
const now=new Date()
const day= now.getDate()
const month=now.getMonth()+1
const year= now.getFullYear()

client.on("ready", async msg => {
    const channel= client.channels.cache.get("908693709393113091")
    let table=await authorize().then(listMajors).catch(console.error);
    table.push({name:"yavuz", birthDay: "10/29/2021",  startDay: "10/29/2021"})
    table.map(item =>{
        if(
            (item.birthDay.split('/')[0]==('0'+month.toString()) || item.birthDay.split('/')[0]==(month.toString())) &&
            (item.birthDay.split('/')[1]==('0'+day.toString()) || item.birthDay.split('/')[1]==(day.toString())) 
        ){
            // console.log('Mutlu yıllar ' + item.name+'! Nice yaşlara :) @Retter');
            channel.send('Mutlu yıllar ' + item.name+'! Nice yaşlara :) @Retter')
        }
        
        if(
            (item.startDay.split('/')[0]==('0'+month.toString()) || item.startDay.split('/')[0]==(month.toString())) &&
            (item.startDay.split('/')[1]==('0'+day.toString()) || item.startDay.split('/')[1]==(day.toString())) 
        ){
            // console.log(item.name +' ile birlikte geçen ' +(year-item.startDay.split('/')[2].toString()) +' harika yıl!')
            channel.send(item.name +' ile birlikte geçen '+(year-item.startDay.split('/')[2].toString()) +' harika yıl!')
        }
    })
  })
client.login(client.config.token);
