import React, { useEffect, useState, useRef } from 'react';
import './Timer.css';

interface TimerProps {
  duration: number; // durée en secondes
  onTimeUp: () => void;
  isPaused?: boolean; // nouvelle prop pour gérer la pause
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp, isPaused = false }) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalRef.current!);
      onTimeUp();
      return;
    }

    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current!);
  }, [timeLeft, isPaused, onTimeUp]);

  const percentage = (timeLeft / duration) * 100;

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <div className="timer-text">
        ⏱ Temps restant : <strong>{formatTime(timeLeft)}</strong> {isPaused && <span style={{ color: 'var(--highlight-yellow)' }}>⏸️ Pause</span>}
      </div>
      <div className="timer-bar-container">
        <div
          className="timer-bar-fill"
          style={{ width: `${percentage}%`, backgroundColor: isPaused ? '#9a8c98' : '#ffd400' }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
