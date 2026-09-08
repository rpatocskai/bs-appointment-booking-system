# Barber Booking System (Borbélyüzlet Időpontfoglaló Rendszer)

## Overview

Ez egy teljes körű, modern online időpontfoglaló rendszer helyi borbélyüzletek számára, amely lehetővé teszi a vendégeknek, hogy interneten keresztül, valós időben foglalhassanak időpontot a szabad idősávok függvényében. A projekt egy robusztus, üzleti szabályokat érvényesítő NestJS backend API-ból, valamint egy letisztult, prémium vintage stílusú React (TypeScript) frontend alkalmazásból áll.

---

## Tech Stack (Technológiai Stack)

### Backend

- **Framework:** NestJS (Node.js)
- **Language:** TypeScript
- **Adatperzisztencia:** Filestore (JSON-alapú aszinkron tranzakciós fájlkezelés az egyszerűség és gyorsaság érdekében)
- **Validáció:** Class-validator & Class-transformer
- **Tesztelés:** Vitest (Villámgyors, modern tesztkörnyezet és lefedettség-számítás)

### Frontend

- **Framework:** React 19 / Vite
- **Language:** TypeScript
- **UI Library:** Material UI (MUI v9 - a legújabb CSS Grid-alapú komponensrendszerrel)
- **HTTP Client:** Axios (Központosított, típusbiztos kliens és interjú-kompatibilis API réteg)
- **Tesztelés:** Vitest & React Testing Library (RTL)

---

## Architecture (Architektúra)

A rendszer a **Domain-Driven Design (DDD)** és a **Clean Architecture** elveit követi a maximális tesztelhetőség és a laza kapcsolódás (Loose Coupling) érdekében:

### Kulcsfontosságú Tervezési Minták:

- **Dependency Inversion (SOLID):** A `BookingsService` egy `IBookingRepository` interfészre támaszkodik, nem pedig a konkrét fájlrendszerre, így az adatbáziscsere (pl. PostgreSQL-re) a service módosítása nélkül elvégezhető.
- **Rich Domain Model:** Az időpontok matematikai átfedésének számítása közvetlenül a `Booking` entitás belső üzleti logikájában (`overlapsWith`) lakik, nem pedig anémikus (funkció nélküli) adatosztályokban.

---

## Getting Started (Beüzemelés)

### Előfeltételek

- Node.js (v18 vagy újabb ajánlott)
- npm vagy yarn

### Backend Beüzemelés

1. Navigálj a backend mappába:
   ```bash
   cd backend
   ```
2. Telepítsd a függőségeket:
   ```bash
   npm install
   ```
3. Indítsd el az alkalmazást fejlesztői módban:
   ```bash
   npm run start:dev
   ```
   _A szerver alapértelmezetten a `http://localhost:3000` címen fog futni._

### Frontend Beüzemelés

1. Navigálj a frontend mappába:
   ```bash
   cd frontend
   ```
2. Telepítsd a függőségeket:
   ```bash
   npm install
   ```
3. Indítsd el a Vite fejlesztői szervert:
   ```bash
   npm run dev
   ```
   _A kliens alkalmazás alapértelmezetten a `http://localhost:5173` címen nyílik meg._

---

## Environment Variables (Környezeti Változók)

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3000
VITE_APP_API_KEY=my-super-secret-backend-key-123
```
### Backend (`backend/.env`)

```env
PORT=3000
BARBER_API_URL=https://barber-hono-on-vercel.vercel.app/api/v1
BARBER_API_KEY=08980fd4d393b390ec1d60a33945ff301e28c9092e660f593d6d182bc8364d2c

#Own
APP_API_KEY=my-super-secret-backend-key-123

FRONTEND_URL=http://localhost:5173
```

---

## API Endpoints (Végpontok)

Minden végpont szigorú **X-API-Key header alapú autentikáció** alatt áll.

- `GET /api/v1/barbers` - Borbélyok listázása és beosztása.
- `GET /bookings/availability?barberId=...&date=...` - Elérhető 30 perces szabad idősávok lekérdezése egy adott napra.
- `POST /bookings` - Új időpontfoglalás létrehozása.
- `DELETE /bookings` - **[Hard Reset]** Összes foglalás törlése a rendszerből (Minden felhasználó adatát üríti).

---

## Business Rules & Edge Cases (Üzleti Szabályok)

A backend és frontend rétegek a következő edge case-eket és szabályokat érvényesítik szigorúan, időzóna-biztos módon:

- **Nyitvatartási Idő:** Foglalások csak `07:00` és `20:00` között engedélyezettek.
- **Munkanapok:** Hétfőtől szombatig tart nyitva a szalon, vasárnap és a hivatalos magyar munkaszüneti napokon a foglalás le van tiltva.
- **Múltbeli Időpontok:** Múltbeli dátumra vagy órára visszamenőleg nem lehet időpontot rögzíteni.
- **Átfedés Megakadályozása (Race Condition):** Ugyanazon borbélyhoz nem rendelhető átfedő vagy egybeeső időpont. A JSON perzisztencia aszinkron írási sorral (Promise Chain) védett az egyidejű mentések adatvesztése ellen.

---

## Testing (Tesztelés)

A projekt kiemelkedő, **közel 100%-os unit és integrációs tesztlefedettséggel** rendelkezik, garantálva az időzóna-független és determinisztikus működést (Fake Timers és Mocking technikák használatával).

### Backend Tesztek Futtatása:

```bash
cd backend
npm run test          # Tesztek futtatása
npm run test:coverage # Lefedettségi riport generálása
```

### Frontend Tesztek Futtatása:

```bash
cd frontend
npm run test          # Vitest tesztek indítása
npm run test:ui       # Grafikus Vitest UI megnyitása
```

---

## Technical Decisions (Technikai Döntések)

### Miért JSON alapú a perzisztencia?

A feladat specifikációja (2.1-es pont) megengedte a lehető legegyszerűbb JSON fájlba mentést. Egy lokális tesztfeladatnál ez drasztikusan csökkenti az infrastruktúra komplexitását (nem szükséges külső Docker vagy nehéz DB engine futtatása a validáláshoz), miközben az aszinkron Node.js fájlkezeléssel és repository absztrakcióval a kód éles adatbázisra való felkészítése transzparens maradt.

### Miért a Derived State (Származtatott Állapot) mintát használtuk a React effektekben?

A React 19 és a modern ESLint szabályok szigorúan tiltják a szinkron `setState` hívásokat a `useEffect` törzsében (Cascading Renders). A hiányzó paramétereket és üres állapotokat nem effektből kényszerítjük ki, hanem a renderelés pillanatában, tiszta származtatott állapotként számoljuk ki, ami jobb memóriakezelést és villámgyors UI renderelést biztosít.

### Miért nem használtunk Redux-ot vagy Recoil-t?

A foglalási rendszer állapota lokális és folyamat-vezérelt (Wizard-szerű áramlás). A globális állapotkezelők bevezetése felesleges Boilerplate kódot és komplexitást hozott volna egy ilyen letisztult, egyoldalas alkalmazásba (Overengineering elkerülése). Az atomi állapotok és az egyedi hookok tökéletesen és izoláltan kezelik az üzleti logikát.

---

## Future Improvements (Jövőbeli Fejlesztési Lehetőségek)

- **PostgreSQL / TypeORM:** Az `IBookingRepository` implementáció cseréje relációs adatbázisra.
- **Docker Konténerizáció:** A frontend és backend különálló, izolált konténerbe zárása.
- **CI/CD Pipeline:** Automatikus Vitest tesztfuttatás és lint ellenőrzés minden GitHub Push/Pull Request esetén.
