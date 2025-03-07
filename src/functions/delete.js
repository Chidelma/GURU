import { dynamoDb } from '../libs/dynamodb.js';
import { formatJSONResponse } from '../libs/apiGateway.js';

export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    
    if (!id) {
      return formatJSONResponse(400, { message: 'Missing menu item ID' });
    }
    
    // First check if the item exists
    const existingItem = await dynamoDb.get(id);
    
    if (!existingItem.Item) {
      return formatJSONResponse(404, { message: 'Menu item not found' });
    }
    
    await dynamoDb.delete(id);
    
    return formatJSONResponse(204, null);
  } catch (error) {
    console.error('ERROR:', error);
    return formatJSONResponse(500, { message: 'Failed to delete menu item' });
  }
};