# ✈️ Travel Planner

Eine moderne Webanwendung zur Planung und Organisation von Reisen und Aktivitäten.

Der **Travel Planner** wurde als Semesteraufgabe im Modul **WebTech an der HTW Berlin** entwickelt. Nutzerinnen können Reisen und dazugehörige Aktivitäten erstellen, anzeigen, bearbeiten und löschen.

## 📸 Screenshots

> Die Screenshots werden im Repository unter `docs/screenshots/` gespeichert.

### Startseite

![Startseite](docs/screenshots/01-startseite.png)

### Reise- und Aktivitätsübersicht

![Reiseübersicht](docs/screenshots/02-reise-uebersicht.png)

### Neue Reise erstellen und neue Aktivität erstellen

![Reise erstellen](docs/screenshots/03-reise-erstellen.png)

### Bearbeiten und Validierung

![Bearbeiten](docs/screenshots/05-bearbeiten.png)

![Validierung](docs/screenshots/06-validierung.png)

## ✨ Features

### 🧳 Reisen

- Reisen anzeigen
- neue Reisen erstellen
- Reisen bearbeiten
- Reisen löschen
- Status ändern: `Geplant` oder `Aktiv`
- Start- und Enddatum festlegen
- Prüfung des Reisezeitraums

### 🎟️ Aktivitäten

- Aktivitäten anzeigen
- neue Aktivitäten erstellen
- Aktivitäten bearbeiten
- Aktivitäten löschen
- Aktivitäten einer Reise zuordnen
- Datum innerhalb des Reisezeitraums auswählen
- Status ändern
- Kategorie auswählen:
  - Sehenswürdigkeit
  - Restaurant
  - Museum
  - Ausflug
  - Shopping

### 🎨 Benutzeroberfläche

- responsive Darstellung
- Bootstrap als CSS-Framework
- pastel-pinkes und lavender-farbenes Design
- Erfolgs- und Fehlermeldungen
- Bestätigungsdialog vor dem Löschen
- übersichtliche Formulare und Karten

## 🛠️ Technologien

### Frontend

- Angular 19
- TypeScript
- HTML
- SCSS
- Bootstrap
- Angular `HttpClient`
- RxJS `Observable`

### Backend

- Node.js
- Express
- REST-API
- CORS
- dotenv
- MongoDB Node.js Driver

### Datenbank

- MongoDB Atlas

## 🏗️ Architektur

```text
Angular-Frontend
       |
       | HTTP-Anfragen über ApiService
       v
Node.js + Express-Backend
       |
       | MongoDB Driver
       v
MongoDB Atlas
```

Das Angular-Frontend kommuniziert über den zentralen Service `api.service.ts` mit dem Express-Backend. Das Backend verarbeitet die REST-Anfragen und speichert die Daten dauerhaft in MongoDB.

Beispiel für das Erstellen einer Aktivität:

```text
Aktivitätsformular
  -> TripsComponent.addActivity()
  -> ApiService.createActivity()
  -> POST /api/activities
  -> Express
  -> MongoDB
  -> Antwort an Angular
  -> Aktivität erscheint sofort in der Liste
```

## 💾 Datenmodell

### Reise

```text
destination  Reiseziel
startDate    Startdatum
endDate      Enddatum
status       Geplant oder Aktiv
```

### Aktivität

```text
name         Name der Aktivität
location     zugehöriges Reiseziel
date         Datum der Aktivität
category     Kategorie
status       Geplant oder Aktiv
```

MongoDB erzeugt zusätzlich automatisch eine interne `_id`. Für die REST-Endpunkte wird die eigene numerische `id` verwendet.

## 🔄 CRUD und REST-API

CRUD bedeutet:

- **Create** – erstellen
- **Read** – anzeigen
- **Update** – bearbeiten
- **Delete** – löschen

