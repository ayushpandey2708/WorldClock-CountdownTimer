import { useState, useEffect } from 'react';
import CountdownTimer from '../components/CountdownTimer';
import styles from '../styles/index.module.css';
import WorldClock from '../components/WorldClock';

interface Timer {
    id: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const Home: React.FC = () => {
    const [timers, setTimers] = useState<Timer[]>([]);
    const [selectedTimeZone, setSelectedTimeZone] = useState<string>('Asia/Kolkata');
    const [logEntries, setLogEntries] = useState<string[]>([]);

    const fetchLogEntries = async () => {
        try {
            const response = await fetch('/api/logger');
            const data = await response.json();
            setLogEntries(data);
        } catch (error) {
            console.error('Error fetching log entries:', error);
        }
    };

    useEffect(() => {
        fetchLogEntries();
    }, []);


    const addTimer = async () => {
        const newTimer: Timer = {
            id: Date.now(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        await fetch('/api/logger', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'Added Countdown Timer'}),
        });

        setTimers(prevTimers => [...prevTimers, newTimer]);
    };

    const removeTimer = async (id: number) => {
        await fetch('/api/logger', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'Removed Countdown Timer'}),
        });
        setTimers(prevTimers => prevTimers.filter(timer => timer.id !== id));
    };

    return (
        <>
            <div className={styles.homeGrid}>
                <div className={styles.homeContainer}>
                    <div className={styles.label}>
                        <label>
                            <h2>World Clock:</h2>
                            <select
                                className={styles.select}
                                value={selectedTimeZone}
                                onChange={(e) => setSelectedTimeZone(e.target.value)}
                            >
                                <option value="America/Los_Angeles">PST (America/Los_Angeles)</option>
                                <option value="Asia/Kolkata">IST (Asia/Kolkata)</option>
                            </select>
                        </label>
                    </div>

                    <WorldClock selectedTimeZone={selectedTimeZone} />

                    <h1>Multiple Countdown Timers</h1>
                    <div className={styles.countdownTimersContainer}>
                        {timers.map(timer => (
                            <CountdownTimer
                                key={timer.id}
                                id={timer.id}
                                days={timer.days}
                                hours={timer.hours}
                                minutes={timer.minutes}
                                seconds={timer.seconds}
                                onDelete={() => removeTimer(timer.id)}
                            />
                        ))}
                    </div>
                    <button className={styles.addTimerButton} onClick={addTimer}>
                        Add Timer
                    </button>
                </div>
                <div className={styles.logContainer}>
                    <h2>
                        Log Entries:
                <button className={styles.refreshButton} onClick={fetchLogEntries}>Refresh</button>
                    </h2>
                    <ul>
                        {logEntries.map((entry, index) => (
                            <li key={index}>{entry}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Home;
