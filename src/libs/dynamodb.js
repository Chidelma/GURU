import { DynamoDBClient, GetItemCommand, ScanCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const menuItemsTable = process.env.MENU_ITEMS_TABLE;

export const dynamoDb = {
  get: async (id) => {
    const command = new GetItemCommand({
      TableName: menuItemsTable,
      Key: { 
        id: {
            'S': id
          } 
        },
    });
    return await client.send(command);
  },

  scan: async () => {
    const command = new ScanCommand({ TableName: menuItemsTable });
    return await client.send(command);
  },

  create: async (item) => {
    const command = new PutItemCommand({
      TableName: menuItemsTable,
      Item: item,
    });
    await client.send(command);
  },

  update: async (id, updateExpression, expressionValues) => {
    const command = new UpdateItemCommand({
      TableName: menuItemsTable,
      Key: { 
        id: {
            'S': id
            } 
        },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionValues,
      ReturnValues: "ALL_NEW",
    });
    return await client.send(command);
  },

  delete: async (id) => {
    const command = new DeleteItemCommand({
      TableName: menuItemsTable,
      Key: { 
        id: {
            'S': id
            } 
        },
    });
    return await client.send(command);
  },
};
