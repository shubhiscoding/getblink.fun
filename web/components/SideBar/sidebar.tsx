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
      className={`flex items-center gap-3 py-3 px-4 my-2 rounded-md transition-all duration-300 ${
        isActive
          ? 'bg-[var(--accent-primary)] text-white font-medium shadow-sm'
          : 'text-[var(--text-secondary)] hover:bg-[var(--border-color)] hover:text-[var(--text-color)]'
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
      <div className={`fixed lap:relative w-[260px] h-full card py-6 flex flex-col justify-between z-20 transition-transform duration-300 ${
        isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
      } sm:w-full sm:max-w-[260px]`}>
        <div>
          <div className="flex justify-center items-center mb-6">
            <Image
              src={'/Blink.png'}
              width={60}
              height={60}
              alt="Logo"
              className="rounded-full shadow-sm"
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

        <div className="px-4 space-y-2">
          <a
            href='https://x.com/getblinkdotfun'
            target='_blank'
            className="flex items-center gap-2 p-3 text-[var(--text-secondary)] rounded-md transition-all duration-300 hover:bg-[var(--border-color)] hover:text-[var(--text-color)]"
          >
            <FaTwitter />
            <span>@getblinkdotfun</span>
          </a>

          <a
            href='https://github.com/Getblink-fun/Getblink.fun'
            target='_blank'
            className="flex items-center gap-2 p-3 text-[var(--text-secondary)] rounded-md transition-all duration-300 hover:bg-[var(--border-color)] hover:text-[var(--text-color)]"
          >
            <FaGithub />
            <span>Blink-Generator</span>
          </a>
        </div>
      </div>

      {isMobile && (
        <>
          <button
            className="mobile-menu-button"
            onClick={handleSidebarToggle}
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

          {isSidebarOpen && (
            <div
              className="mobile-overlay"
              onClick={handleSidebarToggle}
            />
          )}
        </>
      )}
    </>
  );
};

export default Sidebar;
