import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface VTuber {
  id: string;
  name: string;
  agency: string;
  debutDate: string;
  channelUrl: string;
  quotes: string[];
}

const VTuberList: React.FC = () => {
  const [vtubers, setVtubers] = useState<VTuber[]>([]);
  const [selectedVTuber, setSelectedVTuber] = useState<VTuber | null>(null);

  useEffect(() => {
    const fetchVTubers = async () => {
      try {
        const response = await axios.get<VTuber[]>('http://localhost:3001/api/vtubers');
        setVtubers(response.data);
      } catch (error) {
        console.error('Error fetching VTubers:', error);
      }
    };

    fetchVTubers();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-holo-purple">VTuber List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {vtubers.map((vtuber) => (
            <div
              key={vtuber.id}
              className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded"
              onClick={() => setSelectedVTuber(vtuber)}
            >
              <span className="w-2 h-2 bg-holo-pink rounded-full mr-2"></span>
              <span className="text-gray-800">{vtuber.name}</span>
            </div>
          ))}
        </div>
        <div>
          {selectedVTuber && (
            <div className="bg-gray-100 p-4 rounded">
              <h3 className="text-xl font-semibold mb-2">{selectedVTuber.name}</h3>
              <p><strong>Agency:</strong> {selectedVTuber.agency}</p>
              <p><strong>Debut Date:</strong> {selectedVTuber.debutDate}</p>
              <p><strong>Channel:</strong> <a href={selectedVTuber.channelUrl} target="_blank" rel="noopener noreferrer" className="text-holo-blue hover:underline">YouTube</a></p>
              <h4 className="font-semibold mt-4 mb-2">Famous Quotes:</h4>
              <ul className="list-disc list-inside">
                {selectedVTuber.quotes.map((quote, index) => (
                  <li key={index}>{quote}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VTuberList;