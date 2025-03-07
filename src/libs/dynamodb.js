import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, DeleteCommand, PutCommand, QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: 'ca-central-1' });
const dbDocClient = DynamoDBDocumentClient.from(client)
const menuItemsTable = process.env.MENU_ITEMS_TABLE;

export const dynamoDb = {
  get: async (id) => {
    const command = new QueryCommand({
      TableName: menuItemsTable,
      KeyConditionExpression: "id = :id",
      ExpressionAttributeValues: {
        ":id": id,
      },
    });
    return await dbDocClient.send(command);
  },

  scan: async () => {
    const command = new ScanCommand({ TableName: menuItemsTable });
    return await client.send(command);
  },

  create: async (item) => {
    const command = new PutCommand({
      TableName: menuItemsTable,
      Item: item,
    });
    await dbDocClient.send(command);
  },

  update: async (id, updateExpression, expressionValues) => {
    const command = new UpdateCommand({
      TableName: menuItemsTable,
      Key: { id },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "ALL_NEW",
    });
    return await dbDocClient.send(command);
  },

  delete: async (id) => {
    const command = new DeleteCommand({
      TableName: menuItemsTable,
      Key: { id },
    });
    return await dbDocClient.send(command);
  },
};
