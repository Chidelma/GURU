import { describe, test, expect, mock } from "bun:test";
import { handler } from '../src/functions/getAll.js';
import { dynamoDb } from '../src/libs/dynamodb.js';

// Sample menu items for testing
const sampleMenuItems = [
  {
    id: 'item-1',
    productName: 'Espresso',
    description: 'Strong coffee',
    price: 2.99,
    category: 'Coffee',
    isAvailable: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z'
  },
  {
    id: 'item-2',
    productName: 'Latte',
    description: 'Coffee with milk',
    price: 3.99,
    category: 'Coffee',
    isAvailable: true,
    createdAt: '2023-01-02T00:00:00.000Z',
    updatedAt: '2023-01-02T00:00:00.000Z'
  },
  {
    id: 'item-3',
    productName: 'Croissant',
    description: 'Buttery pastry',
    price: 2.50,
    category: 'Pastry',
    isAvailable: false,
    createdAt: '2023-01-03T00:00:00.000Z',
    updatedAt: '2023-01-03T00:00:00.000Z'
  }
];

// Mock the dynamoDb module
mock.module('../src/libs/dynamodb.js', () => ({
  dynamoDb: {
    scan: mock().mockImplementation(() => Promise.resolve({
      Items: sampleMenuItems,
      Count: sampleMenuItems.length
    }))
  }
}));

describe('Get All Menu Items Handler', () => {

  test('should return all menu items', async () => {
    // Arrange
    const event = {};

    // Invoke
    const response = await handler(event, {}, {});
    const responseBody = JSON.parse(response.body);
    
    // Assert
    expect(response.statusCode).toBe(200);
    expect(dynamoDb.scan).toHaveBeenCalledTimes(1);
    
    // Check response structure
    expect(responseBody).toHaveProperty('menuItems');
    expect(responseBody).toHaveProperty('count');
    expect(responseBody.count).toBe(3);
    expect(responseBody.menuItems).toHaveLength(3);
    
    // Check that items are returned correctly
    expect(responseBody.menuItems[0].productName).toBe('Espresso');
    expect(responseBody.menuItems[1].productName).toBe('Latte');
    expect(responseBody.menuItems[2].productName).toBe('Croissant');
  });

  test('should handle empty items list', async () => {
    // Arrange
    const event = {};
    
    // Override the mock to return empty items
    mock.module('../src/libs/dynamodb.js', () => ({
      dynamoDb: {
        scan: mock().mockImplementation(() => Promise.resolve({
          Items: [],
          Count: 0
        }))
      }
    }));

    // Invoke
    const response = await handler(event, {}, {});
    const responseBody = JSON.parse(response.body);
    
    // Assert
    expect(response.statusCode).toBe(200);
    expect(responseBody.menuItems).toEqual([]);
    expect(responseBody.count).toBe(0);
  });

  test('should return 500 if database operation fails', async () => {
    // Arrange
    const event = {};
    
    // Override the mock to throw an error
    mock.module('../src/libs/dynamodb.js', () => ({
      dynamoDb: {
        scan: mock().mockImplementation(() => Promise.reject(new Error('Database error')))
      }
    }));

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Failed to fetch menu items');
  });
});