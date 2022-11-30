import { APIGatewayProxyHandler } from 'aws-lambda';
import { document } from './utils/dynamodb';
interface IToDo {
  id: string;
  title: string;
  done: boolean;
  deadline: string;
}




export const handler: APIGatewayProxyHandler = async (event) => {
  const { id, title, deadline } = JSON.parse(event.body) as IToDo;
  const { user_id } = event.pathParameters;
  let done = false;
  let res = {
    statusCode: 500,
    body: JSON.stringify({
      message: "Ocorreu um erro",
    })
  };

  if (!title) {
    res.statusCode = 404;
    res.body = JSON.stringify({
      message: "Insira um título!",
    });
    return res
  }
  try {
    await document.put({
      TableName: "to_do",
      Item: {
        id,
        title,
        done,
        user_id,
        deadline: new Date(deadline).toISOString(),
        created_at: new Date().toISOString(),
      }
    }).promise()
    const response = await document.query({
      TableName: "to_do",
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      }
    }).promise();
    res.statusCode = 200;
    res.body = JSON.stringify(response.Items[0])
  } catch (error) {
    res.statusCode = 404;
    res.body = JSON.stringify({
      message: "Ocorreu um erro",
      error: error.toString(),
    });
  }

  return res
}