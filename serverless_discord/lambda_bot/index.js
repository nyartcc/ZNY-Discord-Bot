const nacl = require('tweetnacl');

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

    // Handle /foo command
    if (body.data.name === 'foo') {
        return JSON.stringify(({
            "type": 4,
            "data": {
                "content": "bar"
            }
        }))
    }

    // Handle /getroles command
    if (body.data.name === 'getroles') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": "\* *waves hand\* * 👋 \n These are not the commands you are looking for...",

            }
        })
    }

    if (body.data.name === 'linkaccount'){
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": "To get your account linked to Discord, please visit https://nyartcc.org, login, and click the banner to link your account.\n\n"
            }
        })
    }


    return {
        statusCode: 404 // If no handler implemented for Discord's request
    }
};