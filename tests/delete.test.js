import { describe, test, expect, beforeEach, mock } from "bun:test";
import { handler } from '../src/functions/delete.js';
import { dynamoDb } from '../src/libs/dynamodb.js';

const id = Bun.randomUUIDv7()

// Mock the dynamoDb module
mock.module('../src/libs/dynamodb.js', () => ({
  dynamoDb: {
    get: mock().mockImplementation(() => Promise.resolve({
      Item: {
        id,
        productName: 'Coffee to Delete'
      }
    })),
    delete: mock().mockImplementation(() => Promise.resolve({}))
  }
}));

describe('Delete Menu Item Handler', () => {

  test('should delete an existing menu item', async () => {
    // Arrange
    const event = {
      pathParameters: { id }
    };

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(204);
    expect(JSON.parse(response.body)).toBe(null);
    expect(dynamoDb.get).toHaveBeenCalledTimes(1);
    expect(dynamoDb.get).toHaveBeenCalledWith(id);
    expect(dynamoDb.delete).toHaveBeenCalledTimes(1);
    expect(dynamoDb.delete).toHaveBeenCalledWith(id);
  });

  test('should return 400 if id is missing', async () => {
    // Arrange
    const event = {
      pathParameters: undefined
    };

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(400);
    expect(dynamoDb.get).toHaveBeenCalledTimes(1);
    expect(dynamoDb.delete).toHaveBeenCalledTimes(1);
    expect(JSON.parse(response.body).message).toBe('Missing menu item ID');
  });

  test('should return 500 if database operation fails', async () => {
    // Arrange
    const event = {
      pathParameters: { id }
    };
    
    // Override the mock to throw an error
    mock.module('../src/libs/dynamodb.js', () => ({
      dynamoDb: {
        get: mock().mockImplementation(() => Promise.resolve({
          Item: { id, productName: 'Coffee to Delete' }
        })),
        delete: mock().mockImplementation(() => Promise.reject(new Error('Database error')))
      }
    }));

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Failed to delete menu item');
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
    expect(dynamoDb.delete).toHaveBeenCalledTimes(1);
  });
});