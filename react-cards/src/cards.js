import React, { useState, useEffect } from 'react';

const DECK_API_BASE_URL = 'https://deckofcardsapi.com/api/deck';

function DeckOfCardsApp() {
  const [deckId, setDeckId] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Create a new deck when the component mounts
    fetch(`${DECK_API_BASE_URL}/new/shuffle/`)
      .then((response) => response.json())
      .then((data) => setDeckId(data.deck_id))
      .catch((error) => console.error('Error creating new deck:', error));
  }, []);

  const drawCard = () => {
    if (!deckId) return;

    setLoading(true);

    fetch(`${DECK_API_BASE_URL}/${deckId}/draw/`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setCards((prevCards) => [...prevCards, data.cards[0]]);
        } else {
          alert('Error: no cards remaining!');
        }
      })
      .catch((error) => console.error('Error drawing card:', error))
      .finally(() => setLoading(false));
  };

  const shuffleDeck = () => {
    if (!deckId || loading) return;

    setLoading(true);

    fetch(`${DECK_API_BASE_URL}/${deckId}/shuffle/`)
      .then(() => setCards([]))
      .catch((error) => console.error('Error shuffling deck:', error))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <button onClick={drawCard} disabled={loading}>
        Draw Card
      </button>
      <button onClick={shuffleDeck} disabled={loading}>
        Shuffle Deck
      </button>

      <div>
        {cards.map((card) => (
          <img
            key={card.code}
            src={card.image}
            alt={`${card.value} of ${card.suit}`}
          />
        ))}
      </div>
    </div>
  );
}

export default DeckOfCardsApp;