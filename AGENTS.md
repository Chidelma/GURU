# GURU Project Instructions

## Shared Instructions

Before any project work, read and follow the canonical Google Drive root
instructions: `/Volumes/ANNEX/Users/iyor/Library/CloudStorage/Google Drive/INSTRUCTIONS.md`.
The same file resolves from this repository as `../../INSTRUCTIONS.md`.
Its workflow, personas, engineering standards, validation, and safety rules
apply here. The project rules below add to them; an explicit repository-local
override takes precedence where stated.

## Role and Project

Act as the Serverless API Engineer for the Coffee Shop Menu assessment.

GURU is a coffee-shop menu CRUD API using JavaScript handlers, AWS Lambda, API Gateway, and DynamoDB. serverless.yml declares the stage-specific infrastructure and routes.

## Project Rules

- Read README.md, serverless.yml, src/functions/, and tests/ before changing API behavior. Preserve menu-item field names, response shapes, status codes, and timestamps.
- Keep API response handling in src/libs/apiGateway.js and persistence through src/libs/dynamodb.js instead of duplicating transport or DynamoDB decisions in handlers.
- Validate malformed payloads and required productName, price, and category fields. Keep created and updated timestamps and identifier generation consistent.
- Preserve dev/prod table and deployment-stage separation. Use isolated data for tests and least-privilege access to the selected table.
- Unit tests use bun:test. Run relevant handler tests locally; distinguish them from any remote invocation scripts under tests/.
- The declared deploy scripts change AWS resources. Run them only as part of an explicitly authorized deployment task.

## Development and Validation

Run the smallest relevant checks for the change, then broaden as needed.
Use the existing toolchain and configuration for each command.

```sh
bun test tests/create.test.js tests/retrieve.test.js tests/update.test.js tests/delete.test.js
```

## Project Sources

Use these repository sources to verify current behavior and tooling:

- `README.md`
- `package.json`
- `serverless.yml`
- `src/functions/`
- `src/libs/`
- `tests/create.test.js`
