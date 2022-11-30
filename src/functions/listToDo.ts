import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from './utils/dynamodb';

export const handler: APIGatewayProxyHandler = async (event) => {
  const { user_id } = event.pathParameters;
  let res = {
    statusCode: 500,
    body: JSON.stringify({
      message: "Ocorreu um erro",
    })
  };

  try {
    const response = await document.query({
      TableName: "to_do",
      IndexName: 'UserIdIndex',
      KeyConditionExpression: "user_id = :user_id",
      ExpressionAttributeValues: {
        ":user_id": user_id,
      }
    }).promise();
    res.statusCode = 200;
    res.body = JSON.stringify(response.Items)
  } catch (error) {
    res.statusCode = 404;
    res.body = JSON.stringify({
      message: "Ocorreu um erro",
      error: error.toString(),
    });
  }
  return res;

}