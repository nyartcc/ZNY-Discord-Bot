const nacl = require('tweetnacl');
const _ = require('underscore');
const AWS = require('aws-sdk');
const fetch = require("isomorphic-fetch");

const commandHandlers = {
  getroles: handleGetRoles,
  linkaccount: handleLinkAccount,
  znyhelp: handleHelp,
  commands: handleCommands,
  staff: handleStaff,
  cinnamon: handleCinnamon,
  karlisgreat: handleKarlisGreat,
  gizep: handleGizep,
  gabe: handleGabe,
  metar: handleMetar,
  jfkpilots: handleJfkPilots,
  faq: handleFaq,
  n90weather: handleN90Weather,
};

exports.handler = async (event) => {
  console.log("Version 2.0.3");

  // Signature verification, ping handling, etc.

  const parsedBody = JSON.parse(event.body); // Parse the body string
  console.log("Parsed body:", parsedBody);

  const command = parsedBody.data?.name;
  if (command && typeof commandHandlers[command] === 'function') {
    console.log(`Handling command "${command}"`); // Add this line for debugging
    return await commandHandlers[command](event);
  }

  // Default response if no command is matched
  return {
    statusCode: 404 // If no handler implemented for Discord's request
  };
};



const axios = require('axios');

async function fetchMetar(icaoCode) {
    try {
        const API_KEY = process.env.CHECKWX_API_KEY;
        const response = await axios.get(`https://api.checkwx.com/metar/${icaoCode}/decoded`, {
            headers: { 'X-API-Key': API_KEY },
        });

        if (response.data.results === 0) {
            throw new Error(`No METAR data found for ${icaoCode}`);
        }

        const metarData = response.data.data[0];
        const { name, icao, observed, wind, visibility, conditions, clouds, temperature, dewpoint, humidity, barometer } = metarData;

        console.log(`METAR found for ${name} (${icao}): ${metarData.raw_text}`);

        return `METAR for ${name} (${icao}):\n` +
            `Observed: ${observed}\n` +
            `Wind: ${wind.direction}° at ${wind.speed_kts} knots\n` +
            `Visibility: ${visibility.miles} miles\n` +
            `Conditions: ${conditions.length ? conditions.map(c => c.description).join(', ') : 'No significant weather'}\n` +
            `Clouds: ${clouds.length ? clouds.map(c => c.type + ' at ' + c.base_feet_agl + ' feet').join(', ') : 'No clouds reported'}\n` +
            `Temperature: ${temperature.celsius}°C\n` +
            `Dewpoint: ${dewpoint.celsius}°C\n` +
            `Humidity: ${humidity.percent}%\n` +
            `Barometer: ${barometer.hpa} hPa`;

    } catch (error) {
        console.error(`Error fetching METAR for ${icaoCode}:`, error);
        throw error;
    }
}





async function handleGetRoles() {
    return {
        "type": 4,
        "data": {
            "content": "\* *waves hand\* * 👋 \n These are not the commands you are looking for... Try /linkaccount instead.",
        }
    }
}


async function handleLinkAccount() {
    return {
        "type": 4,
        "data": {
            "content": "To get your account linked to Discord, please visit https://nyartcc.org, login, and click the banner to link your account.\n\n"
        }
    }
}


async function handleHelp() {
    return {
        "type": 4,
        "data": {
            "content": "👋 Hello! I'm the NYARTCC Discord Bot. You can use me to perform various tasks in Discord. \n\nTo see the full list of commands, please visit https://nyartcc.org/discordbot",
        }
    }
}


async function handleCommands() {
    return {
        "type": 4,
        "data": {
            "content": "👋 Hello! I'm the NYARTCC Discord Bot. You can use me to perform various tasks in Discord. \n\nTo see the full list of commands, please visit https://nyartcc.org/discordbot",
            "flags": 64
        }
    }
}


async function handleStaff() {
    return {
        "type": 4,
        "data": {
            "content": "To see the staff list, please visit https://nyartcc.org/staff",
            "flags": 64
        }
    }
}


async function handleCinnamon() {
    let cinnamonStatements = [
        "YOU GET A CINNAMON ROLL <:Cinnabun:791383982256291841>! AND YOU GET A CINNAMON ROLL <:Cinnabun:791383982256291841>! EVERYONE GETS A CINNAMON ROLL <:Cinnabun:791383982256291841><:Cinnabun:791383982256291841><:Cinnabun:791383982256291841>",
        "Cinnamon rolls are the best. <:Cinnabun:791383982256291841>",
        "Mike, is that you? <:Cinnabun:791383982256291841>",
        "Here! Have a cinnamon roll! <:Cinnabun:791383982256291841>",
        "Woo hoo! Cinnamon rolls! <:Cinnabun:791383982256291841>",
    ]

    return {
        "type": 4,
        "data": {
            "content": _.sample(cinnamonStatements),
        }
    }
}


