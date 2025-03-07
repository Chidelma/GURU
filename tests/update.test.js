import { describe, test, expect, mock } from "bun:test";
import { handler } from '../src/functions/update.js';
import { dynamoDb } from '../src/libs/dynamodb.js';

const IdAll = Bun.randomUUIDv7()

// Mock the dynamoDb module
mock.module('../src/libs/dynamodb.js', () => ({
  dynamoDb: {
    get: mock().mockImplementation(() => Promise.resolve({
      Item: {
        id: IdAll,
        name: 'Original Coffee',
        description: 'Original description',
        price: 3.99,
        category: 'Coffee',
        isAvailable: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z'
      }
    })),
    update: mock().mockImplementation(() => Promise.resolve({
      Attributes: {
        id: IdAll,
        name: 'Updated Coffee',
        description: 'Updated description',
        price: 4.99,
        category: 'Coffee',
        isAvailable: true,
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-02T00:00:00.000Z'
      }
    }))
  }
}));

describe('Update Menu Item Handler', () => {

  test('should update an existing menu item', async () => {
    // Arrange
    const event = {
      pathParameters: { id: IdAll },
      body: JSON.stringify({
        name: 'Updated Coffee',
        description: 'Updated description',
        price: 4.99
      })
    };

    // Invoke
    const response = await handler(event, {}, {});
    const responseBody = JSON.parse(response.body);
    
    // Assert
    expect(response.statusCode).toBe(200);
    expect(dynamoDb.get).toHaveBeenCalledTimes(1);
    expect(dynamoDb.update).toHaveBeenCalledTimes(1);
    
    // Check updated properties
    expect(responseBody.menuItem.name).toBe('Updated Coffee');
    expect(responseBody.menuItem.description).toBe('Updated description');
    expect(responseBody.menuItem.price).toBe(4.99);
  });

  test('should return 400 if id is missing', async () => {
    // Arrange
    const event = {
      pathParameters: undefined,
      body: JSON.stringify({
        name: 'Updated Coffee'
      })
    };

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(400);
    expect(dynamoDb.get).toHaveBeenCalledTimes(1);
    expect(dynamoDb.update).toHaveBeenCalledTimes(1)
    expect(JSON.parse(response.body).message).toBe('Missing menu item ID');
  });

  test('should return 404 if menu item does not exist', async () => {
    // Arrange
    const event = {
      pathParameters: { id: Bun.randomUUIDv7() },
      body: JSON.stringify({
        name: 'Updated Coffee'
      })
    };
    
    // Override the mock to return no item
    mock.module('../src/libs/dynamodb.js', () => ({
      dynamoDb: {
        get: mock().mockImplementation(() => Promise.resolve({ Item: null })),
        update: mock()
      }
    }));

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(404);
    expect(dynamoDb.get).toHaveBeenCalledTimes(1);
    expect(dynamoDb.update).toHaveBeenCalledTimes(0);
    expect(JSON.parse(response.body).message).toBe('Menu item not found');
  });

  test('should return 500 if database operation fails', async () => {

    // Arrange
    const event = {
      pathParameters: { id: IdAll },
      body: JSON.stringify({
        name: 'Updated Coffee'
      })
    };
    
    // Override the mock to throw an error
    mock.module('../src/libs/dynamodb.js', () => ({
      dynamoDb: {
        get: mock().mockImplementation(() => Promise.resolve({
          Item: { id: IdAll, name: 'Original Coffee' }
        })),
        update: mock().mockImplementation(() => Promise.reject(new Error('Database error')))
      }
    }));

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Failed to update menu item');
  });
});