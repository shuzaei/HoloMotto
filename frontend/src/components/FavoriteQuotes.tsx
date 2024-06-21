import React from 'react';

interface Quote {
  id: string;
  vtuber: string;
  quote: string;
}

interface FavoriteQuotesProps {
  favorites: Quote[];
  onRemove: (id: string) => void;
}

const FavoriteQuotes: React.FC<FavoriteQuotesProps> = ({ favorites, onRemove }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4 text-holo-purple">Favorite Quotes</h2>
      {favorites.length === 0 ? (
        <p className="text-gray-600">No favorite quotes yet.</p>
      ) : (
        <ul className="space-y-4">
          {favorites.map((fav) => (
            <li key={fav.id} className="border-b pb-2">
              <p className="text-lg italic mb-1">"{fav.quote}"</p>
              <p className="text-right text-holo-blue font-semibold">- {fav.vtuber}</p>
              <button
                onClick={() => onRemove(fav.id)}
                className="mt-1 text-sm text-holo-pink hover:text-holo-purple"
              >
                Remove from Favorites
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FavoriteQuotes;