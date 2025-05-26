
import React from 'react';
import { Star, Heart, Eye, Zap, Check } from 'lucide-react';

const PremiumTab = () => {
  const features = [
    {
      icon: Heart,
      title: 'Unlimited Likes',
      description: 'Like as many profiles as you want'
    },
    {
      icon: Eye,
      title: 'See Who Liked You',
      description: 'View all profiles that liked you'
    },
    {
      icon: Zap,
      title: 'Profile Boost',
      description: 'Get 5x more profile views'
    },
    {
      icon: Star,
      title: 'Priority Support',
      description: 'Get help when you need it'
    }
  ];

  const plans = [
    {
      name: 'Basic Premium',
      price: '₹199',
      duration: '/month',
      features: ['Unlimited Likes', 'See Who Liked You', '5 Profile Boosts'],
      popular: false
    },
    {
      name: 'Premium Plus',
      price: '₹399',
      duration: '/month',
      features: ['Everything in Basic', 'Unlimited Boosts', 'Priority Support', 'Advanced Filters'],
      popular: true
    }
  ];

  return (
    <div className="p-4 pb-20">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Star size={32} className="text-white" />
        </div>
        <h2 className="text-3xl font-bold text-white mb-2">Get Premium</h2>
        <p className="text-gray-400">Unlock exclusive features and find your perfect match faster</p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div key={index} className="bg-gray-800 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Icon size={20} className="text-white" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-gray-400">{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Pricing Plans */}
      <div className="space-y-4 mb-8">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`relative bg-gray-800 rounded-2xl p-6 border-2 transition-all duration-200 ${
              plan.popular 
                ? 'border-gradient-to-r from-red-500 to-pink-500 bg-gradient-to-r from-red-500/10 to-pink-500/10' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  MOST POPULAR
                </span>
              </div>
            )}
            
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-gray-400 ml-1">{plan.duration}</span>
              </div>
            </div>
            
            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center text-gray-300">
                  <Check size={16} className="text-green-500 mr-2 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <button 
              className={`w-full font-semibold py-3 rounded-2xl transition-all duration-200 ${
                plan.popular
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
      </div>

      {/* Trust Badge */}
      <div className="text-center text-xs text-gray-400">
        <p>Secure payment • Cancel anytime • 30-day money back guarantee</p>
      </div>
    </div>
  );
};

export default PremiumTab;
