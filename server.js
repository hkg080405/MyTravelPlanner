const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');


const app = express();
const PORT = 3000;

const client = new MongoClient(process.env.MONGODB_URI);
let db;


const trips = [
  {
    id: 1,
    destination: 'Barcelona',
    startDate: '2026-10-10',
    endDate: '2026-10-15',
    status: 'Geplant'
  },
  {
    id: 2,
    destination: 'Rom',
    startDate: '2026-11-05',
    endDate: '2026-11-10',
    status: 'Aktiv'
  }
];

const activities = [
  {
    id: 1,
    name: 'Sagrada Família besichtigen',
    location: 'Barcelona',
    date: '2026-10-11',
    category: 'Sehenswürdigkeit',
    status: 'Geplant'
  },
  {
    id: 2,
    name: 'Kolosseum besuchen',
    location: 'Rom',
    date: '2026-11-06',
    category: 'Museum',
    status: 'Geplant'
  }
];

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Travel Planner Backend läuft.'
  });
});

app.get('/api/trips', async (req, res) => {
  try {
    const tripsFromDatabase = await db
      .collection('trips')
      .find({})
      .toArray();

    res.json(tripsFromDatabase);
  } catch (error) {
    res.status(500).json({
      message: 'Reisen konnten nicht geladen werden.'
    });
  }
});


app.get('/api/activities', (req, res) => {
  res.json(activities);
});

app.post('/api/activities', (req, res) => {
  const {
    name,
    location,
    date,
    category,
    status
  } = req.body;

  if (!name || !location || !date || !category) {
    return res.status(400).json({
      message: 'Name, Reise, Datum und Kategorie sind erforderlich.'
    });
  }

  const selectedTrip = trips.find(
    trip => trip.destination === location
  );

  if (!selectedTrip) {
    return res.status(400).json({
      message: 'Die zugehörige Reise wurde nicht gefunden.'
    });
  }

  if (
    date < selectedTrip.startDate ||
    date > selectedTrip.endDate
  ) {
    return res.status(400).json({
      message: 'Das Aktivitätsdatum muss innerhalb des Reisezeitraums liegen.'
    });
  }

  const newActivity = {
    id: activities.length + 1,
    name,
    location,
    date,
    category,
    status: status || 'Geplant'
  };

  activities.push(newActivity);

  res.status(201).json(newActivity);
});

app.post('/api/trips', async (req, res) => {
  try {
    const {
      destination,
      startDate,
      endDate,
      status
    } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        message: 'Reiseziel, Startdatum und Enddatum sind erforderlich.'
      });
    }

    if (endDate < startDate) {
      return res.status(400).json({
        message: 'Das Enddatum darf nicht vor dem Startdatum liegen.'
      });
    }

    const lastTrip = await db
      .collection('trips')
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    const newTrip = {
      id: lastTrip ? lastTrip.id + 1 : 1,
      destination,
      startDate,
      endDate,
      status: status || 'Geplant'
    };

    await db.collection('trips').insertOne(newTrip);

    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({
      message: 'Reise konnte nicht gespeichert werden.'
    });
  }
});

app.delete('/api/trips/:id', (req, res) => {
  const tripId = Number(req.params.id);

  const tripIndex = trips.findIndex(trip => trip.id === tripId);

  if (tripIndex === -1) {
    return res.status(404).json({
      message: 'Reise wurde nicht gefunden.'
    });
  }

  const deletedTrip = trips.splice(tripIndex, 1)[0];

  res.json({
    message: 'Reise wurde gelöscht.',
    trip: deletedTrip
  });
});

app.put('/api/trips/:id', (req, res) => {
  const tripId = Number(req.params.id);

  const trip = trips.find(trip => trip.id === tripId);

  if (!trip) {
    return res.status(404).json({
      message: 'Reise wurde nicht gefunden.'
    });
  }

  const { destination, startDate, endDate, status } = req.body;

  if (!destination || !startDate || !endDate) {
    return res.status(400).json({
      message: 'Reiseziel, Startdatum und Enddatum sind erforderlich.'
    });
  }

  if (endDate < startDate) {
    return res.status(400).json({
      message: 'Das Enddatum darf nicht vor dem Startdatum liegen.'
    });
  }

  trip.destination = destination;
  trip.startDate = startDate;
  trip.endDate = endDate;
  trip.status = status || trip.status;

  res.json(trip);
});

app.delete('/api/activities/:id', (req, res) => {
  const activityId = Number(req.params.id);

  const activityIndex = activities.findIndex(
    activity => activity.id === activityId
  );

  if (activityIndex === -1) {
    return res.status(404).json({
      message: 'Aktivität wurde nicht gefunden.'
    });
  }

  const deletedActivity = activities.splice(activityIndex, 1)[0];

  res.json({
    message: 'Aktivität wurde gelöscht.',
    activity: deletedActivity
  });
});

app.put('/api/activities/:id', (req, res) => {
  const activityId = Number(req.params.id);

  const activity = activities.find(
    activity => activity.id === activityId
  );

  if (!activity) {
    return res.status(404).json({
      message: 'Aktivität wurde nicht gefunden.'
    });
  }

  const {
    name,
    location,
    date,
    category,
    status
  } = req.body;

  if (!name || !location || !date || !category) {
    return res.status(400).json({
      message: 'Name, Reise, Datum und Kategorie sind erforderlich.'
    });
  }

  const selectedTrip = trips.find(
    trip => trip.destination === location
  );

  if (!selectedTrip) {
    return res.status(400).json({
      message: 'Die zugehörige Reise wurde nicht gefunden.'
    });
  }

  if (
    date < selectedTrip.startDate ||
    date > selectedTrip.endDate
  ) {
    return res.status(400).json({
      message: 'Das Aktivitätsdatum muss innerhalb des Reisezeitraums liegen.'
    });
  }

  activity.name = name;
  activity.location = location;
  activity.date = date;
  activity.category = category;
  activity.status = status || activity.status;

  res.json(activity);
});

async function startServer() {
  try {
    await client.connect();

    db = client.db(process.env.DB_NAME);

    console.log('MongoDB-Verbindung im Server funktioniert.');

    app.listen(PORT, () => {
      console.log(`Backend läuft auf http://localhost:${PORT}` );
    });
  } catch (error) {
    console.error('MongoDB-Verbindung fehlgeschlagen:', error.message);
  }
}

startServer();
