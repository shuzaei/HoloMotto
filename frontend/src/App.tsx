import React, { useState, useEffect } from 'react';
import QuoteGenerator from './components/QuoteGenerator';
import VTuberList from './components/VTuberList';
import FavoriteQuotes from './components/FavoriteQuotes';

interface Quote {
  id: string;
  vtuber: string;
  quote: string;
  imageUrl: string;
}

function App() {
  const [favorites, setFavorites] = useState<Quote[]>([]);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = (quote: Quote) => {
    setFavorites(prevFavorites => [...prevFavorites, quote]);
  };

  const removeFromFavorites = (id: string) => {
    setFavorites(prevFavorites => prevFavorites.filter(fav => fav.id !== id));
  };

  return (
    <div className="min-h-screen hololive-bg py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-white">HoloMotto</h1>
        <QuoteGenerator 
          favorites={favorites}
          addToFavorites={addToFavorites}
          removeFromFavorites={removeFromFavorites}
        />
        <VTuberList />
        <FavoriteQuotes favorites={favorites} onRemove={removeFromFavorites} />
      </div>
    </div>
  );
}

export default App;