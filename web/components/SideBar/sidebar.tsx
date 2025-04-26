"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';
import { HiOutlineCash, HiOutlineShoppingCart, HiOutlineCollection, HiOutlineCube, HiOutlineChip } from 'react-icons/hi';
import Image from 'next/image';

interface SideButtonProps {
  href: string;
  children: React.ReactNode;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const SideBarButton: React.FC<SideButtonProps> = ({ href, children, icon, isActive, onClick }) => (
  <Link href={href} className="no-underline w-full">
    <div
      className={`flex items-center gap-3 py-3 px-4 my-2 rounded-xl transition-all duration-300 ${
        isActive 
          ? 'bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white font-medium shadow-lg' 
          : 'text-[var(--text-secondary)] hover:bg-[var(--card-bg)] hover:text-white'
      }`}
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      <span>{children}</span>
    </div>
  </Link>
);

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split('/');
    const endpoint = segments[segments.length - 1] || '';
    setActiveButton('/' + endpoint);
    
    // Logo animation
    const logoElement = document.querySelector('.logo-Blink');
    if (logoElement) {
      setInterval(() => {
        const IMG = logoElement.querySelector('img');
        if (!IMG) { return; }
        IMG.setAttribute('src', 'Blink.gif');
        setTimeout(() => {
          IMG.setAttribute('src', 'Blink.png');
        }, 1000);
      }, 10000);
    }
    
    // Check if mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleButtonClick = (href: string) => {
    setActiveButton(href);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <>
      <div className={`fixed md:relative w-[280px] h-full glass-card py-6 flex flex-col justify-between z-20 transition-transform duration-300 ${
        isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
      }`}>
        <div>
          <div className="logo-Blink flex justify-center items-center mb-6">
            <Image 
              src={'/Blink.png'} 
              width={80} 
              height={80} 
              alt="Logo"
              className="rounded-full shadow-lg p-1 bg-[rgba(255,255,255,0.1)]" 
            />
          </div>
          
          <div className="px-4">
            <SideBarButton 
              href="/" 
              icon={<HiOutlineCash />}
              isActive={activeButton === '/'} 
              onClick={() => handleButtonClick('/')}
            >
              Receive Sol
            </SideBarButton>
            
            <SideBarButton 
              href="/token" 
              icon={<HiOutlineShoppingCart />}
              isActive={activeButton === '/token'} 
              onClick={() => handleButtonClick('/token')}
            >
              Sell/ReSell Tokens
            </SideBarButton>
            
            <SideBarButton 
              href="/Blinks" 
              icon={<HiOutlineCollection />}
              isActive={activeButton === '/Blinks'} 
              onClick={() => handleButtonClick('/Blinks')}
            >
              My Blinks
            </SideBarButton>
            
            <SideBarButton 
              href="/ComingSoon" 
              icon={<HiOutlineCube />}
              isActive={activeButton === '/gamble'} 
              onClick={() => handleButtonClick('/gamble')}
            >
              Gamble Blinks
            </SideBarButton>
            
            <SideBarButton 
              href="/ComingSoon" 
              icon={<HiOutlineChip />}
              isActive={activeButton === '/gaming'} 
              onClick={() => handleButtonClick('/gaming')}
            >
              Gaming Blinks
            </SideBarButton>
          </div>
        </div>
        
        <div className="px-4 space-y-3">
          <a 
            href='https://x.com/getblinkdotfun' 
            target='_blank' 
            className="flex items-center gap-2 p-3 text-[var(--text-secondary)] rounded-xl transition-all duration-300 hover:bg-[var(--card-bg)] hover:text-white"
          >
            <FaTwitter />
            <span>@getblinkdotfun</span>
          </a>
          
          <a 
            href='https://github.com/Getblink-fun/Getblink.fun' 
            target='_blank' 
            className="flex items-center gap-2 p-3 text-[var(--text-secondary)] rounded-xl transition-all duration-300 hover:bg-[var(--card-bg)] hover:text-white"
          >
            <FaGithub />
            <span>Blink-Generator</span>
          </a>
        </div>
      </div>

      {isMobile && (
        <>
          <button 
            className="fixed bottom-6 left-6 z-30 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] text-white shadow-lg"
            onClick={handleSidebarToggle}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
              onClick={handleSidebarToggle}
            />
          )}
        </>
      )}
    </>
  );
};

export default Sidebar;
