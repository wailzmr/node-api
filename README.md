## Users & Posts API

Een professionele, database-gedreven REST API gebouwd met Node.js, Express en SQLite voor het beheren van users en posts.

---

## Overzicht

Dit project implementeert een volledige REST API met CRUD-operaties voor twee entiteiten (`users` en `posts`).
De API ondersteunt validatie, zoekfunctionaliteit, paginering en een HTML-documentatiepagina op de root.

**Status:** Production Ready (voor lokale ontwikkeling / demo)

De applicatie gebruikt standaard SQLite als database. Het databasebestand `database.sqlite` wordt automatisch aangemaakt bij de eerste start; je hoeft dus geen database manueel te initialiseren.

---

## Documentatie

- HTML API documentatie: beschikbaar op `http://localhost:3000/`
- Overzicht van alle endpoints met query parameters en validatieregels staat op de HTML-pagina in de map `public/index.html`.

---

## Quick Start

```bash
# 1. Dependencies installeren
npm install

# 2. Server starten
npm start
# of
npm run dev
```

De API draait standaard op: `http://localhost:3000`.

- Root (`/`) toont de HTML documentatie.
- JSON API endpoints zijn beschikbaar op `/users` en `/posts`.

---

## API Overzicht

### Users

Twee CRUD endpoints voor het beheren van users.

- `GET /users` – lijst alle users
	- Query parameters:
		- `limit` (int) – max. aantal resultaten
		- `offset` (int) – startindex voor paginering
		- `search` (string) – zoekt in `name` en `email`
- `GET /users/:id` – details van één user
- `POST /users` – nieuwe user aanmaken
- `PUT /users/:id` – bestaande user updaten
- `DELETE /users/:id` – user verwijderen

### Posts

Twee CRUD endpoints voor het beheren van posts.

- `GET /posts` – lijst alle posts
	- Query parameters:
		- `limit` (int) – max. aantal resultaten
		- `offset` (int) – startindex voor paginering
		- `search` (string) – zoekt in `title`
- `GET /posts/:id` – details van één post
- `POST /posts` – nieuwe post aanmaken
- `PUT /posts/:id` – bestaande post updaten
- `DELETE /posts/:id` – post verwijderen

Voor concrete voorbeelden (inclusief query strings en JSON bodies), zie de HTML-documentatie op `/`.

---

## Features Overzicht

### Functionele Minimum Requirements

**Twee CRUD Interfaces**

- Users: `GET`, `POST`, `PUT`, `DELETE` op `/users`
- Posts: `GET`, `POST`, `PUT`, `DELETE` op `/posts`

**Basisvalidatie**

- Users
	- `name` verplicht, mag geen cijfers bevatten
	- `email` verplicht, geldig e‑mailformaat en uniek
	- `age` verplicht, geheel getal, `age >= 0`
- Posts
	- `title` verplicht
	- `content` verplicht
	- `user_id` verplicht, geheel getal en moet verwijzen naar een bestaande user

**Pagination Support**

- Alle list endpoints ondersteunen `limit` en `offset` query parameters
- Response bevat een `meta` object met o.a. `limit`, `offset` en `count`

**Search Functionaliteit**

- `GET /users?search=term` – zoekt in `name` en `email`
- `GET /posts?search=term` – zoekt in `title`

**API Documentatie**

- Volledige HTML documentatie op `/` (root)

---

## Technische Requirements

- Node.js: versie 20.0.0 of hoger
- Express: web framework
- SQLite: embedded database (`database.sqlite` in de projectroot)
- HTTP Verbs: correct gebruik van `GET`, `POST`, `PUT`, `DELETE`
- REST API: eenvoudige, resource-gebaseerde endpoints

---

## Installatie & Setup

### Vereisten

- Node.js versie 20 of hoger
- `npm` (standaard meegeleverd met Node.js)

### Stappen

1. Repository clonen of downloaden
2. Dependencies installeren:

	 ```bash
	 npm install
	 ```

3. Server starten:

	 ```bash
	 npm start
	 # of
	 npm run dev
	 ```

4. Open in de browser:
	 - `http://localhost:3000` → HTML documentatie

---

## Voorbeelden (cURL)

```bash
# Alle users ophalen (eerste 10)
curl "http://localhost:3000/users?limit=10&offset=0"

# Zoeken naar users met 'alice' in naam of e‑mail
curl "http://localhost:3000/users?search=alice"

# Alle posts met 'API' in de titel
curl "http://localhost:3000/posts?search=API"

# Nieuwe user aanmaken
curl -X POST http://localhost:3000/users \
	-H "Content-Type: application/json" \
	-d '{
		"name": "John Doe",
		"email": "john@example.com",
		"age": 30
	}'

# Nieuwe post aanmaken
curl -X POST http://localhost:3000/posts \
	-H "Content-Type: application/json" \
	-d '{
		"title": "Eerste post",
		"content": "Dit is de inhoud van de post.",
		"user_id": 1
	}'
```

---

## Database

- De database is een SQLite-bestand: `database.sqlite` in de projectroot
- Tabellen worden automatisch aangemaakt bij opstarten:
	- `users` met kolommen: `id`, `name`, `email`, `age`
	- `posts` met kolommen: `id`, `title`, `content`, `user_id`
- Foreign keys zijn geactiveerd en `posts.user_id` verwijst naar `users.id`
- Er worden automatisch enkele demo-users en demo-posts gezaaid als de tabellen leeg zijn

---

## Gebruikte Technologieën

| Technologie | Versie   | Doel                |
|------------|----------|---------------------|
| Node.js    | 20.0.0+  | JavaScript runtime  |
| Express    | 5.x      | Web framework       |
| sqlite3    | 5.x      | Database driver     |

---

## Testing

De API kan getest worden met:

- Browser – voor de HTML documentatie (`/`) en eenvoudige `GET` requests
- Postman / Thunder Client – voor alle HTTP methods
- cURL – voor command-line testing (zie voorbeelden hierboven)

---

## Bronvermelding

Dit project is geschreven als oefening in het bouwen van een eenvoudige REST API met Node.js, Express en SQLite.

Gebruikte referenties:

- Node.js Documentation – server runtime
- Express.js Guide – web framework
- SQLite Documentation – database

---

## Auteur

Backend Web API Project - EHB 2026

---

## Licentie

ISC