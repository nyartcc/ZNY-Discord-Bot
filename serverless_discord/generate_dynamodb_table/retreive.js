const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({region: 'us-east-1', apiVersion: '2012-08-10'});

// Define the parameters for the query against the DynamoDB table
const faqScanParams = {
    TableName: 'DiscordFAQ',
};

// Create an empty array to store each item in the table
const faqArray = [];

// Query the DynamoDB table for all items
const scanPromise = () => {
    return new Promise((resolve, reject) => {
        // Query the DynamoDB table for all items
        const faqScan = dynamodb.scan(faqScanParams, (err, data) => {
            // If there is an error, reject the Promise
            if (err) {
                reject(err);
            } else {
                // Loop through each item in the table and push it to the `faqArray` array
                data.Items.forEach(item => {
                    // Define an object for each item in the table
                    const itemObject = {
                        // We only need the `question` and `answer` attributes
                        question: item.question.S,  // The question. The `S` is for String type
                        answer: item.answer.S,      // The answer. The `S` is for String type
                    };
                    // Push the object to the `faqArray` array
                    faqArray.push(itemObject);
                });
                // Resolve the Promise with the `faqArray` array
                resolve(faqArray);
            }
        });
    });
};

// Call the `scanPromise` function and access the returned value
scanPromise()
    .then(faqArray => {
        // Create the message to send to Discord
        return JSON.stringify({
            "type": 4,
            "data": {
                "embeds": [
                    {
                        "type": "rich",
                        "title": "Frequently Asked Questions",
                        "description": "",
                        "colors": 0x965aff,
                        "fields": faqArray.map((item) => {
                            return {
                                "name": item.question,
                                "value": item.answer,
                                "inline": false
                            }
                        })
                    }
                ]
            }
        });
    })
    .catch(err => {
        console.log(err);
    });
