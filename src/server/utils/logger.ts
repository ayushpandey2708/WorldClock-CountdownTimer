import { connectToMongoDB, logsCollection } from '../db/mongo';

const logTimerAction = async (action: string) => {
    if (!logsCollection) {
        await connectToMongoDB();
    }

    const logEntry = {
        timestamp: new Date(),
        action,
    };

    await logsCollection.insertOne(logEntry);
};

const fetchLogEntriesFromMongoDB = async () => {
    if (!logsCollection) {
        await connectToMongoDB();
    }

    const entries = await logsCollection.find({}, { projection: { _id: 0 } }).toArray();

    return entries.map(formatLogEntry);
};

const formatLogEntry = (entry: any) => {
    return `${entry.timestamp.toLocaleString()} - ${entry.action}`;
};

export { logTimerAction, fetchLogEntriesFromMongoDB };
