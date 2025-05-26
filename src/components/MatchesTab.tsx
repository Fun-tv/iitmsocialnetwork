
import React, { useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useSocial } from '@/hooks/useSocial';
import { useToast } from '@/hooks/use-toast';

interface MatchesTabProps {
  onStartChat?: (matchId: string) => void;
}

const MatchesTab = ({ onStartChat }: MatchesTabProps) => {
  const { matches, fetchMatches, loading } = useSocial();
  const { toast } = useToast();

  useEffect(() => {
    fetchMatches();
  }, []);

  const handleStartChat = (matchId: string) => {
    if (onStartChat) {
      onStartChat(matchId);
    } else {
      toast({
        title: 'Chat Feature',
        description: 'Navigate to Messages tab to start chatting!',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-full">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your matches...</p>
        </div>
      </div>
    );
  }

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
                  src={match.profile.profile_picture_url || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face`} 
                  alt={match.profile.full_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-white">{match.profile.full_name}</h3>
                <p className="text-sm text-gray-400 mb-1">{match.profile.department}</p>
                <p className="text-sm text-gray-300">
                  Matched on {new Date(match.created_at).toLocaleDateString()}
                </p>
              </div>
              
              <button 
                onClick={() => handleStartChat(match.id)}
                className="p-2 text-red-500 hover:bg-red-500/20 rounded-full transition-colors"
              >
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
