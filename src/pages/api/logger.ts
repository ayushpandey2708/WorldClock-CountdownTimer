import { NextApiRequest, NextApiResponse } from 'next';
import { logTimerAction, fetchLogEntriesFromMongoDB } from '../../server/utils/logger';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { action} = req.body;
        await logTimerAction(action);
        res.status(200).json({ message: 'Action logged successfully' });
    } else if (req.method === 'GET') {
        const entries = await fetchLogEntriesFromMongoDB();
        res.status(200).json(entries);
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
