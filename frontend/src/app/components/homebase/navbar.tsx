import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

const NavBar = () => {
  const pathname = usePathname(); // Get the current path
  return (
    <nav className="navbar bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 shadow-lg flex items-center justify-between">
        <div className="logo text-white text-3xl font-bold tracking-wider transform transition-all hover:scale-105">HOMEBASE</div>
        <div className="flex items-center space-x-6 mr-7">
          {/* Links */}
          <ul className="flex space-x-4 text-black font-medium ">
            <li>
              <Link
                href="/"
                className={`px-3 py-1 rounded-md transition  ${
                  pathname === "/" ? "text-black font-bold " : "hover:bg-indigo-300 scale-105"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/trips"
                className={`px-3 py-1 rounded-md transition ${
                  pathname === "/trips" ? " text-black font-bold" : "hover:bg-indigo-300 scale-105"
                }`}
              >
                Trips
              </Link>
            </li>
          </ul>
       
          {/* <div className="user-icon bg-black text-white w-10 h-10 flex items-center justify-center rounded-full font-bold shadow-lg">
            U
          </div> */}
      </div>
        
    </nav>
  );
}

export default NavBar;