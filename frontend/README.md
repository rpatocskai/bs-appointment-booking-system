# Barber Booking System - Frontend Web Application

## Tech Stack
- **Framework:** React 19 / Vite
- **Language:** TypeScript
- **UI Library:** Material UI (MUI v9) + Egyedi atomi UI komponensek
- **HTTP Client:** Axios
- **Testing:** Vitest & React Testing Library (RTL)

## Environment Setup

Az API-val való típusbiztos kommunikációhoz kötelező beállítani a környezeti változókat. Másold le a sablont az operációs rendszered szerint:

```bash
# Linux / macOS esetén:
\$ cp .env_template .env

# Windows (Command Prompt / PowerShell) esetén:
\$ copy .env_template .env
```

### Konfigurációs elvárások (`.env`):
```env
VITE_API_URL=http://localhost:3000
VITE_APP_API_KEY=my-super-secret-backend-key-123
```

## Project Setup

```bash
# Függőségek telepítése
\$ npm install
```

## Run Application

```bash
# Fejlesztői szerver indítása (Vite)
\$ npm run dev

# Gyártási build készítése
\(npm run build\) npm run preview
```

## UI & Architecture Design
- **Központosított HTTP Kliens:** Újrahasznosítható, konfigurált `apiClient` példány az Axios hívások kezelésére.
- **Dizájnkonzisztencia:** Globálisan kiszervezett, saját atomi `Button` komponensek és variánsok (`primary`, `outline`) használata a gyári MUI gombok helyett az egységes vintage arculatért.
- **Derived State minta:** Cascading Renders elkerülése a React 19 elvárások és szigorú linter szabályok szerint.

## Run Tests (Vitest & RTL)

A tesztek lefedik az egyedi hookokat, a prezentációs és az integrált felugró ablakos (`Dialog`) foglalási folyamatokat is.

```bash
# Tesztek indítása (Watch mode)
\$ npm run test

# Tesztek egyszeri lefutása (CI környezet)
\$ npm run test:run

# Grafikus Vitest UI kezelőfelület megnyitása
\$ npm run test:ui
```
