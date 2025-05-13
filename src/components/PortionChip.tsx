import React from 'react';
import styles from './PortionChip.module.css';

interface PortionChipProps {
  text: string;
  onClick?: () => void; // Optional onClick handler
}

export const PortionChip: React.FC<PortionChipProps> = ({ text, onClick }) => {
  return (
    <div className={styles.portionChip} onClick={onClick}>
      {text}
    </div>
  );
};
