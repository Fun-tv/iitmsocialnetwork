
import React, { useEffect } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useSocial } from '@/hooks/useSocial';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface MatchesTabProps {
  onStartChat?: (matchId: string) => void;
}

const MatchesTab = ({ onStartChat }: MatchesTabProps) => {
  const { user } = useAuth();
  const { matches, fetchMatches, loading } = useSocial();
  const { toast } = useToast();

  useEffect(() => {
    console.log('MatchesTab mounted, fetching matches...');
    fetchMatches();
  }, []);

  const handleStartChat = async (match: any) => {
    if (!user) return;

    try {
      console.log('Starting chat with match:', match);
      
      // Check if conversation already exists
      const { data: existingConv, error: convError } = await supabase
        .from('conversations')
        .select('id')
        .or(`and(user1_id.eq.${user.id},user2_id.eq.${match.profile.id}),and(user1_id.eq.${match.profile.id},user2_id.eq.${user.id})`)
        .maybeSingle();

      if (convError) {
        console.error('Error checking existing conversation:', convError);
      }

      let conversationId = existingConv?.id;

      if (!existingConv) {
        // Create conversation if it doesn't exist
        const { data: newConv, error: createError } = await supabase
          .from('conversations')
          .insert({
            user1_id: user.id < match.profile.id ? user.id : match.profile.id,
            user2_id: user.id < match.profile.id ? match.profile.id : user.id
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating conversation:', createError);
          toast({
            title: 'Error',
            description: 'Failed to start conversation',
            variant: 'destructive',
          });
          return;
        }

        conversationId = newConv.id;
        console.log('Created new conversation:', newConv);
      }

      if (onStartChat) {
        onStartChat(conversationId);
      } else {
        toast({
          title: 'Chat Ready!',
          description: 'Navigate to Messages tab to start chatting!',
        });
      }
    } catch (error) {
      console.error('Error in handleStartChat:', error);
      toast({
        title: 'Error',
        description: 'Failed to start conversation',
        variant: 'destructive',
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
          <p className="text-gray-400 mb-4">Start swiping to find your connections!</p>
          <p className="text-gray-500 text-sm">
            Like someone and when they like you back, you'll have a match and can start chatting!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {matches.map((match) => (
            <div 
              key={match.id}
              className="bg-gray-800 rounded-2xl p-4 flex items-center space-x-4 hover:bg-gray-700 transition-colors"
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
                {match.profile.bio && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{match.profile.bio}</p>
                )}
              </div>
              
              <button 
                onClick={() => handleStartChat(match)}
                className="p-3 text-red-500 hover:bg-red-500/20 rounded-full transition-colors"
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
