const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

const tableName = 'orderHistory';

exports.handler = async(event) => {
   console.log(JSON.stringify(event));
   const order = JSON.parse(event.Records[0].body);
   console.log('printing order data');
   console.log(order);
   console.log('Received Order: ', order);
   console.log('Preparing the food in shop 1...');
   saveitem(order)
   await sleep(3000);
};

const saveitem = async (item) => {
    const params = {
        TableName: tableName,
        Item: item
    };
    
    await dynamoDb.put(params).promise();
    return item.itemId;
};

function sleep(ms){
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    })
}

