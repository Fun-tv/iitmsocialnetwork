
import React, { useState } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import DiscoverTab from '../components/DiscoverTab';
import MatchesTab from '../components/MatchesTab';
import MessagesTab from '../components/MessagesTab';
import ProfileTab from '../components/ProfileTab';
import PremiumTab from '../components/PremiumTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('discover');

  const renderContent = () => {
    switch (activeTab) {
      case 'discover':
        return <DiscoverTab />;
      case 'matches':
        return <MatchesTab />;
      case 'messages':
        return <MessagesTab />;
      case 'profile':
        return <ProfileTab />;
      case 'premium':
        return <PremiumTab />;
      default:
        return <DiscoverTab />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      
      <main className="pt-20 pb-16 max-w-md mx-auto min-h-screen">
        {renderContent()}
      </main>
      
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Index;
