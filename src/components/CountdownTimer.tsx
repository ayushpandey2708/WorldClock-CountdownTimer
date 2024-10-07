import React, { useState, useRef } from 'react';
import styles from '../styles/CountdownTimer.module.css';

console.log("diei");

interface CountdownTimerProps  {
    id: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    onDelete: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    id,
    days,
    hours,
    minutes,
    seconds,
    onDelete,
}) => {
    const [inputDays, setInputDays] = useState(days);
    const [inputHours, setInputHours] = useState(hours);
    const [inputMinutes, setInputMinutes] = useState(minutes);
    const [inputSeconds, setInputSeconds] = useState(seconds);
    const [timeLeft, setTimeLeft] = useState(days * 24 * 3600 + hours * 3600 + minutes * 60 + seconds);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const startTimer = () => {
        if (intervalRef.current === null) {
            setIsRunning(true);
           
            intervalRef.current = setInterval(() => {
                setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
            }, 1000);
        }
    };

    const stopTimer = () => {
        if (intervalRef.current !== null) {
            setIsRunning(false);
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    const resetTimer = () => {
        stopTimer();
        setTimeLeft(inputDays * 24 * 3600 + inputHours * 3600 + inputMinutes * 60 + inputSeconds);
    };

    const handleInputChange = (value: number, unit: string) => {
        stopTimer(); 

        const newValue = Math.max(value, 0);

        switch (unit) {
            case 'days':
                setInputDays(newValue);
                setTimeLeft(newValue * 24 * 3600 + inputHours * 3600 + inputMinutes * 60 + inputSeconds);
                break;
            case 'hours':
                setInputHours(newValue);
                setTimeLeft(inputDays * 24 * 3600 + newValue * 3600 + inputMinutes * 60 + inputSeconds);
                break;
            case 'minutes':
                setInputMinutes(newValue);
                setTimeLeft(inputDays * 24 * 3600 + inputHours * 3600 + newValue * 60 + inputSeconds);
                break;
            case 'seconds':
                setInputSeconds(newValue);
                setTimeLeft(inputDays * 24 * 3600 + inputHours * 3600 + inputMinutes * 60 + newValue);
                break;
        }
    };

   

    const formatTime = (time: number) => {
        const daysLeft = Math.floor(time / (24 * 3600));
        const hoursLeft = Math.floor((time % (24 * 3600)) / 3600);
        const minutesLeft = Math.floor((time % 3600) / 60);
        const secondsLeft = time % 60;

        return `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
    };

    return (
        <div className={styles.countdownTimerContainer}>
            <div className={styles.timerHeader}>
            
                <h2 style={{ marginLeft: '108px' }}>Countdown Timer</h2>
            <button className="delete-button" onClick={onDelete}>
                    X
      </button>
                </div>
            <div className={styles.timerInputs}>
                <label>
                    Days:
          <input
                        type="number"
                        value={inputDays}
                        onChange={e => handleInputChange(parseInt(e.target.value), 'days')}
                    />
                </label>
                <label>
                    Hours:
          <input
                        type="number"
                        value={inputHours}
                        onChange={e => handleInputChange(parseInt(e.target.value), 'hours')}
                    />
                </label>
                <label>
                    Minutes:
          <input
                        type="number"
                        value={inputMinutes}
                        onChange={e => handleInputChange(parseInt(e.target.value), 'minutes')}
                    />
                </label>
                <label>
                    Seconds:
          <input
                        type="number"
                        value={inputSeconds}
                        onChange={e => handleInputChange(parseInt(e.target.value), 'seconds')}
                    />
                </label>
            </div>
            <div className={styles.timerControls}>
                <button onClick={startTimer} disabled={isRunning}>
                    Start
        </button>
                <button onClick={stopTimer} disabled={!isRunning}>
                    Stop
        </button>
                <button onClick={resetTimer}>Reset</button>
            </div>
            <div className={styles.timeLeft}>Time Left: {formatTime(timeLeft)}</div>
        </div>
    );
};

export default CountdownTimer;
