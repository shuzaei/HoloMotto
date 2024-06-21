import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface Quote {
  id: string;
  vtuber: string;
  quote: string;
  imageUrl: string;
}

interface VTuber {
  id: string;
  name: string;
}

interface QuoteGeneratorProps {
  favorites: Quote[];
  addToFavorites: (quote: Quote) => void;
  removeFromFavorites: (id: string) => void;
}

const QuoteGenerator: React.FC<QuoteGeneratorProps> = ({ favorites, addToFavorites, removeFromFavorites }) => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [vtubers, setVtubers] = useState<VTuber[]>([]);
  const [selectedVTuber, setSelectedVTuber] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchVTubers();
  }, []);

  const fetchVTubers = async () => {
    try {
      const response = await axios.get<VTuber[]>('http://localhost:3001/api/vtubers');
      setVtubers(response.data);
    } catch (error) {
      console.error('Error fetching VTubers:', error);
      setError('Failed to fetch VTubers. Please try again.');
    }
  };

  const fetchQuote = useCallback(async () => {
    setError(null);
    try {
      let url = 'http://localhost:3001/api/quote';
      if (selectedVTuber) {
        url += `/${selectedVTuber}`;
      }
      console.log('Fetching quote from:', url);
      const response = await axios.get<Quote>(url);
      console.log('API response:', response.data);
      const newQuote = { 
        ...response.data, 
        id: `${response.data.vtuber}-${response.data.quote}`.replace(/\s+/g, '-').toLowerCase()
      };
      setQuote(null);
      setTimeout(() => {
        setQuote(newQuote);
        console.log('Quote set:', newQuote);
      }, 300);
    } catch (error) {
      console.error('Error fetching quote:', error);
      setError('Failed to fetch quote. Please try again.');
    }
  }, [selectedVTuber]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  const toggleFavorite = useCallback(() => {
    if (quote) {
      console.log('Toggling favorite for quote:', quote);
      const isFavorite = favorites.some(fav => fav.id === quote.id);
      if (isFavorite) {
        removeFromFavorites(quote.id);
      } else {
        addToFavorites(quote);
      }
    }
  }, [quote, favorites, addToFavorites, removeFromFavorites]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-4 border-holo-pink">
      <h2 className="text-2xl font-bold mb-4 text-holo-purple font-hololive">Quote Generator</h2>
      <select
        className="w-full p-2 mb-4 border rounded"
        value={selectedVTuber}
        onChange={(e) => setSelectedVTuber(e.target.value)}
      >
        <option value="">Random VTuber</option>
        {vtubers.map((vtuber) => (
          <option key={vtuber.id} value={vtuber.id}>
            {vtuber.name}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <AnimatePresence mode="wait">
        {quote ? (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-4 flex items-center"
          >
            <img 
              src={quote.imageUrl} 
              alt={quote.vtuber} 
              className="w-16 h-16 rounded-full mr-4 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = '/images/default-avatar.png';
              }}
            />
            <div>
              <p className="text-lg italic mb-2">"{quote.quote}"</p>
              <p className="text-right text-holo-blue font-semibold">- {quote.vtuber}</p>
            </div>
          </motion.div>
        ) : (
          <p className="text-gray-600">Loading quote...</p>
        )}
      </AnimatePresence>
      <button
        className="bg-holo-orange hover:bg-holo-pink text-white font-bold py-2 px-4 rounded transition duration-300 font-hololive mr-2"
        onClick={fetchQuote}
      >
        New Quote
      </button>
      {quote && (
        <button
          onClick={toggleFavorite}
          className="bg-holo-pink hover:bg-holo-purple text-white font-bold py-2 px-4 rounded transition duration-300 font-hololive"
        >
          {favorites.some(fav => fav.id === quote.id) ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      )}
    </div>
  );
};

export default QuoteGenerator;