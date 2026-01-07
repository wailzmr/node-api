# Node API (Express + SQLite)

Een eenvoudige, database-gedreven API met twee entiteiten: `users` en `posts`. Bevat CRUD, basisvalidatie, paginering (limit/offset) en zoeken.

## Vereisten
- Node.js 20+
- Dependencies: `express`, `sqlite3`

## Starten

```bash
npm install
npm run start
# of voor ontwikkeling
npm run dev
```

Server start op http://localhost:3000 en toont de endpoint documentatie op `/`.

## Endpoints
Zie de HTML-documentatie op de root (`/`) voor voorbeelden en parameters.

## Database
Een SQLite-bestand `database.sqlite` wordt aangemaakt in de projectroot. Tabellen worden automatisch gecreëerd bij opstarten.