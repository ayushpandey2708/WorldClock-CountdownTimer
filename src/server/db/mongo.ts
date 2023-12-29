import { MongoClient, Db, Collection } from 'mongodb';

let client: MongoClient;
let logsCollection: Collection;

const mongodbUri = process.env.MONGODB_URI 

const connectToMongoDB = async () => {
    try{
        if (!client) {

            if (!mongodbUri) {
                throw new Error('MONGODB_URI environment variable is not defined.');
            }

            client = new MongoClient(mongodbUri);
            await client.connect();
        }

        const db: Db = client.db('timer');
        logsCollection = db.collection('logs');
    } 
    catch (error:any) {
        console.error(`An error occurred: ${error.message}`);
    }
};

export { connectToMongoDB, logsCollection };
