
import React, { useEffect, useState } from 'react';
import { MessageCircle, Search, ArrowLeft, Send } from 'lucide-react';
import { useSocial } from '@/hooks/useSocial';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const MessagesTab = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    messages, 
    fetchConversations, 
    fetchMessages, 
    sendMessage,
    loading 
  } = useSocial();
  
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversation(conversationId);
    fetchMessages(conversationId);
  };

  const handleSendMessage = async () => {
    if (!selectedConversation || !newMessage.trim() || sendingMessage) return;

    setSendingMessage(true);
    try {
      const success = await sendMessage(selectedConversation, newMessage);
      if (success) {
        setNewMessage('');
        // Refresh messages and conversations
        fetchMessages(selectedConversation);
        fetchConversations();
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading conversations...</p>
        </div>
      </div>
    );
  }

  // Chat interface when a conversation is selected
  if (selectedConversation) {
    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation) return null;

    return (
      <div className="flex flex-col h-full">
        {/* Chat Header */}
        <div className="p-4 border-b border-gray-700 flex items-center space-x-3">
          <button
            onClick={() => setSelectedConversation(null)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <img 
            src={conversation.profile.profile_picture_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
            alt={conversation.profile.full_name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-white">{conversation.profile.full_name}</h3>
            <p className="text-xs text-gray-400">{conversation.profile.department}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  message.sender_id === user?.id
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                    : 'bg-gray-700 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${
                  message.sender_id === user?.id ? 'text-red-100' : 'text-gray-400'
                }`}>
                  {new Date(message.created_at).toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="bg-gray-700 border-gray-600 text-white flex-1"
              disabled={sendingMessage}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || sendingMessage}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Conversations list
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
              onClick={() => handleSelectConversation(conversation.id)}
              className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-4 hover:bg-gray-700 transition-colors cursor-pointer"
            >
              <img 
                src={conversation.profile.profile_picture_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`}
                alt={conversation.profile.full_name}
                className="w-14 h-14 rounded-full object-cover"
              />
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white">{conversation.profile.full_name}</h3>
                  <span className="text-xs text-gray-400">
                    {conversation.last_message 
                      ? new Date(conversation.last_message.created_at).toLocaleDateString()
                      : new Date(conversation.created_at).toLocaleDateString()
                    }
                  </span>
                </div>
                <p className="text-sm text-gray-300 truncate">
                  {conversation.last_message?.content || 'Start a conversation!'}
                </p>
              </div>
              
              {conversation.unread_count > 0 && (
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">
                    {conversation.unread_count > 9 ? '9+' : conversation.unread_count}
                  </span>
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
