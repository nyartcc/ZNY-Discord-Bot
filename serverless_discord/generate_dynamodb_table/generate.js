const AWS = require('aws-sdk');

const dynamodb = new AWS.DynamoDB({region: 'us-east-1', apiVersion: '2012-08-10'});


const describeParams = {
    TableName: 'DiscordFAQ'
}

dynamodb.describeTable(describeParams, (err, data) => {
    if (err) {
        // If the table does not exist, create it
        if (err.code === 'ResourceNotFoundException') {
            const createParams = {
                TableName: 'DiscordFAQ',
                KeySchema: [
                    {AttributeName: 'question', KeyType: 'HASH'},
                ],
                AttributeDefinitions: [
                    {AttributeName: 'question', AttributeType: 'S'},
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 1,
                    WriteCapacityUnits: 1
                }
            };

            dynamodb.createTable(createParams, (createErr, createData) => {
                if (createErr) {
                    console.error(`Error creating table: ${createErr}`);
                } else {
                    console.log(`Table created successfully: ${createData}`);
                }
            });
        } else {
            console.error(`Error describing table: ${err}`);
        }
    } else {
        console.log(`Table already exists: ${data}`);
    }
});


// Add two entries to the DynamoDB table
const currentTimestamp = new Date().toISOString();

const items = [
    {
        question: 'Question 2',
        answer: 'Answer 2',
        author: 'Demo'
    }
];

items.forEach(item => {
    const itemParams = {
        TableName: 'DiscordFAQ',
        Item: {
            'question': {S: item.question},
            'answer': {S: item.answer},
            'dateUpdated': {S: currentTimestamp},
            'dateInserted': {S: currentTimestamp},
            'author': {S: item.author}
        }
    };

    dynamodb.putItem(itemParams, (err, data) => {
        if (err) {
            console.error(`Error adding item: ${err}`);
        } else {
            console.log(`Item added successfully: ${JSON.stringify(data)}`);
        }
    });
});
