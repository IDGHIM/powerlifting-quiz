import React, { useEffect, useState } from 'react';
import './Timer.css';

interface TimerProps {
  duration: number; // durée en secondes
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ duration, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const percentage = (timeLeft / duration) * 100;

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-container">
      <div className="timer-text">
        ⏱ Temps restant : <strong>{formatTime(timeLeft)}</strong>
      </div>
      <div className="timer-bar-container">
        <div
          className="timer-bar-fill"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Timer;