async function handleQuote(person) {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const quote = await docClient.query({
        TableName: 'Quotes',
        KeyConditionExpression: 'person = :person',
        ExpressionAttributeValues: {
            ':person': person
        },
        Select: 'ALL_ATTRIBUTES'
    }).promise();

    const randomQuote = quote.Items[Math.floor(Math.random() * quote.Items.length)];

    return {
        "type": 4,
        "data": {
            "content": randomQuote.quote
        }
    }
}

async function handleKarlisGreat() {
    return handleQuote('Karl');
}

async function handleGizep() {
    return handleQuote('Gizep');
}

async function handleGabe() {
    return handleQuote('Gabe');
}

async function handleFaq() {
    const docClient = new AWS.DynamoDB.DocumentClient();

    const faqScanParams = {
        TableName: 'DiscordFAQ',
    };

    const faqScan = await docClient.scan(faqScanParams).promise();
    const faqArray = faqScan.Items.map(item => ({
        question: item.question,
        answer: item.answer + "\n\n",
    }));

    const data = {
        "type": 4,
        "data": {
            "content": "",
            "embeds": [
                {
                    "type": "rich",
                    "title": "Frequency Asked Questions",
                    "color": 0x965aff,
                    "fields": [],
                    "thumbnail": {
                        "url": 'https://zny-uploads.s3.amazonaws.com/images/FAQ_Logo.png',
                        "height": 600,
                        "width": 600
                    },
                    "url": "https://nyartcc.org/faq",
                    "footer": {
                        "text": "*Last Updated:* n/a "
                    }
                },
            ],
        },
    };

    faqArray.forEach((item) => {
        data.data.embeds[0].fields.push({
            name: item.question.toString(),
            value: item.answer.toString(),
            inline: false,
        });
    });

    const moment = require('moment');
    const sortedFaqArray = faqScan.Items.sort((a, b) => {
        if (a.updatedAt < b.updatedAt) return -1;
        if (a.updatedAt > b.updatedAt) return 1;
        return 0;
    });
    const latestDate = moment(sortedFaqArray[sortedFaqArray.length - 1].updatedAt);
    const formattedDate = latestDate.format('MMM Do YYYY');
    data.data.embeds[0].footer.text = `*Last Updated:* ${formattedDate}`;

    return data;
}

async function handleMetar(event) {
    console.log("METAR Event:", event)
    const data = JSON.parse(event.body);
    console.log("Event data:", data);

    const icaoCode = data?.data?.options ? data.data.options.find(option => option.name === 'icao_code').value : undefined;

    if (!icaoCode) {
        return {
            type: 4,
            data: {
                content: 'Please provide an ICAO code.',
                flags: 64,
            },
        };
    }

    console.log(`Fetching METAR for ${icaoCode}...`)

    try {
        const metar = await fetchMetar(icaoCode);
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 3,
                data: {
                    content: metar,
                },
            }),
        };
    } catch (error) {
        console.error(`Error fetching METAR for ${icaoCode}:`, error);
        return {
            statusCode: 200,
            body: JSON.stringify({
                type: 3,
                data: {
                    content: `Error fetching METAR for ${icaoCode}`,
                },
            }),
        };
    }
}





async function handleJfkPilots() {
    return {
        "type": 4,
        "data": {
            "content": "JFK pilots are NOT THAT BAD!",
        }
    }
}


async function handleN90Weather() {
    const airports = ['KJFK', 'KEWR', 'KLGA'];
    console.log("N90 Weather command received");

    try {
        const weatherPromises = airports.map(airport => fetchMetar(airport));

        const weatherData = await Promise.all(weatherPromises);
        console.log("Weather data fetched:", weatherData);

        const responseContent = weatherData
            .map((data, index) => `${airports[index]}: ${data}`)
            .join("\n");

        console.log("Response content:", responseContent); // Add this line for debugging

        return {
            "type": 4,
            "data": {
                "content": responseContent,
            },
        };
    } catch (error) {
        console.error("Error in N90 Weather command:", error);
        return {
            "type": 4,
            "data": {
                "content": "Error: " + error.message,
            },
        };
    }
}


