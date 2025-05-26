
import React from 'react';
import { Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 z-40">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">🔥</span>
          </div>
          <h1 className="text-white font-bold text-xl">IITMSocialNetwork</h1>
        </div>
        <button className="p-2 text-gray-400 hover:text-white transition-colors">
          <Search size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
