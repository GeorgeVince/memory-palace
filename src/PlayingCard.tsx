import React, { useEffect, useRef } from 'react';
import { PlayingCardProps } from './types';

const cardStyles = {
  container: {
    display: 'inline-block',
    width: '150px',
    height: '200px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '16px',
  },
  red: {
    color: 'red',
  },
  black: {
    color: 'black',
  }
};
const PlayingCard: React.FC<PlayingCardProps> = ({ rank, suit }) => {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    return () => {
    };
  }, []);

  // Use createElement instead of JSX for custom elements
  return React.createElement('playing-card', {
    ref: cardRef,
    rank: rank,
    suit: suit,

    style: {
      ...cardStyles.container,
    }
  });
};

export default PlayingCard;
