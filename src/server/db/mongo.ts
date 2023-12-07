import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
let logsCollection: Collection;

const connectToMongoDB = async () => {
    if (!client) {
        client = new MongoClient(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
    }

    const db: Db = client.db('timer');
    logsCollection = db.collection('logs');
};

export { connectToMongoDB, logsCollection };
