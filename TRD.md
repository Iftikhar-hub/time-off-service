# Technical Requirements Document (TRD)

## Goal
Build a backend Time-Off Microservice using NestJS and SQLite that manages employee time-off requests, maintains accurate balances, and synchronizes with an external HCM system.

> This repository contains the backend implementation only; frontend UI is excluded from scope.

## Problem Statement
ReadyOn is the user-facing system where employees request time off, while HCM remains the source of truth for leave balances. The microservice must ensure:

- Requests are validated against current HCM balances before acceptance.
- Local balances stay synchronized with HCM data.
- Changes originating outside ReadyOn (e.g. anniversary bonuses) are reflected in ReadyOn.
- The system remains defensive against missing or unreliable HCM responses.

## Scope
The microservice provides:

- Request lifecycle management for time-off submissions and status updates.
- Balance lookup by employee and location.
- Scheduled and manual HCM batch synchronization.
- A mock HCM server to simulate real-time and batch HCM interactions.

## Requirements

### Functional
- Create time-off requests with employee, location, date range, days, and reason.
- Validate requests using a real-time HCM balance check.
- Persist requests and balances in SQLite.
- Synchronize balances from HCM periodically and on demand.
- Expose HCM sync logs.

### Non-functional
- Use NestJS for modular architecture.
- Use SQLite for simple persistent storage.
- Include a test suite with coverage for key service behavior.
- Provide clear setup and run instructions.

## Architecture

### Modules
- `TimeOffRequestModule`
  - Controllers: request creation, retrieval, status updates.
  - Services: business rules and HCM validation.
  - Repository: TypeORM-backed persistence.

- `BalanceModule`
  - Controllers: balance lookup by employee and location.
  - Services: local balance retrieval and updates.
  - Repository: TypeORM-backed balance ledger.

- `HcmSyncModule`
  - Controllers: manual batch sync and sync log retrieval.
  - Services: external HCM API integration and balance synchronization.
  - Scheduler: automatic hourly batch sync.

- `Mock HCM Server`
  - Simulates HCM batch synchronization and real-time deduction validation.

### Data model
- `TimeOffRequest`:
  - id, employeeId, locationId, startDate, endDate, days, reason, status
- `Balance`:
  - id, employeeId, locationId, availableDays
- `SyncLog`:
  - id, trigger, status, details, createdAt

## Alternatives Considered

### Prisma instead of TypeORM
- Prisma offers a strong developer experience and migrations, but TypeORM is more direct to wire into NestJS and fulfills the SQLite requirement quickly.

### GraphQL instead of REST
- REST was chosen for faster iteration and clearer endpoint visibility for this exercise.

### In-memory storage instead of SQLite
- SQLite was chosen because persistence is required and it is lightweight for a self-contained microservice.

## Testing Strategy

### Unit tests
- Validate request creation behavior with mocked HCM validation.
- Validate balance retrieval logic.
- Validate sync log creation and status updates.

### Integration tests
- Confirm the root health check and balance endpoint work under Nest application context.
- Confirm the HCM mock endpoints return expected structured responses.

## Deployment and Validation

- Use `npm install` to install dependencies.
- Run `npm run start:dev` to launch the service.
- Run `npm run start:dev` in `mock-hcm-server/` to start the simulated HCM.
- Run `npm test` for the test suite.
- Use `npm run test:cov` for coverage results.

## Extensions

Future work could include:
- Authentication and authorization.
- GraphQL schema for richer query support.
- Distributed event-driven synchronization.
- More robust HCM error handling and retry policies.

## For myself
- This was completed while managing a full-time job with limited available hours. Every architectural decision, naming convention, and business rule was thought through carefully and implemented with the intent to be production-quality. 
- Thank you