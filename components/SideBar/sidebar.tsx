"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub, FaTwitter, FaBars, FaTimes, FaHardHat } from 'react-icons/fa';
import { IoWater } from "react-icons/io5";
import { HiOutlineCash, HiOutlineShoppingCart, HiOutlineCollection, HiOutlineCube, HiOutlineChip } from 'react-icons/hi';
import Image from 'next/image';
import { useGlobalTitleState } from '@/app/GlobalStateContext';

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
  const { setValue, value, setInfo } = useGlobalTitleState();

  useEffect(() => {
    const path = window.location.pathname;
    const segments = path.split('/');
    const endpoint = segments[segments.length - 1] || '';
    setActiveButton('/' + endpoint);

    if(endpoint === ''){
      setValue('Recieve SOL');
      setInfo("Easily generate a shareable Blink to receive SOL from anyone.");
    }else if(endpoint === 'token'){
      setValue('Sell/ReSell Tokens');
      setInfo("Create a Blink to sell or resell any SPL token. Share it with others so they can easily buy the token.")
    }else if(endpoint === 'lp'){
      setValue('LP Blink');
      setInfo("Create a Blink for any Meteora DLMM pool. When shared, this Blink allows others to view and interact with the pool’s spot, curve, or bid-ask positions")
    }else if(endpoint === 'Blinks'){
      setValue('My Blinks');
      setInfo('The list of Blinks created by this wallet, using GetBlink.fun')
    }

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
    if(href === '/'){
      setValue('Recieve SOL');
      setInfo("Easily generate a shareable Blink to receive SOL from anyone.");
    }else if(href === '/token'){
      setValue('Sell/ReSell Tokens');
      setInfo("Create a Blink to sell or resell any SPL token. Share it with others so they can easily buy the token.")
    }else if(href === '/lp'){
      setValue('LP Blink');
      setInfo("Create a Blink for any Meteora DLMM pool. When shared, this Blink allows others to view and interact with the pool’s spot, curve, or bid-ask positions")
    }else if(href === '/Blinks'){
      setValue('My Blinks');
      setInfo('The list of Blinks created by this wallet, using GetBlink.fun')
    }
    console.log('Active Button:', href);
    console.log('value:', value);
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


        <div
          className="flex-1 flex flex-col m-4 md:m-6 card
                     shadow-lg fade-in bg-opacity-90 backdrop-blur-md
                     cursor-pointer hover:scale-110 ease-in-out duration-500"
          onClick={()=> window.location.href = '/'}
        >
          <div className="backdrop-blur-sm z-40">
            <h1
              className="text-[1.5rem] font-bold m-0 bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text animation-delay-200 fade-in"
            >
              GetBlink.fun
            </h1>
          </div>
        </div>

          <div className="px-5 space-y-2">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent my-4"></div>
            <div className="fade-in animation-delay-100">
              <SideBarButton
                href="/"
                icon={<HiOutlineCash />}
                isActive={activeButton === '/'}
                onClick={() => handleButtonClick('/')}
              >
                Request SOL
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

            <div className="fade-in animation-delay-500">
              <SideBarButton
                href="/lp"
                icon={<IoWater />}
                isActive={activeButton === '/lp'}
                onClick={() => handleButtonClick('/lp')}
              >
                LP Blink
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
            href='https://github.com/shubhiscoding/getblink.fun'
            target='_blank'
            className="flex items-center gap-3 p-3.5 text-[var(--text-secondary)] rounded-xl transition-all duration-300 hover:bg-[var(--hover-bg)] hover:text-[var(--text-color)] hover-lift"
          >
            <FaGithub className="text-[var(--text-color)]" />
            <span className="font-medium">Source Code</span>
          </a>

          <a
            href='https://x.com/getblinkdotfun'
            target='_blank'
            className="flex items-center gap-3 p-3.5 text-[var(--text-secondary)] rounded-xl transition-all duration-300 hover:bg-[var(--hover-bg)] hover:text-[var(--text-color)] hover-lift"
          >
            <FaTwitter className="text-[#1DA1F2]" />
            <span className="font-medium">@getblinkdotfun</span>
          </a>

          <a
            href='https://x.com/LookWhatIbuild'
            target='_blank'
            className="flex items-center gap-3 p-3.5 text-[var(--text-secondary)] rounded-xl transition-all duration-300 hover:bg-[var(--hover-bg)] hover:text-[var(--text-color)] hover-lift"
          >
            <FaHardHat className="text-[var(--text-color)]" />
            <span className="font-medium">@LookWhatIBuild</span>
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
