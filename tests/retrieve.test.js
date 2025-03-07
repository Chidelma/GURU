import { describe, test, expect, mock } from "bun:test";
import { handler } from '../src/functions/getById.js';
import { dynamoDb } from '../src/libs/dynamodb.js';

// Sample menu item for testing
const sampleMenuItem = {
  id: 'item-1',
  productName: 'Espresso',
  description: 'Strong coffee',
  price: 2.99,
  category: 'Coffee',
  isAvailable: true,
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z'
};

// Mock the dynamoDb module
mock.module('../src/libs/dynamodb.js', () => ({
  dynamoDb: {
    get: mock().mockImplementation(() => Promise.resolve({
      Item: sampleMenuItem
    }))
  }
}));

describe('Get Menu Item By ID Handler', () => {

  test('should return a menu item by ID', async () => {
    // Arrange
    const event = {
      pathParameters: { id: 'item-1' }
    };

    // Act
    // @ts-ignore
    const response = await handler(event, {}, {});
    const responseBody = JSON.parse(response.body);
    
    // Assert
    expect(response.statusCode).toBe(200);
    expect(dynamoDb.get).toHaveBeenCalledTimes(1);
    expect(dynamoDb.get).toHaveBeenCalledWith('item-1');
    
    // Check response structure and content
    expect(responseBody).toHaveProperty('menuItem');
    expect(responseBody.menuItem).toEqual(sampleMenuItem);
    expect(responseBody.menuItem.id).toBe('item-1');
    expect(responseBody.menuItem.productName).toBe('Espresso');
    expect(responseBody.menuItem.price).toBe(2.99);
  });

  test('should return 400 if ID is missing', async () => {
    // Arrange
    const event = {
      pathParameters: undefined
    };

    // Act
    // @ts-ignore
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(400);
    expect(dynamoDb.get).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.body).message).toBe('Missing menu item ID');
  });

  test('should return 404 if menu item does not exist', async () => {
    // Arrange
    const event = {
      pathParameters: { id: 'non-existent-id' }
    };
    
    // Override the mock to return no item
    mock.module('../src/libs/dynamodb.js', () => ({
      dynamoDb: {
        get: mock().mockImplementation(() => Promise.resolve({ Item: null }))
      }
    }));

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(404);
    expect(dynamoDb.get).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.body).message).toBe('Menu item not found');
  });

  test('should return 500 if database operation fails', async () => {
    // Arrange
    const event = {
      pathParameters: { id: 'item-1' }
    };
    
    // Override the mock to throw an error
    mock.module('../src/libs/dynamodb.js', () => ({
      dynamoDb: {
        get: mock().mockImplementation(() => Promise.reject(new Error('Database error')))
      }
    }));

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Failed to fetch menu item');
  });

  test('should handle empty path parameters', async () => {
    // Arrange
    const event = {
      pathParameters: {}
    };

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(400);
    expect(dynamoDb.get).toHaveBeenCalledTimes(1);
  });
});