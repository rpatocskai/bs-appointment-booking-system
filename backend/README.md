<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">Barber Booking System - Backend API Production Starter</p>

## Tech Stack
- **Framework:** NestJS
- **Language:** TypeScript
- **Persistence:** JSON Filestore Abstraction
- **Testing:** Vitest

## Environment Setup

A projekt futtatása előtt kötelező létrehozni a helyi környezeti változókat. Másold le a sablonfájlt az alábbi parancsok egyikével a használt operációs rendszerednek megfelelően:

```bash
# Linux / macOS esetén:
\$ cp .env_template .env

# Windows (Command Prompt / PowerShell) esetén:
\$ copy .env_template .env
```

### Konfigurációs elvárások (`.env`):
```env
PORT=3000
BARBER_API_URL=https://vercel.app
BARBER_API_KEY=08980fd4d393b390ec1d60a33945ff301e28c9092e660f593d6d182bc8364d2c
APP_API_KEY=my-super-secret-backend-key-123
FRONTEND_URL=http://localhost:5173
```

## Project Setup

```bash
\$ npm install
```

## Compile and Run

```bash
# Development (Watch mode)
\$ npm run start:dev

# Production build & run
\(npm run build\) npm run start:prod
```

## API Endpoints

Minden kérés fejlécében kötelező átadni az `x-api-key` paramétert az `APP_API_KEY` értékével.

- `GET /api/v1/barbers` - Borbélyok listázása
- `GET /bookings/availability` - Szabad idősávok lekérése napra és borbélyra bontva
- `POST /bookings` - Új időpontfoglalás rögzítése
- `GET /bookings` - Saját foglalások lekérése e-mail cím alapján
- `DELETE /bookings/:id` - Egy konkrét foglalás lemondása azonosító alapján
- `DELETE /bookings` - Összes foglalás törlése (Hard Reset)

## Run Tests (Vitest)

A tesztelési környezet Fake Timers és Mocking technikákkal teljesen izolált és determinisztikus.

```bash
# Összes backend egységteszt futtatása
\$ npm run test

# Tesztlefedettségi (coverage) riport generálása
\$ npm run test:cov
```

## License
[MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
