require('dotenv').config()
const axios = require('axios').default;

let url = `https://discord.com/api/v10/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`

console.log(url)
const headers = {
    "Authorization": `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json"
}
console.log(headers)

let command_data = {
    "name": "gizep",
    "type": 1,
    "description": "Random quotes from Gizep!",
}

axios.post(url, JSON.stringify(command_data), {
    headers: headers,
})

console.log(JSON.stringify(command_data))