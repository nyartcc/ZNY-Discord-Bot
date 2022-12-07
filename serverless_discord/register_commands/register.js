require('dotenv').config()
const axios = require('axios').default;

let url = `https://discord.com/api/v10/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`

console.log(url)
const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json"
}
console.log(headers)

// Run this to register commands from ../lambda_bot/index.js
// Change the name for the command to match the name in the index.js file
// Then change the description to something helpful.
let command_data = {
    "name": "znyhelp",
    "type": 1,
    "description": "Need help? The robot 🤖 is here to help!",
}

axios.post(url, JSON.stringify(command_data), {
    headers: headers,
})

console.log(JSON.stringify(command_data))