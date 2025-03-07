import { dynamoDb } from '../libs/dynamodb';
import { formatJSONResponse } from '../libs/apiGateway';

export const handler = async () => {
  try {
    const result = await dynamoDb.scan();
    
    return formatJSONResponse(200, {
      menuItems: result.Items,
      count: result.Count
    });
  } catch (error) {
    console.error('ERROR:', error);
    return formatJSONResponse(500, { message: 'Failed to fetch menu items' });
  }
};