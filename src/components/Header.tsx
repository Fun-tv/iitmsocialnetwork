
import React from 'react';
import { Search, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const { signOut, user } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        title: 'Error',
        description: 'Failed to log out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-40">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🔥</span>
          </div>
          <h1 className="text-white font-bold text-xl">IITMSocialNetwork</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Search size={20} />
          </button>
          {user && (
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <LogOut size={20} />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
