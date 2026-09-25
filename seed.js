require('dotenv').config();

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

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

async function seedTrips() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);

    await db.collection('trips').deleteMany({});
    await db.collection('trips').insertMany(trips);

    console.log('Reisen wurden in MongoDB gespeichert.');
  } catch (error) {
    console.error('Fehler beim Speichern:', error.message);
  } finally {
    await client.close();
  }
}

seedTrips();
