import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  age: number;
  department: string;
  academic_year: string;
  bio: string;
  interests: string[];
  profile_picture_url?: string;
  gender?: string;
  verification_status?: string;
}

interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  profile: UserProfile;
}

interface Conversation {
  id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
  updated_at: string;
  profile: UserProfile;
  last_message?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unread_count: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

export const useSocial = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [discoveryProfiles, setDiscoveryProfiles] = useState<UserProfile[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Enhanced discovery algorithm - fetch ALL complete profiles
  const fetchDiscoveryProfiles = async () => {
    if (!user) {
      console.log('No user found, skipping profile fetch');
      return;
    }

    try {
      setLoading(true);
      console.log('Fetching discovery profiles for user:', user.id);
      
      // First, get profiles that user hasn't interacted with yet
      const { data: likedProfiles } = await supabase
        .from('user_likes')
        .select('liked_id')
        .eq('liker_id', user.id);

      const likedIds = likedProfiles?.map(like => like.liked_id) || [];
      console.log('Already interacted with profiles:', likedIds);
      
      // Get ALL complete profiles except current user
      const { data: allProfiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('is_profile_complete', true)
        .neq('id', user.id);

      if (profilesError) {
        console.error('Error fetching all profiles:', profilesError);
        toast({
          title: 'Connection Error',
          description: 'Failed to load profiles. Please check your connection.',
          variant: 'destructive',
        });
        return;
      }

      console.log('All complete profiles found:', allProfiles?.length || 0);
      console.log('Profile details:', allProfiles?.map(p => ({ 
        id: p.id, 
        name: p.full_name, 
        complete: p.is_profile_complete,
        verification: p.verification_status 
      })));
      
      if (!allProfiles || allProfiles.length === 0) {
        setDiscoveryProfiles([]);
        console.log('No complete profiles found in database');
        
        toast({
          title: 'No Profiles Available',
          description: 'Be the first to complete your profile and start connecting!',
        });
        return;
      }

      // Filter out already liked profiles for better experience
      const availableProfiles = allProfiles.filter(profile => 
        !likedIds.includes(profile.id)
      );

      console.log('Available profiles after filtering liked:', availableProfiles.length);

      // If no new profiles available, show all profiles anyway
      const profilesToShow = availableProfiles.length > 0 ? availableProfiles : allProfiles;

      // Enhanced shuffle algorithm for better variety
      const shuffledProfiles = profilesToShow
        .map(profile => ({ profile, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ profile }) => profile);
      
      setDiscoveryProfiles(shuffledProfiles);
      console.log('Set discovery profiles count:', shuffledProfiles.length);
      
      toast({
        title: 'Profiles Loaded!',
        description: `Found ${shuffledProfiles.length} people to connect with!`,
      });

    } catch (error) {
      console.error('Error in fetchDiscoveryProfiles:', error);
      toast({
        title: 'Network Error',
        description: 'Unable to connect to server. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced like functionality with real-time updates
  const likeProfile = async (profileId: string) => {
    if (!user) {
      console.log('No user found for liking');
      return false;
    }

    try {
      console.log('Liking profile:', profileId);
      
      // Check if already liked to prevent duplicates
      const { data: existingLike } = await supabase
        .from('user_likes')
        .select('id')
        .eq('liker_id', user.id)
        .eq('liked_id', profileId)
        .single();

      if (existingLike) {
        console.log('Profile already liked');
        return true;
      }

      const { data, error } = await supabase
        .from('user_likes')
        .insert({
          liker_id: user.id,
          liked_id: profileId
        })
        .select();

      if (error) {
        console.error('Error liking profile:', error);
        toast({
          title: 'Error',
          description: 'Failed to like profile. Please try again.',
          variant: 'destructive',
        });
        return false;
      }

      console.log('Successfully liked profile:', data);

      // Check if it's a mutual match
      const { data: mutualLike } = await supabase
        .from('user_likes')
        .select('*')
        .eq('liker_id', profileId)
        .eq('liked_id', user.id)
        .single();

      if (mutualLike) {
        toast({
          title: '🎉 It\'s a Match!',
          description: 'You can now start chatting!',
        });
        // Refresh matches after a brief delay
        setTimeout(() => {
          fetchMatches();
        }, 1000);
      } else {
        toast({
          title: '❤️ Profile Liked',
          description: 'Waiting for them to like you back!',
        });
      }

      // Remove liked profile from discovery immediately
      setDiscoveryProfiles(prev => prev.filter(p => p.id !== profileId));
      
      return true;
    } catch (error) {
      console.error('Error in likeProfile:', error);
      toast({
        title: 'Network Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Super-like functionality
  const superLikeProfile = async (profileId: string) => {
    if (!user) return false;

    try {
      console.log('Super-liking profile:', profileId);
      
      const { data, error } = await supabase
        .from('user_likes')
        .insert({
          liker_id: user.id,
          liked_id: profileId,
          is_super_like: true
        })
        .select();

      if (error) {
        console.error('Error super-liking profile:', error);
        return false;
      }

      toast({
        title: '⭐ Super Like Sent!',
        description: 'They\'ll know you really like them!',
      });

      setDiscoveryProfiles(prev => prev.filter(p => p.id !== profileId));
      return true;
    } catch (error) {
      console.error('Error in superLikeProfile:', error);
      return false;
    }
  };

  // Skip a profile
  const skipProfile = (profileId: string) => {
    console.log('Skipping profile:', profileId);
    setDiscoveryProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  // Fetch matches with improved error handling
  const fetchMatches = async () => {
    if (!user) return;

    try {
      console.log('Fetching matches for user:', user.id);
      
      const { data: matchData, error } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching matches:', error);
        return;
      }

      console.log('Found matches:', matchData?.length || 0);

      if (!matchData || matchData.length === 0) {
        setMatches([]);
        return;
      }

      // Get the other user IDs from matches
      const otherUserIds = matchData.map(match => 
        match.user1_id === user.id ? match.user2_id : match.user1_id
      );

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', otherUserIds);

      if (profilesError) {
        console.error('Error fetching match profiles:', profilesError);
        return;
      }

      // Combine match data with profiles
      const formattedMatches = matchData.map(match => {
        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        const profile = profiles?.find(p => p.id === otherUserId);
        
        return {
          ...match,
          profile: profile || {
            id: otherUserId,
            full_name: 'Unknown User',
            age: 0,
            department: 'Unknown',
            academic_year: 'Unknown',
            bio: '',
            interests: []
          }
        };
      });

      console.log('Formatted matches:', formattedMatches);
      setMatches(formattedMatches);
    } catch (error) {
      console.error('Error in fetchMatches:', error);
    }
  };

  // Fetch conversations with improved query
  const fetchConversations = async () => {
    if (!user) return;

    try {
      console.log('Fetching conversations for user:', user.id);
      
      const { data: convData, error } = await supabase
        .from('conversations')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      console.log('Found conversations:', convData?.length || 0);

      if (!convData || convData.length === 0) {
        setConversations([]);
        return;
      }

      // Get the other user IDs from conversations
      const otherUserIds = convData.map(conv => 
        conv.user1_id === user.id ? conv.user2_id : conv.user1_id
      );

      // Fetch profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', otherUserIds);

      if (profilesError) {
        console.error('Error fetching conversation profiles:', profilesError);
        return;
      }

      const formattedConversations = await Promise.all(
        convData.map(async conv => {
          const otherUserId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
          const profile = profiles?.find(p => p.id === otherUserId) || {
            id: otherUserId,
            full_name: 'Unknown User',
            age: 0,
            department: 'Unknown',
            academic_year: 'Unknown',
            bio: '',
            interests: []
          };
          
          // Get last message for this conversation
          const { data: lastMessageData } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conv.id)
            .order('created_at', { ascending: false })
            .limit(1);

          const lastMessage = lastMessageData?.[0] || null;

          // Count unread messages
          const { count: unreadCount } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', conv.id)
            .eq('is_read', false)
            .neq('sender_id', user.id);

          return {
            ...conv,
            profile,
            last_message: lastMessage,
            unread_count: unreadCount || 0
          };
        })
      );

      setConversations(formattedConversations);
    } catch (error) {
      console.error('Error in fetchConversations:', error);
    }
  };

  // Fetch messages for a conversation
  const fetchMessages = async (conversationId: string) => {
    if (!user) return;

    try {
      console.log('Fetching messages for conversation:', conversationId);
      
      const { data: messageData, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      console.log('Found messages:', messageData?.length || 0);
      setMessages(messageData || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .neq('sender_id', user.id);

    } catch (error) {
      console.error('Error in fetchMessages:', error);
    }
  };

  // Send a message
  const sendMessage = async (conversationId: string, content: string) => {
    if (!user || !content.trim()) return false;

    try {
      console.log('Sending message to conversation:', conversationId);
      
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          content: content.trim()
        });

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: 'Error',
          description: 'Failed to send message',
          variant: 'destructive',
        });
        return false;
      }

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      console.log('Message sent successfully');
      return true;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      return false;
    }
  };

  // Enhanced real-time subscriptions
  useEffect(() => {
    if (!user) return;

    console.log('Setting up enhanced real-time subscriptions for user:', user.id);

    // Subscribe to new matches with instant notifications
    const matchesChannel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          console.log('New match detected:', payload);
          const newMatch = payload.new as any;
          if (newMatch.user1_id === user.id || newMatch.user2_id === user.id) {
            fetchMatches();
            toast({
              title: '🎉 New Match!',
              description: 'You have a new match! Start chatting now!',
            });
          }
        }
      )
      .subscribe();

    // Subscribe to new messages with real-time updates
    const messagesChannel = supabase
      .channel('messages-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message detected:', payload);
          const newMessage = payload.new as Message;
          
          // Only handle messages not sent by current user
          if (newMessage.sender_id !== user.id) {
            fetchConversations();
            
            // If viewing the conversation, refresh messages
            setMessages(prev => {
              if (prev.length > 0 && prev[0].conversation_id === newMessage.conversation_id) {
                return [...prev, newMessage];
              }
              return prev;
            });

            toast({
              title: '💬 New Message',
              description: 'You have a new message!',
            });
          }
        }
      )
      .subscribe();

    // Subscribe to new likes for instant feedback
    const likesChannel = supabase
      .channel('likes-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_likes'
        },
        (payload) => {
          console.log('New like detected:', payload);
          const newLike = payload.new as any;
          
          // If someone liked the current user
          if (newLike.liked_id === user.id) {
            toast({
              title: '❤️ Someone Liked You!',
              description: 'Check your matches to see if it\'s mutual!',
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up enhanced real-time subscriptions');
      supabase.removeChannel(matchesChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(likesChannel);
    };
  }, [user]);

  return {
    discoveryProfiles,
    matches,
    conversations,
    messages,
    loading,
    fetchDiscoveryProfiles,
    likeProfile,
    superLikeProfile,
    skipProfile,
    fetchMatches,
    fetchConversations,
    fetchMessages,
    sendMessage
  };
};
