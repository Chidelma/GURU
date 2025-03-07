import { describe, test, expect, beforeEach, mock } from "bun:test";
import { handler } from '../src/functions/create.js';
import { dynamoDb } from '../src/libs/dynamodb.js';

// Mock the dynamoDb module
mock.module('../src/libs/dynamodb.js', () => ({
  dynamoDb: {
    create: mock().mockImplementation(() => Promise.resolve({}))
  }
}));

// Mock the uuid module to return UUID
mock.module('uuid', () => ({
  v7: () => Bun.randomUUIDv7()
}));

describe('Create Menu Item Handler', () => {

  beforeEach(() => {
    // Reset all mocks before each test
    // mock.restore()
  })

  test('should create a new menu item with all fields', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        productName: 'Cappuccino',
        description: 'Classic Italian coffee drink',
        price: 4.99,
        category: 'Coffee',
        isAvailable: true
      })
    };

    // Invoke
    const response = await handler(event, {}, {});
    const responseBody = JSON.parse(response.body);
    
    // Assert
    expect(response.statusCode).toBe(201);
    expect(dynamoDb.create).toHaveBeenCalledTimes(1);
    
    // Check item properties
    expect(responseBody.menuItem.id).toBeTruthy();
    expect(responseBody.menuItem.productName).toBe('Cappuccino');
    expect(responseBody.menuItem.description).toBe('Classic Italian coffee drink');
    expect(responseBody.menuItem.price).toBe(4.99);
    expect(responseBody.menuItem.category).toBe('Coffee');
    expect(responseBody.menuItem.isAvailable).toBe(true);
    expect(responseBody.menuItem.createdAt).toBeTruthy();
    expect(responseBody.menuItem.updatedAt).toBeTruthy();
  });

  test('should create a menu item with minimal required fields', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        productName: 'Espresso',
        price: 3.99,
        category: 'Coffee'
      })
    };

    // Invoke
    const response = await handler(event, {}, {});
    const responseBody = JSON.parse(response.body);
    
    // Assert
    expect(response.statusCode).toBe(201);
    expect(responseBody.menuItem.productName).toBe('Espresso');
    expect(responseBody.menuItem.price).toBe(3.99);
    expect(responseBody.menuItem.category).toBe('Coffee');
    // Default values
    expect(responseBody.menuItem.description).toBe('');
    expect(responseBody.menuItem.isAvailable).toBe(true);
  });

  test('should return 400 if productName is missing', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        price: 4.99,
        category: 'Coffee'
      })
    };

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(400);
    expect(dynamoDb.create).toHaveBeenCalledTimes(2);
    expect(JSON.parse(response.body).message).toContain('required fields');
  });

  test('should return 400 if price is missing', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        productName: 'Latte',
        category: 'Coffee'
      })
    };

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(400);
    expect(dynamoDb.create).toHaveBeenCalledTimes(2);
  });

  test('should return 400 if category is missing', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        productName: 'Latte',
        price: 4.99
      })
    };

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(400);
    expect(dynamoDb.create).toHaveBeenCalledTimes(2);
  });

  test('should return 500 if database operation fails', async () => {
    // Arrange
    const event = {
      body: JSON.stringify({
        productName: 'Cappuccino',
        price: 4.99,
        category: 'Coffee'
      })
    };
    
    // Override the mock to throw an error
    mock.module('../src/libs/dynamodb.js', () => ({
      dynamoDb: {
        create: mock().mockImplementation(() => Promise.reject(new Error('Database error')))
      }
    }));

    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(500);
    expect(JSON.parse(response.body).message).toBe('Failed to create menu item');
  });

  test('should handle malformed JSON in request body', async () => {
    // Arrange
    const event = {
      body: '{malformed-json'
    };

    // Invoke
    const response = await handler(event, {}, {});
    
    // Assert
    expect(response.statusCode).toBe(500);
    expect(dynamoDb.create).toHaveBeenCalledTimes(1);
  });
});