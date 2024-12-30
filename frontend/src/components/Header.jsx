import React from 'react';
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import { useContext } from 'react';
import './Header.css'; // Import CSS for animations

const Header = () => {
  const { userData } = useContext(AppContent)

  return (
    <div className="flex flex-col items-center mt-20 px-4 text-center text-gray-800">
        <img 
        src={assets.header_img} 
        alt="Header" 
        className="w-48 h-48 rounded-full mb-6 header-img"  // Apply the header-img class here
      />
      
      <h1 className="flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2 animate-text">
        Hello {userData ? userData.name : 'Lazy Developer'} ! 
        <img src={assets.hand_wave} className="w-11 aspect-square animate-wave" alt="" />
      </h1>
      
      <h2 className="text-4xl sm-text-6xl font-semibold mb-4 animate-text mr-8">
        Welcome to Earth!
      </h2>
      
      <p className="mb-8 max-w-lg">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quibusdam ratione fuga molestias officiis, ipsum inventore.
      </p>
      
      <button className="border border-gray-500 rounded-full px-8 py-2.5 hover:bg-gray-100 transition-all">
        Get Started!
      </button>
    </div>
  );
};

export default Header;
