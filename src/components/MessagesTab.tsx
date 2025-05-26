
import React from 'react';
import { MessageCircle, Search } from 'lucide-react';

const MessagesTab = () => {
  const conversations = [
    {
      id: '1',
      name: 'Anjali Reddy',
      lastMessage: 'See you at the lab tomorrow!',
      timestamp: '2m ago',
      unread: 2,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: '2',
      name: 'Rohit Singh',
      lastMessage: 'Thanks for the study notes 📚',
      timestamp: '1h ago',
      unread: 0,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Messages</h2>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Search size={20} />
        </button>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-12">
          <MessageCircle size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
          <p className="text-gray-400">Start a conversation with your matches!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => (
            <div 
              key={conversation.id}
              className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-4 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <img 
                src={conversation.image} 
                alt={conversation.name}
                className="w-14 h-14 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white">{conversation.name}</h3>
                  <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                </div>
                <p className="text-sm text-gray-300 truncate">{conversation.lastMessage}</p>
              </div>
              
              {conversation.unread > 0 && (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{conversation.unread}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessagesTab;
