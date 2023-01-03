const AWS = require('aws-sdk');
AWS.config.update({region:'us-east-1'});
const sqs = new AWS.SQS();
const sqsURL = 'https://sqs.us-east-1.amazonaws.com/582306253191/Food-processing-queue.fifo';
const numberOfOrderProcessors = 2;
// const numberOfOrders = 20;

exports.handler = async (event, context) => {
    console.log(event);
    
    const payload = JSON.parse(event.body);
    
    console.log(payload);
    
    const orderId = Math.floor(new Date().getTime() / 1000);
    
    const msgObject = {
            MessageBody: JSON.stringify({
            orderId: orderId.toString(),
            order: payload.order.toString(),
            email: payload.email.toString(),
            timestamp: new Date(). toISOString(),
        }),
        QueueUrl: sqsURL,
        MessageDeduplicationId: orderId.toString(),
        MessageGroupId:`group-${orderId % numberOfOrderProcessors}`
        }
        
        //sns
        var sns = new AWS.SNS();
        var params = {
        Message: "Your order has been created" + payload.order.toString(), 
        Subject: "Order Created",
        TopicArn: "arn:aws:sns:us-east-1:582306253191:order-created"
        };
        sns.publish(params, context.done);
        
        await sqs.sendMessage(msgObject).promise().then((response) => {
            console.log(JSON.stringify(response));
        }, error => {
            console.error(error);
        })
        
        
        const response = {
        statusCode: 200,
        headers: {
        "Access-Control-Allow-Origin": "*", // Required for CORS support to work
        "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify('Orders have been subscribed for processing...'),
    };
    return response;
}
