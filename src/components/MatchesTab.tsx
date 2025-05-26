
import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const MatchesTab = () => {
  const matches = [
    {
      id: '1',
      name: 'Anjali Reddy',
      department: 'Computer Science',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Hey! How are you?',
      isOnline: true
    },
    {
      id: '2',
      name: 'Rohit Singh',
      department: 'Electrical Engineering',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      lastMessage: 'Nice to meet you!',
      isOnline: false
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-6">Your Matches</h2>
      
      {matches.length === 0 ? (
        <div className="text-center py-12">
          <Heart size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No matches yet</h3>
          <p className="text-gray-400">Start swiping to find your connections!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <div 
              key={match.id}
              className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-4 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <div className="relative">
                <img 
                  src={match.image} 
                  alt={match.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                {match.isOnline && (
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                )}
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-white">{match.name}</h3>
                <p className="text-sm text-gray-400 mb-1">{match.department}</p>
                <p className="text-sm text-gray-300">{match.lastMessage}</p>
              </div>
              
              <button className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors">
                <MessageCircle size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesTab;
