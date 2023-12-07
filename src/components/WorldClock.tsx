import React, { useState, useEffect } from 'react';
import styles from '../styles/index.module.css';

interface WorldClockProps {
    selectedTimeZone: string;
}

const WorldClock: React.FC<WorldClockProps> = ({ selectedTimeZone }) => {
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

    return (
        <div className={styles.worldClockContainer}>
            <h3>({selectedTimeZone})</h3>
            <div>Current Time: {worldClock}</div>
        </div>
    );
};

export default WorldClock;
