"use client";
import React from 'react';
import Link from 'next/link';
import './navbar.css';

interface NavButtonProps {
  href: string;
  children: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ href, children }) => (
  <Link href={href}  style={{ textDecoration: 'none' }}>
    <p className="navButton">{children}</p>
  </Link>
);

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <NavButton href="/">Receive Sol</NavButton>
      <NavButton href="/token">Sell Pump.fun Token</NavButton>
      <NavButton href="/Blinks">View Blinks</NavButton>
    </nav>
  );
};

export default Navbar;
