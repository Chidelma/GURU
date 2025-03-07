import { dynamoDb } from '../libs/dynamodb.js';
import { formatJSONResponse } from '../libs/apiGateway.js';
import { v7 as uuidv7 } from 'uuid'

export const handler = async (event) => {
  try {
    const data = JSON.parse(event.body || '{}');
    
    if (!data.productName || !data.price || !data.category) {
      return formatJSONResponse(400, {
        message: 'Missing required fields: name, price, and category are required'
      });
    }
    
    const timestamp = new Date().toISOString();
    
    const menuItem = {
      id: uuidv7(),
      productName: data.productName,
      description: data.description || '',
      price: data.price,
      category: data.category,
      isAvailable: data.isAvailable !== undefined ? data.isAvailable : true,
      createdAt: timestamp,
      updatedAt: timestamp
    }
    
    await dynamoDb.create(menuItem);
    
    return formatJSONResponse(201, { menuItem });
  } catch (error) {
    console.error('ERROR:', error);
    return formatJSONResponse(500, { message: 'Failed to create menu item' });
  }
};