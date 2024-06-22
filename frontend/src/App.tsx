import React, { useState, useEffect, useCallback } from 'react';
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
  const [favorites, setFavorites] = useState<Quote[]>(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      return JSON.parse(savedFavorites);
    }
    return [];
  });

  useEffect(() => {
    console.log('Saving favorites to localStorage:', favorites);
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const addToFavorites = useCallback((quote: Quote) => {
    console.log('Adding to favorites:', quote);
    setFavorites(prevFavorites => {
      const newFavorites = [...prevFavorites, quote];
      console.log('New favorites after adding:', newFavorites);
      return newFavorites;
    });
  }, []);

  const removeFromFavorites = useCallback((id: string) => {
    console.log('Removing from favorites, id:', id);
    setFavorites(prevFavorites => {
      const newFavorites = prevFavorites.filter(fav => fav.id !== id);
      console.log('New favorites after removing:', newFavorites);
      return newFavorites;
    });
  }, []);

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