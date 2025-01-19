import React, { useEffect, useState } from 'react';
import PlayingCard from './PlayingCard';
import Papa from 'papaparse';

// Types
type Rank = 'Ace' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'Jack' | 'Queen' | 'King';
type Suit = 'Hearts' | 'Diamonds' | 'Clubs' | 'Spades';

interface CardData {
  suite: string;
  rank: string;
  object: string;
}

interface Card {
  rank: Rank;
  suit: Suit;
  object: string;
}

// Mappings
const RANK_MAP: { [key: string]: Rank } = {
  '1': 'Ace',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  'Jack': 'Jack',
  'Queen': 'Queen',
  'King': 'King'
};

const SUIT_MAP: { [key: string]: Suit } = {
  'Hearts': 'Hearts',
  'Diamonds': 'Diamonds',
  'Clubs': 'Clubs',
  'Spades': 'Spades'
};

const styles = {
  fileUpload: {
    margin: '1rem 0',
  },
  flashCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '1rem',
    marginTop: '2rem',
    maxWidth: '600px',
    margin: '2rem auto',
  },
  answerBox: {
    padding: '2rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
    textAlign: 'center' as const,
    backgroundColor: '#f5f5f5',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  scoreDisplay: {
    fontSize: '1.2rem',
    marginTop: '1rem',
  }
};

const App: React.FC = () => {
  const [currentCard, setCurrentCard] = useState<Card | null>(null);
  const [answers, setAnswers] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [cardData, setCardData] = useState<CardData[]>([]);

  useEffect(() => {
    // Load both the card library and the CSV data
    // Load card library script
    const script = document.createElement('script');
    script.src = `${process.env.PUBLIC_URL}/elements.cardmeister.min.js`;
    script.type = 'text/javascript';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script
      const script = document.querySelector('script[src*="cardmeister"]');
      if (script) document.body.removeChild(script);
    };
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse<CardData>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data) {
          setCardData(results.data);
          drawRandomCard(results.data);
        }
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  };
  const getRandomObjects = (correctObject: string, allData: CardData[], count: number): string[] => {
    const allObjects = allData.map(d => d.object).filter(obj => obj !== correctObject);
    const shuffled = [...allObjects].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  const drawRandomCard = (data: CardData[]) => {
    const randomCard = data[Math.floor(Math.random() * data.length)];

    const newCard = {
      rank: RANK_MAP[randomCard.rank],
      suit: SUIT_MAP[randomCard.suite],
      object: randomCard.object
    };

    setCurrentCard(newCard);
    console.log('Current card:', newCard);
    // Get 3 wrong answers
    const wrongAnswers = getRandomObjects(randomCard.object, data, 3);
    const allAnswers = [...wrongAnswers, randomCard.object];

    // Shuffle answers
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
    console.log(shuffledAnswers);
    setAnswers(shuffledAnswers);
  };

  const handleAnswerClick = (answer: string) => {
    if (currentCard && answer === currentCard.object) {
      setScore(prevScore => prevScore + 1);
    } else {
      setScore(0);
    }
    if (cardData.length > 0) {
      drawRandomCard(cardData);
    }
  };

  return (
    <div className="App">
      <h1>Flash Cards!</h1>
      <div style={styles.fileUpload}>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          aria-label="Upload CSV file"
        />
      </div>
      <div style={styles.scoreDisplay}>Score: {score}</div>
      {currentCard ? (
        <>
          <div id="card-container">
            <PlayingCard rank={currentCard.rank} suit={currentCard.suit} />
          </div>
          <div id="flash-cards" style={styles.flashCards}>
            {answers.map((answer) => (
              <div
                key={answer}
                style={styles.answerBox}
                onClick={() => handleAnswerClick(answer)}
              >
                {answer}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p>Upload a CSV file to start playing!</p>
      )}
    </div>
  );

};

export default App;
