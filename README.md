# Barber Booking System

## Overview

Online appointment booking system for barbershops that allows customers to book appointments via the internet. The system includes a comprehensive backend API for data management, as well as a modern web-based frontend application.

## Tech Stack

### Frontend

- React
- TypeScript
- MUI
- TanStack Query
- Playwright

### Backend

- NestJS
- TypeScript
- JSON persistence

## Architecture

diagram

## Getting Started

### Backend

npm install
npm run start:dev

### Frontend

npm install
npm run dev

## Environment Variables

## API

GET /barbers
GET /availability
POST /bookings
...

## Business Rules

- Opening hours
- Working days
- Past dates
- Overlapping bookings
  ...

## Testing

npm test

npm run test:e2e

## Technical Decisions

Why JSON?
Why TanStack Query?
Why repository abstraction?
Why no Redux/Recoil?

## Trade-offs

## Future Improvements

- PostgreSQL
- Docker
- CI/CD
