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


app.get('/api/activities', async (req, res) => {
  try {
    const activitiesFromDatabase = await db
      .collection('activities')
      .find({})
      .toArray();

    res.json(activitiesFromDatabase);
  } catch (error) {
    res.status(500).json({
      message: 'Aktivitäten konnten nicht geladen werden.'
    });
  }
});

app.post('/api/activities', async (req, res) => {
  try {
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

    const selectedTrip = await db.collection('trips').findOne({
      destination: location
    });

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

    const lastActivity = await db
      .collection('activities')
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .next();

    const newActivity = {
      id: lastActivity ? lastActivity.id + 1 : 1,
      name,
      location,
      date,
      category,
      status: status || 'Geplant'
    };

    await db.collection('activities').insertOne(newActivity);

    res.status(201).json(newActivity);
  } catch (error) {
    res.status(500).json({
      message: 'Aktivität konnte nicht gespeichert werden.'
    });
  }
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

app.delete('/api/trips/:id', async (req, res) => {
  try {
    const tripId = Number(req.params.id);

    const deletedTrip = await db.collection('trips').findOneAndDelete({
      id: tripId
    });

    if (!deletedTrip) {
      return res.status(404).json({
        message: 'Reise wurde nicht gefunden.'
      });
    }

    res.json({
      message: 'Reise wurde gelöscht.',
      trip: deletedTrip
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Reise konnte nicht gelöscht werden.'
    });
  }
});


app.put('/api/trips/:id', async (req, res) => {
  try {
    const tripId = Number(req.params.id);

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

    const result = await db.collection('trips').updateOne(
      { id: tripId },
      {
        $set: {
          destination,
          startDate,
          endDate,
          status: status || 'Geplant'
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Reise wurde nicht gefunden.'
      });
    }

    const updatedTrip = await db.collection('trips').findOne({
      id: tripId
    });

    res.json(updatedTrip);
  } catch (error) {
    res.status(500).json({
      message: 'Reise konnte nicht aktualisiert werden.'
    });
  }
});

app.delete('/api/activities/:id', async (req, res) => {
  try {
    const activityId = Number(req.params.id);

    const deletedActivity = await db
      .collection('activities')
      .findOneAndDelete({
        id: activityId
      });

    if (!deletedActivity) {
      return res.status(404).json({
        message: 'Aktivität wurde nicht gefunden.'
      });
    }

    res.json({
      message: 'Aktivität wurde gelöscht.',
      activity: deletedActivity
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Aktivität konnte nicht gelöscht werden.'
    });
  }
});



app.put('/api/activities/:id', async (req, res) => {
  try {
    const activityId = Number(req.params.id);

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

    const selectedTrip = await db.collection('trips').findOne({
      destination: location
    });

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

    const result = await db.collection('activities').updateOne(
      { id: activityId },
      {
        $set: {
          name,
          location,
          date,
          category,
          status: status || 'Geplant'
        }
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        message: 'Aktivität wurde nicht gefunden.'
      });
    }

    const updatedActivity = await db.collection('activities').findOne({
      id: activityId
    });

    res.json(updatedActivity);
  } catch (error) {
    res.status(500).json({
      message: 'Aktivität konnte nicht aktualisiert werden.'
    });
  }
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
