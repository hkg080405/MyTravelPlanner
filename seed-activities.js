require('dotenv').config();

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

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

async function seedActivities() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);

    await db.collection('activities').deleteMany({});
    await db.collection('activities').insertMany(activities);

    console.log('Aktivitäten wurden in MongoDB gespeichert.');
  } catch (error) {
    console.error('Fehler beim Speichern:', error.message);
  } finally {
    await client.close();
  }
}

seedActivities();
