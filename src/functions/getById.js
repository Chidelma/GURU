import { dynamoDb } from '../libs/dynamodb.js';
import { formatJSONResponse } from '../libs/apiGateway.js';

export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    
    if (!id) {
      return formatJSONResponse(400, { message: 'Missing menu item ID' });
    }
    
    const result = await dynamoDb.get(id);
    
    if (!result.Item) {
      return formatJSONResponse(404, { message: 'Menu item not found' });
    }
    
    return formatJSONResponse(200, { menuItem: result.Item });
  } catch (error) {
    console.error('ERROR:', error);
    return formatJSONResponse(500, { message: 'Failed to fetch menu item' });
  }
};