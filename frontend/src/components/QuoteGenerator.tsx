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
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);


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
      console.log('Processed quote:', newQuote);
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
      console.log('Updated favorites:', favorites);
    }
  }, [quote, favorites, addToFavorites, removeFromFavorites]);

  const handleNewQuote = async () => {
    setIsLoading(true);
    await fetchQuote();
    setIsLoading(false);
  };

  const handleFavoriteToggle = () => {
    if (quote) {
      const isFavorite = favorites.some(fav => fav.id === quote.id);
      if (isFavorite) {
        removeFromFavorites(quote.id);
      } else {
        addToFavorites(quote);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    }
  };

  return (
    <motion.div 
      className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-xl shadow-lg p-8 mb-6 relative overflow-hidden"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-white text-center">HoloMotto Generator</h2>
      <motion.select
        className="w-full p-3 mb-6 rounded-full text-gray-700 bg-white bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-white"
        value={selectedVTuber}
        onChange={(e) => setSelectedVTuber(e.target.value)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <option value="">Random VTuber</option>
        {vtubers.map((vtuber) => (
          <option key={vtuber.id} value={vtuber.id}>{vtuber.name}</option>
        ))}
      </motion.select>
      
      <AnimatePresence mode="wait">
        {quote ? (
          <motion.div
            key={quote.id}
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-white bg-opacity-90 rounded-xl p-6 mb-6 flex items-center"
          >
            {quote.imageUrl && (
              <motion.img 
                src={`http://localhost:3001${quote.imageUrl}`} 
                alt={quote.vtuber} 
                className="w-24 h-24 rounded-full mr-4 object-cover border-4 border-white shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9, rotate: -5 }}
              />
            )}
            <div>
              <motion.p 
                className="text-xl italic mb-2 text-gray-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >"{quote.quote}"</motion.p>
              <motion.p 
                className="text-right text-gray-600 font-bold"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >- {quote.vtuber}</motion.p>
            </div>
          </motion.div>
        ) : (
          <p className="text-white text-lg text-center">Generate a quote!</p>
        )}
      </AnimatePresence>
      
      <div className="flex justify-center space-x-4">
        <motion.button
          whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px rgb(255,255,255,0.5)" }}
          whileTap={{ scale: 0.9 }}
          className={`bg-white text-purple-600 font-bold py-3 px-6 rounded-full transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleNewQuote}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'New Quote'}
        </motion.button>
        {quote && (
          <motion.button
            whileHover={{ scale: 1.1, boxShadow: "0px 0px 8px rgb(255,255,255,0.5)" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleFavoriteToggle}
            className="bg-white text-pink-500 font-bold py-3 px-6 rounded-full transition duration-300"
          >
            {favorites.some(fav => fav.id === quote.id) ? '❤️ Favorited' : '🤍 Add to Favorites'}
          </motion.button>
        )}
      </div>

      {showConfetti && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* ここに紙吹雪のアニメーションを追加 */}
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              initial={{ 
                top: "0%", 
                left: `${Math.random() * 100}%`,
                scale: 0
              }}
              animate={{ 
                top: "100%", 
                scale: 1,
                transition: { 
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  repeatType: "loop"
                }
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default QuoteGenerator;