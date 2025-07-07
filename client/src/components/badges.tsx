import React from 'react';
import './badges.css';
import { FaMedal, FaTrophy, FaStar, FaCrown, FaDumbbell } from 'react-icons/fa';

interface BadgeProps {
  scorePercentage: number;
}

const Badge: React.FC<BadgeProps> = ({ scorePercentage }) => {
  let badgeClass = '';
  let badgeText = '';
  let badgeIcon = <></>;

  // Préparation des sons (à importer plus tard)
  // import beginnerSound from '../assets/sounds/beginner.mp3';
  // import progressSound from '../assets/sounds/progress.mp3';
  // import solidSound from '../assets/sounds/solid.mp3';
  // import championSound from '../assets/sounds/champion.mp3';

  // const playSound = (soundPath: string) => {
  //   const audio = new Audio(soundPath);
  //   audio.play();
  // };

  if (scorePercentage < 25) {
    badgeClass = 'badge-low';
    badgeText = 'Débutant';
    badgeIcon = <FaMedal className="badge-icon" />;
    // playSound(beginnerSound);
  } else if (scorePercentage < 50) {
    badgeClass = 'badge-medium';
    badgeText = 'En progrès';
    badgeIcon = <FaTrophy className="badge-icon" />;
    // playSound(progressSound);
  } else if (scorePercentage < 75) {
    badgeClass = 'badge-good';
    badgeText = 'Solide';
    badgeIcon = <FaStar className="badge-icon" />;
    // playSound(solidSound);
  } else if (scorePercentage < 90) {
    badgeClass = 'badge-excellent';
    badgeText = 'Champion';
    badgeIcon = <FaCrown className="badge-icon" />;
    // playSound(championSound);
  } else {
    badgeClass = 'badge-powerlifting';
    badgeText = 'Powerlifting';
    badgeIcon = <FaDumbbell className="badge-icon" />;
    // playSound(championSound);
  }

  return (
    <span className={`badge ${badgeClass}`}>
      {badgeIcon}
      {badgeText}
    </span>
  );
};

export default Badge;
