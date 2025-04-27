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
      className={`flex items-center gap-3 py-3.5 px-5 my-2 rounded-xl transition-all duration-300 hover-lift ${
        isActive
          ? 'bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white font-medium shadow-md glow'
          : 'text-[var(--text-secondary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-color)]'
      }`}
      onClick={onClick}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{children}</span>
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

    // Check if mobile
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1270);
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
      <div 
        className={`fixed lap:relative w-[300px] h-full card py-10 flex flex-col justify-between z-20 backdrop-blur-md bg-[var(--card-bg)]/90 border-r border-[var(--border-color)] transition-all duration-300 ${
          isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
        } sm:w-full sm:max-w-[300px]`}
      >
        <div>
          <div className="flex justify-center items-center mb-10 fade-in">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent-primary)]/20 to-[var(--accent-secondary)]/20 pulse" style={{ transform: 'scale(1.2)' }} />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 pulse" style={{ animationDelay: '0.5s', transform: 'scale(1.4)' }} />
              <Image
                src={'/Blink.gif'}
                width={160}
                height={160}
                alt="Logo"
                className="rounded-full shadow-lg border-2 border-[var(--accent-primary)] floating"
              />
            </div>
          </div>

          <div className="px-5 space-y-2">
            <div className="fade-in animation-delay-100">
              <SideBarButton
                href="/"
                icon={<HiOutlineCash />}
                isActive={activeButton === '/'}
                onClick={() => handleButtonClick('/')}
              >
                Receive Sol
              </SideBarButton>
            </div>

            <div className="fade-in animation-delay-200">
              <SideBarButton
                href="/token"
                icon={<HiOutlineShoppingCart />}
                isActive={activeButton === '/token'}
                onClick={() => handleButtonClick('/token')}
              >
                Sell/ReSell Tokens
              </SideBarButton>
            </div>

            <div className="fade-in animation-delay-300">
              <SideBarButton
                href="/Blinks"
                icon={<HiOutlineCollection />}
                isActive={activeButton === '/Blinks'}
                onClick={() => handleButtonClick('/Blinks')}
              >
                My Blinks
              </SideBarButton>
            </div>

            <div className="fade-in animation-delay-400">
              <SideBarButton
                href="/ComingSoon"
                icon={<HiOutlineCube />}
                isActive={activeButton === '/gamble'}
                onClick={() => handleButtonClick('/gamble')}
              >
                Gamble Blinks
              </SideBarButton>
            </div>

            <div className="fade-in animation-delay-500">
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
        </div>

        <div className="px-5 space-y-3 fade-in animation-delay-500">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent my-4"></div>
          <a
            href='https://x.com/getblinkdotfun'
            target='_blank'
            className="flex items-center gap-3 p-3.5 text-[var(--text-secondary)] rounded-xl transition-all duration-300 hover:bg-[var(--hover-bg)] hover:text-[var(--text-color)] hover-lift"
          >
            <FaTwitter className="text-[#1DA1F2]" />
            <span className="font-medium">@getblinkdotfun</span>
          </a>

          <a
            href='https://github.com/Getblink-fun/Getblink.fun'
            target='_blank'
            className="flex items-center gap-3 p-3.5 text-[var(--text-secondary)] rounded-xl transition-all duration-300 hover:bg-[var(--hover-bg)] hover:text-[var(--text-color)] hover-lift"
          >
            <FaGithub className="text-[var(--text-color)]" />
            <span className="font-medium">Blink-Generator</span>
          </a>
        </div>
      </div>

      {isMobile && (
        <>
          <button
            className="fixed bottom-6 right-6 z-30 flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-white shadow-lg hover:scale-110 active:scale-90 transition-transform duration-200 glow"
            onClick={handleSidebarToggle}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>

          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10 fade-in"
              onClick={handleSidebarToggle}
            />
          )}
        </>
      )}
    </>
  );
};

export default Sidebar;
