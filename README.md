# Coffee Shop Menu Management API

A serverless REST API built with AWS Lambda, API Gateway, and DynamoDB to manage a coffee shop's menu items.

## Features

- Full CRUD operations for menu items
- Serverless architecture using AWS Lambda and API Gateway
- Multi-stage deployments (dev, prod)
- Automated CI/CD pipeline with GitHub Actions

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /menu-items | Create a new menu item |
| GET | /menu-items | Get all menu items |
| GET | /menu-items/{id} | Get a specific menu item by ID |
| PUT | /menu-items/{id} | Update a specific menu item |
| DELETE | /menu-items/{id} | Delete a specific menu item |

## Data Model

Menu Item:
```json
{
  "id": "uuid",
  "productName": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "isAvailable": "boolean",
  "createdAt": "string (ISO date)",
  "updatedAt": "string (ISO date)"
}
```

Here is a [Loom Video](https://www.loom.com/share/141d5f8095f14072ac1118a935be9143?sid=9a1d094d-3eed-46f8-a08f-140492858f37) explaining the soluition