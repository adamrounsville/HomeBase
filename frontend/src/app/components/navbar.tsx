import React from 'react';

const NavBar = () => {
  return (
    <nav className="navbar bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg flex items-center justify-between rounded-lg">
        <div className="logo text-white text-3xl font-bold tracking-wider transform transition-all hover:scale-105">HOMEBASE</div>
        <div className="user-icon">U</div>
    </nav>
  );
}

export default NavBar;