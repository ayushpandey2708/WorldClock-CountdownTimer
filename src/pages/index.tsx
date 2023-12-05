import { useState, useEffect } from 'react';
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
        const fetchWorldClock = async () => {
            try {
                
                const apiKey = process.env.NEXT_PUBLIC_TIMEZONE_API_KEY;
                const response = await fetch(`https://timezone.abstractapi.com/v1/current_time/?api_key=${apiKey}&location=${selectedTimeZone}`);
                const data = await response.json();
                setWorldClock(data.datetime);
            } catch (error) {
                console.error('Error fetching world clock:', error);
            }
        };

        fetchWorldClock();

        const secondsInterval = setInterval(() => {
            setWorldClock(prevTime => {
                const currentTime = new Date(prevTime || new Date());
                currentTime.setSeconds(currentTime.getSeconds() + 1);

                const formattedUpdatedTime = `${currentTime.getFullYear()}-${(currentTime.getMonth() + 1)
                    .toString()
                    .padStart(2, '0')}-${currentTime.getDate().toString().padStart(2, '0')} ${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}:${currentTime.getSeconds().toString().padStart(2, '0')}`;

                return formattedUpdatedTime;
            });
        }, 1000);

        return () => {
            clearInterval(secondsInterval);
        };
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
