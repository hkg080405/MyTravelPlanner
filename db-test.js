require('dotenv').config();

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

async function testDatabaseConnection() {
  try {
    await client.connect();

    console.log('MongoDB-Verbindung funktioniert.');

    await client.db(process.env.DB_NAME).command({
      ping: 1
    });

    console.log('Datenbank wurde erfolgreich erreicht.');
  } catch (error) {
    console.error('Verbindung zu MongoDB fehlgeschlagen:', error.message);
  } finally {
    await client.close();
  }
}

testDatabaseConnection();
