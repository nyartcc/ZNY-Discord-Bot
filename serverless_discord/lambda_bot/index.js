const nacl = require('tweetnacl');
var _ = require('underscore');

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

    let karlStatements = [
        "Yes! Karl is the greatest! You get a cookie. 🍪",
        "King 👑 and Supreme Chancellor of the Republic of New York ARTCC, Karl Moberg is indeed the greatest! You'd be wise to not anger him. 🤔",
        "Why yes! Yes, he is!",
        "Karl is 🥇"
    ]

    let gizepStatements = [
        "\"Words come out of my mouth and they don't mean anything.\"\n - Gizep (12/9/2021)",
        "\"He controlled 27 hours in one day!\"\n - Gizep (12/23/2021)",
        "\"Boxed pasta if very, very good 🍝\"\n - Gizep (01/05/2022)",
        "\"I think sauce in cans is delicious 🍜\"\n - Gizep (01/05/2022)",
        "\"Gabe, you're stuck mic-ing\"\n - Gizep (01/08/2022)",
        "\"I'm DEAD!!??\"\n - Gizep (02/11/2022)",
        "\"Decompressurization\"\n - Gizep (02/18/2022)",
        "\"Houston, it's pretty much in Texas\"\n - Gizep (04/09/2022)",
        "\"Spaghetti is actually overrated 🍝\"\n - Gizep (05/14/2022)",
        "\"He lives in Albany, the capital of New York City!\"\n - Gizep (01/30/2021)",
        "\"There's something relaxing about watching a boat sink.\"\n - Gizep (02/08/2021)",
        "\"I don't think I've ever had to give vectors to an IFR aircraft.\"\n - Gizep (02/17/2021)",
    ]


    if (body.data.name === 'karlisgreat') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": _.sample(karlStatements)
            }
        })
    }

    if (body.data.name === 'gizep') {
        return JSON.stringify({
            "type": 4,
            "data": {
                "content": _.sample(gizepStatements)
            }
        })
    }

    return {
        statusCode: 404 // If no handler implemented for Discord's request
    }
};