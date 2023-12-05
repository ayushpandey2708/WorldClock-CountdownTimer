import { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import CountdownTimer from '../components/CountdownTimer';
import styles from '../styles/index.module.css';

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
    const [worldClock, setWorldClock] = useState<string>('');

    useEffect(() => {
        const worldClockInterval = setInterval(() => {
            const worldClockTime = DateTime.local().setZone(selectedTimeZone);
            setWorldClock(worldClockTime.toFormat('yyyy-MM-dd HH:mm:ss'));
        }, 1000);

        return () => clearInterval(worldClockInterval);
    }, [selectedTimeZone]);

    const addTimer = () => {
        const newTimer: Timer = {
            id: Date.now(),
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
        };

        setTimers(prevTimers => [...prevTimers, newTimer]);
    };

    const removeTimer = (id: number) => {
        setTimers(prevTimers => prevTimers.filter(timer => timer.id !== id));
    };

return (
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

        {selectedTimeZone && (
            <div className={styles.worldClockContainer}>
                <h3>({selectedTimeZone})</h3>
                <div>Current Time: {worldClock}</div>
            </div>
        )}

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
);
};

export default Home;