### Reisen

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/trips` | alle Reisen anzeigen |
| `POST` | `/api/trips` | eine Reise erstellen |
| `PUT` | `/api/trips/:id` | eine Reise bearbeiten |
| `DELETE` | `/api/trips/:id` | eine Reise löschen |

### Aktivitäten

| Methode | Endpunkt | Beschreibung |
|---|---|---|
| `GET` | `/api/activities` | alle Aktivitäten anzeigen |
| `POST` | `/api/activities` | eine Aktivität erstellen |
| `PUT` | `/api/activities/:id` | eine Aktivität bearbeiten |
| `DELETE` | `/api/activities/:id` | eine Aktivität löschen |

### Health-Check

```text
GET /api/health
```

Dieser Endpunkt prüft, ob das Backend läuft.

## 📁 Projektstruktur

Frontend und Backend wurden in einem gemeinsamen Repository organisiert:

```text
travel-planner/
├── src/                         Angular-Frontend
│   └── app/
│       ├── pages/trips/         Reise- und Aktivitätsseite
│       ├── services/            Angular-Services
│       └── app.config.ts        HttpClient-Konfiguration
├── backend/                     Node.js-/Express-Backend
│   ├── server.js                REST-API
│   ├── seed.js                  Beispieldaten für Reisen
│   ├── seed-activities.js       Beispieldaten für Aktivitäten
│   ├── db-test.js               Verbindungstest
│   ├── db-check.js              Datenbankprüfung
│   └── package.json              Backend-Abhängigkeiten
├── package.json                 Frontend-Abhängigkeiten
├── package-lock.json
└── README.md
```

## ⚙️ Installation

### Voraussetzungen

Vor der Installation müssen folgende Programme vorhanden sein:

- [Node.js](https://nodejs.org/ )
- npm
- [Angular CLI](https://angular.dev/tools/cli )
- MongoDB-Atlas-Konto
- Git

Versionen können geprüft werden mit:

```bash
node --version
npm --version
ng version
```

### Repository klonen

```bash
git clone DEIN-GITHUB-REPOSITORY-LINK
cd travel-planner
```

### Frontend installieren

```bash
npm install
```

### Backend installieren

```bash
cd backend
npm install
```

### MongoDB konfigurieren

Im Ordner `backend/` muss eine Datei `.env` angelegt werden:

```env
MONGODB_URI=DEINE_MONGODB_VERBINDUNGSADRESSE
DB_NAME=travel_planner
```

Die `.env`-Datei enthält vertrauliche Zugangsdaten und darf **nicht** bei GitHub hochgeladen werden.

## ▶️ Anwendung starten

### Backend starten

Im Ordner `backend/`:

```bash
node server.js
```

Das Backend läuft unter:

```text
http://localhost:3000
```

Der Health-Endpunkt ist:

```text
http://localhost:3000/api/health
```

### Frontend starten

In einem zweiten Terminal im Projektordner:

```bash
ng serve
```

Die Anwendung ist anschließend erreichbar unter:

```text
http://localhost:4200
```

Für die vollständige Anwendung müssen Backend und Frontend gleichzeitig laufen.

## 🌱 Beispieldaten

Die Datenbank besitzt zwei Collections:

- `trips`
- `activities`

Die Datenbank kann mit den Seed-Skripten vorausgefüllt werden:

```bash
node seed.js
node seed-activities.js
```

Die Skripte sollten nicht mehrfach ausgeführt werden, da sonst doppelte Beispieldaten entstehen können.

Verbindung testen:

```bash
node db-test.js
```

Datenbankinhalt prüfen:

```bash
node db-check.js
```

## ✅ Validierung und Fehlerbehandlung

Die Anwendung prüft Eingaben im Frontend und Backend:

- Pflichtfelder dürfen nicht leer sein.
- Das Enddatum darf nicht vor dem Startdatum liegen.
- Startdaten dürfen nicht in der Vergangenheit liegen.
- Das Aktivitätsdatum muss innerhalb des Reisezeitraums liegen.
- Die zugehörige Reise muss existieren.
- `400` wird bei ungültigen Eingaben verwendet.
- `404` wird verwendet, wenn ein Datensatz nicht gefunden wird.
- `500` wird bei Server- oder Datenbankfehlern verwendet.

Nach erfolgreichen Aktionen zeigt das Frontend eine Erfolgsmeldung an. Beim Löschen wird zunächst eine Bestätigung verlangt.

## 🤖 Verwendung von KI

Die Nutzung von KI war laut Aufgabenstellung erlaubt. KI wurde als Unterstützung beim Lernen und Programmieren verwendet.

Verwendetes KI-Werkzeug:

- **Manus beziehungsweise ChatGPT**
  - Planung der Full-Stack-Architektur
  - Erklärung von Angular-Komponenten und Services
  - Unterstützung beim Erstellen der Express-Endpunkte
  - Unterstützung bei der MongoDB-Anbindung
  - Hilfe bei Fehlersuche und Validierung

Der Code wurde lokal ausgeführt und getestet. Die wichtigsten Zusammenhänge der Anwendung können erklärt werden, insbesondere:

- Angular-Komponenten und Templates
- `ApiService` und `HttpClient`
- REST-Endpunkte
- Express-Routen
- MongoDB-Collections
- CRUD-Ablauf
- Validierung und Fehlerbehandlung

## ⚠️ Bekannte Grenzen

- Es gibt aktuell keine Benutzerkonten und keinen Login.
- Die Daten sind nicht einzelnen Nutzerinnen zugeordnet.
- Der Status wird manuell gesetzt.
- Das Backend läuft lokal unter `localhost:3000`.
- Die Anwendung ist aktuell nicht produktiv deployed.

Die Anwendung wurde als Einzelprojekt entwickelt. Die Login- und Benutzerzuordnung ist in der Aufgabenstellung nur für Projekte mit zwei Studentinnen erforderlich.

## 🚀 Mögliche Erweiterungen

- Login und Benutzerkonten
- Filter nach Kategorie und Status
- Sortierung nach Datum
- Kalenderansicht
- Kartenansicht für Reiseziele
- automatische Statusberechnung
- Deployment von Frontend, Backend und Datenbank
- eigene TypeScript-Interfaces anstelle von `any`

## 🔐 Sicherheitshinweis

Folgende Dateien und Inhalte dürfen niemals in ein öffentliches Repository hochgeladen werden:

```text
backend/.env
MongoDB-Passwörter
API-Schlüssel
node_modules/
```

Falls ein Passwort versehentlich veröffentlicht wurde, muss es in MongoDB Atlas sofort geändert werden.

## 📚 Modulbezug

Das Projekt verwendet zentrale Inhalte des WebTech-Moduls:

- HTML und Templates
- CSS und responsive Webdesign
- JavaScript und TypeScript
- Angular-Komponenten
- Angular-Routing und Services
- HTTP und REST
- Node.js und Express
- MongoDB
- Frontend-Backend-Anbindung
- Git und GitHub

## 📄 Lizenz

Dieses Projekt wurde im Rahmen der Semesteraufgabe im Modul WebTech an der HTW Berlin erstellt.
