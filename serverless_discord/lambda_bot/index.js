const nacl = require('tweetnacl');
var _ = require('underscore');
const AWS = require('aws-sdk');

exports.handler = async (event) => {
    console.log(event);
    // Checking signature (requirement 1.)
    // Your public key can be found on your application in the Developer Portal
    const PUBLIC_KEY = process.env.PUBLIC_KEY;
    const signature = event.headers['x-signature-ed25519']
    const timestamp = event.headers['x-signature-timestamp'];
    const strBody = event.body; // should be string, for successful sign

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


    // Replying to ping (requirement 2.)
    const body = JSON.parse(strBody)
    if (body.type === 1) {
        return {
            statusCode: 200,
            body: JSON.stringify({ "type": 1 }),
        }
    }

    // Handle /getroles command
    if (body.data.name === 'getroles') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": "\* *waves hand\* * 👋 \n These are not the commands you are looking for... Try /linkaccount instead.",

            }
        })
    }

    // Handle /linkaccount command
    if (body.data.name === 'linkaccount'){
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": "To get your account linked to Discord, please visit https://nyartcc.org, login, and click the banner to link your account.\n\n"
            }
        })
    }

    // Handle /help command
    if (body.data.name === 'znyhelp') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": "👋 Hello! I'm the NYARTCC Discord Bot. You can use me to perform various tasks in Discord. \n\nTo see the full list of commands, please visit https://nyartcc.org/discordbot",
            }
        })
    }

    // Handle /commands command
    if (body.data.name === 'commands') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": "👋 Hello! I'm the NYARTCC Discord Bot. You can use me to perform various tasks in Discord. \n\nTo see the full list of commands, please visit https://nyartcc.org/discordbot",
                "flags": 64
            }
        })
    }

    // Handle /staff command
    if (body.data.name === 'staff') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": "To see the staff list, please visit https://nyartcc.org/staff",
                "flags": 64
            }
        })
    }


    const TABLE_NAME = process.env.DYNAMO_TABLE_NAME;
    const dynamo = new AWS.DynamoDB.DocumentClient();

    // FIX ME - Rewrite to support any input sortKey
    // Scan the table for items with the sort keys "karl" and "gizep"
    const params = {
        TableName: TABLE_NAME,
        FilterExpression: "#sortKey IN (:karl, :gizep)",
        ExpressionAttributeNames: {
            '#sortKey': 'sortKey'
        },
        ExpressionAttributeValues: {
            ':sortKey': 'gizep',
            ':karl': 'karl',
        },
    };

    dynamo.scan(params, (err, data) => {
        if (err) throw err;

        // Filter the items by the two sort keys
        const items = _.filter(data.Items, item => item.sortKey === 'name');

        // Pick a random item from the list where the sort key is equal to "karl"

        const randomKarlItem = _.sample(karlItems);
        const randomGizepItem = _.sample(gizepItems);

        // Print the random items to the console
        console.log(randomKarlItem);
        console.log(randomGizepItem);
    });


    let cinnamonStatements = [
        "YOU GET A CINNAMON ROLL <:Cinnabun:791383982256291841>! AND YOU GET A CINNAMON ROLL <:Cinnabun:791383982256291841>! EVERYONE GETS A CINNAMON ROLL <:Cinnabun:791383982256291841><:Cinnabun:791383982256291841><:Cinnabun:791383982256291841>",
        "Cinnamon rolls are the best. <:Cinnabun:791383982256291841>",
        "Mike, is that you? <:Cinnabun:791383982256291841>",
        "Here! Have a cinnamon roll! <:Cinnabun:791383982256291841>",
        "Woo hoo! Cinnamon rolls! <:Cinnabun:791383982256291841>",
    ]

    // Instead of having static statements, query the dynamoDB table 'statements' for the user's statements


    // Handle /cinnamon command
    if (body.data.name === 'cinnamon') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": _.sample(cinnamonStatements),
            }
        })
    }

    if (body.data.name === 'karlisgreat') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": JSON.stringify(randomKarlItem),
            }
        })
    }

    if (body.data.name === 'gizep') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": JSON.stringify(randomGizepItem),
            }
        })
    }

    return {
        statusCode: 404 // If no handler implemented for Discord's request
    }
};
