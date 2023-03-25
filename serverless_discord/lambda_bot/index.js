// noinspection SpellCheckingInspection

const nacl   = require('tweetnacl');
const _      = require('underscore');
const AWS    = require('aws-sdk');              // Included via Lambda Layer (Dev Dependency in local)
const fetch  = require("isomorphic-fetch");     // Included via Lambda Layer (Dev Dependency in local)

const debugMode = false;

exports.handler = async (event) => {

    if (debugMode) {
        console.log(event);  // Log the entire body of the request
    }


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Checking signature (requirement 1.)
    // Your public key can be found on your application in the Developer Portal

    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const signature  = event.headers['x-signature-ed25519'];
    const timestamp  = event.headers['x-signature-timestamp'];
    const strBody    = event.body;         // should be string, for successful sign

    if (debugMode) {
        console.log("StrBody: " + strBody);
    }

    if (!PUBLIC_KEY) {
        console.log("No PUBLIC_KEY found in environment variables");
        throw new Error('No PUBLIC_KEY found in environment variables');
    }

    const isVerified = nacl.sign.detached.verify(
        Buffer.from(timestamp + strBody),
        Buffer.from(signature, 'hex'),
        Buffer.from(PUBLIC_KEY, 'hex')
    );

    if (!isVerified) {
        return {
            statusCode: 401,
            body: JSON.stringify('invalid request signature'),
        };
    }


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Replying to ping (requirement 2.)

    const body = JSON.parse(strBody);

    if (body.type === 1) {

        return {
            statusCode: 200,
            body: JSON.stringify({"type": 1}),
        };
    }


    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // COMMAND DEFINITIONS
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    // Handle /getroles command
    if (body.data.name === 'getroles') {

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : "\* *waves hand\* * 👋 \n These are not the commands you are looking for... Try /linkaccount instead.",
            }
        });
    }

    // Handle /linkaccount command
    if (body.data.name === 'linkaccount') {

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : "To get your account linked to Discord, please visit https://nyartcc.org, login, and click the banner to link your account.\n\n"
            }
        });
    }


    // Handle /help command
    if (body.data.name === 'znyhelp') {

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : "👋 Hello! I'm the NYARTCC Discord Bot. You can use me to perform various tasks in Discord. \n\nTo see the full list of commands, please visit https://nyartcc.org/discordbot",
            }
        });
    }


    // Handle /commands command
    if (body.data.name === 'commands') {

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : "👋 Hello! I'm the NYARTCC Discord Bot. You can use me to perform various tasks in Discord. \n\nTo see the full list of commands, please visit https://nyartcc.org/discordbot",
                "flags"   : 64
            }
        });
    }


    // Handle /staff command
    if (body.data.name === 'staff') {

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : "To see the staff list, please visit https://nyartcc.org/staff",
                "flags"   : 64
            }
        });
    }


    // Handle /cinnamon command
    if (body.data.name === 'cinnamon') {

        //TODO - Instead of having static statements, query the dynamoDB table 'statements' for the user's statements
        let cinnamonStatements = [
            "YOU GET A CINNAMON ROLL <:Cinnabun:791383982256291841>! AND YOU GET A CINNAMON ROLL <:Cinnabun:791383982256291841>! EVERYONE GETS A CINNAMON ROLL <:Cinnabun:791383982256291841><:Cinnabun:791383982256291841><:Cinnabun:791383982256291841>",
            "Cinnamon rolls are the best. <:Cinnabun:791383982256291841>",
            "Mike, is that you? <:Cinnabun:791383982256291841>",
            "Here! Have a cinnamon roll! <:Cinnabun:791383982256291841>",
            "Woo hoo! Cinnamon rolls! <:Cinnabun:791383982256291841>",
        ];

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : _.sample(cinnamonStatements),
            }
        });
    }


    // Set up the DynamoDB client
    const docClient = new AWS.DynamoDB.DocumentClient();


    // Query the DynamoDB table for a random quote from each person
    const karlQuote = await docClient.query({
        TableName: 'Quotes',
        KeyConditionExpression: 'person = :person',
        ExpressionAttributeValues: {
            ':person': 'Karl'
        },
        Select: 'ALL_ATTRIBUTES'
    }).promise();

    const gizepQuote = await docClient.query({
        TableName: 'Quotes',
        KeyConditionExpression: 'person = :person',
        ExpressionAttributeValues: {
            ':person': 'Gizep'
        },
        Select: 'ALL_ATTRIBUTES'
    }).promise();

    const gabeQuote = await docClient.query({
        TableName: 'Quotes',
        KeyConditionExpression: 'person = :person',
        ExpressionAttributeValues: {
            ':person': 'Gabe'
        },
        Select: 'ALL_ATTRIBUTES'
    }).promise();


    // Select a random quote from each person
    const randomKarlQuote = karlQuote.Items[Math.floor(Math.random() * karlQuote.Items.length)];
    const randomGizepQuote = gizepQuote.Items[Math.floor(Math.random() * gizepQuote.Items.length)];
    const randomGabeQuote = gabeQuote.Items[Math.floor(Math.random() * gabeQuote.Items.length)];

    // Return the quotes
    if (body.data.name === 'karlisgreat') {

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : randomKarlQuote.quote,
            }
        });
    }

    if (body.data.name === 'gizep') {

        let quote_string = "\"" + randomGizepQuote.quote + "\" - " + randomGizepQuote.person + ", " + randomGizepQuote.date;

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : quote_string
            }
        });
    }

    if (body.data.name === 'gabe') {

        let quote_string = "\"" + randomGabeQuote.quote + "\" - " + randomGabeQuote.person + ", " + randomGabeQuote.date;

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : quote_string
            }
        });
    }


    // Handle /metar command
    if (body.data.name === 'metar') {

        if (debugMode) {

            console.log("METAR command received");
            console.log(body.data);
        }


        // Make sure that the options array exists and has at least one element
        if (!body.data.options || body.data.options.length === 0) {

            console.error("No airport code provided in command options");

            return JSON.stringify({
                type : 4,
                data : {
                    content : "Error: No airport code provided",
                },
            });
        }

        let airport = body.data.options[0].value;

        if (debugMode) {
            console.log("Airport: " + airport);
        }

        // Make sure that the airport code is a string
        if (typeof airport !== "string") {

            console.error("Invalid airport code: " + airport);

            return JSON.stringify({
                type : 4,
                data : {
                    content : "Error: Invalid airport code",
                },
            });
        }

        // Check if the airport code is valid
        if (!airport.match(/^[A-Za-z]{4}$/)) {

            console.error("Invalid airport code");

            return JSON.stringify({
                type : 4,
                data : {
                    content : "Error: Invalid airport code",
                },
            });
        }


        const wxUrl = `https://api.checkwx.com/metar/${airport}/decoded`;

        if (debugMode) {
            console.log("WX URL: " + wxUrl);
        }

        // Return the response to the Discord command immediately
        return fetch(wxUrl, {
            method  : 'GET',
            headers : {
                'X-API-Key' : process.env.CHECKWX_API_KEY,
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Error fetching METAR from CheckWX API: ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                if (!data || !data.data || !data.data[0]) {
                    throw new Error("Invalid response from CheckWX API" + data);
                }

                let metar = data.data[0]['raw_text'];
                console.log("Response METAR: " + metar);

                return JSON.stringify({
                    "type" : 4,
                    "data" : {
                        "content" : metar,
                    },
                });
            })
            .catch((error) => {
                console.error(error);
                return JSON.stringify({
                    "type" : 4,
                    "data" : {
                        "content" : "Error: " + error.message,
                    },
                });
            });
    }


    // Handle JFK pilots
    if (body.data.name === 'jfkpilots') {

        return JSON.stringify({
            "type" : 4,
            "data" : {
                "content" : "JFK pilots are NOT THAT BAD!",
            }
        });
    }

    // FAQ Section
    if (body.data.name === 'faq') {

        // Define the parameters for the query against the DynamoDB table
        const faqScanParams = {
            TableName: 'DiscordFAQ',
        };

        // Create the message to send to Discord
        const data = {
            "type" : 4,
            "data" : {
                "content" : "",
                "embeds"  :
                    [
                        {
                            "type"      : "rich",
                            "title"     : "Frequency Asked Questions",
                            "color"     : 0x965aff,
                            "fields"    : [],
                            "thumbnail" : {
                                "url"    : 'https://zny-uploads.s3.amazonaws.com/images/FAQ_Logo.png',
                                "height" : 600,
                                "width"  : 600
                            },
                            "url"       : "https://nyartcc.org/faq",
                            "footer"    : {
                                "text" : "*Last Updated:* n/a "
                            }
                        },
                    ],
            },
        };

        // Query the DynamoDB table for the FAQ
        const faqScan  = await docClient.scan(faqScanParams).promise();
        const faqArray = faqScan.Items.map(item => ({
            question : item.question,
            answer   : item.answer + "\n\n",
        }));

        if (debugMode) {
            console.log(faqArray);
        }

        // Add the FAQ to the message
        faqArray.forEach((item) => {

            if (debugMode) {
                console.log("Current item: " + item.question.toString());
            }

            data.data.embeds[0].fields.push({
                name   : item.question.toString(),
                value  : item.answer.toString(),
                inline : false,
            });
        });

        // Sort the items in the table by the updatedat attribute
        const sortedFaqArray = faqScan.Items.sort((a, b) => {
            if (a.updatedAt < b.updatedAt) return -1;
            if (a.updatedAt > b.updatedAt) return 1;
            return 0;
        });

        // Get the date of the latest entry in the table
        const latestDate = new Date(sortedFaqArray[sortedFaqArray.length - 1].updatedAt);

        // Format the date
        const displayOptions = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = latestDate.toLocaleDateString('en-us', displayOptions);

        // Add the date to the footer
        data.data.embeds[0].footer.text = `*Last Updated:* ${formattedDate}`;

        // Return the message to Discord
        if (debugMode) {
            console.log('Returning FAQ to Discord');
            console.log('Return Data:' + JSON.stringify(data));
        }

        return JSON.stringify(data);

        // End of FAQ Section
    }


    // Default response if no command is matched
    return {
        statusCode: 404 // If no handler implemented for Discord's request
    };
};
