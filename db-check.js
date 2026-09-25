require('dotenv').config();

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

async function checkDatabase() {
  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    const trips = await db.collection('trips').find({}).toArray();

    console.log('Verwendete Datenbank:', process.env.DB_NAME);
    console.log('Anzahl Reisen:', trips.length);
    console.log('Reisen:', trips);
  } catch (error) {
    console.error('Fehler beim Lesen:', error.message);
  } finally {
    await client.close();
  }
}

checkDatabase();
