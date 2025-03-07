import { dynamoDb } from '../libs/dynamodb.js';
import { formatJSONResponse } from '../libs/apiGateway.js';

export const handler = async (event) => {
  try {
    const id = event.pathParameters?.id;
    const data = JSON.parse(event.body || '{}');
    
    if (!id) {
      return formatJSONResponse(400, { message: 'Missing menu item ID' });
    }
    
    // First check if the item exists
    const existingItem = await dynamoDb.get(id);
    
    if (!existingItem.menuItem) {
      return formatJSONResponse(404, { message: 'Menu item not found' });
    }
    
    const timestamp = new Date().toISOString();
    
    // Build update expression dynamically based on provided fields
    let updateExpression = 'set updatedAt = :updatedAt';
    const expressionAttributeValues = {
      ':updatedAt': timestamp
    };
    
    // Add fields to update expression if they're provided
    if (data.name !== undefined) {
      updateExpression += ', #name = :name';
      expressionAttributeValues[':name'] = data.name;
    }
    
    if (data.description !== undefined) {
      updateExpression += ', description = :description';
      expressionAttributeValues[':description'] = data.description;
    }
    
    if (data.price !== undefined) {
      updateExpression += ', price = :price';
      expressionAttributeValues[':price'] = data.price;
    }
    
    if (data.category !== undefined) {
      updateExpression += ', category = :category';
      expressionAttributeValues[':category'] = data.category;
    }
    
    if (data.isAvailable !== undefined) {
      updateExpression += ', isAvailable = :isAvailable';
      expressionAttributeValues[':isAvailable'] = data.isAvailable;
    }
    
    const result = await dynamoDb.update(
      id,
      updateExpression,
      expressionAttributeValues
    );
    
    return formatJSONResponse(200, { menuItem: result.Attributes });
  } catch (error) {
    console.error('ERROR:', error);
    return formatJSONResponse(500, { message: 'Failed to update menu item' });
  }
};