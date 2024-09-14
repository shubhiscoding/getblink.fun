"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './navbar.css';

interface NavButtonProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const NavButton: React.FC<NavButtonProps> = ({ href, children, isActive, onClick }) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <p
      className={`navButton ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </p>
  </Link>
);

const Navbar: React.FC = () => {
  const [activeButton, setActiveButton] = useState<string>(''); // Set default active button

  useEffect(() => {
    const path = window.location.pathname;

    const segments = path.split('/');
    const endpoint = segments[segments.length - 1] || '';
    
    setActiveButton('/'+endpoint);
  }, []);

  return (
    <nav className="navbar">
      <NavButton
        href="/"
        isActive={activeButton === '/'}
        onClick={() => setActiveButton('/')}
      >
        Receive Sol
      </NavButton>

      <NavButton
        href="/token"
        isActive={activeButton === '/token'}
        onClick={() => setActiveButton('/token')}
      >
        Sell Pump.fun Token
      </NavButton>

      <NavButton
        href="/Blinks"
        isActive={activeButton === '/Blinks'}
        onClick={() => setActiveButton('/Blinks')}
      >
        View Blinks
      </NavButton>
    </nav>
  );
};

export default Navbar;
