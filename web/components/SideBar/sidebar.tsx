"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaGithub, FaHardHat, FaBars } from 'react-icons/fa';
import Image from 'next/image';

interface SideButtonProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const SideBarButtons: React.FC<SideButtonProps> = ({ href, children, isActive, onClick }) => (
  <Link href={href} className="no-underline">
    <p
      className={`py-3 px-5 text-lg font-medium text-white/70 transition-colors duration-300 rounded-lg cursor-pointer bg-[rgba(17,25,40,0)] backdrop-blur-[20px] saturate-[138%] shadow-[inset_0px_0px_15px_rgba(255,255,255,0.15)] my-1.5 ${isActive ? 'text-white bg-white/20 shadow-[inset_0px_0px_40px_rgba(0,0,150,0.4)]' : 'hover:text-white hover:bg-white/20 hover:shadow-[inset_0px_0px_40px_rgba(0,0,150,0.4)]'}`}
      onClick={onClick}
    >
      {children}
    </p>
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
  }, []);

  useEffect(() => {
    if(isSidebarOpen){
      const toggleBtn = document.querySelector('.sidebar-toggle');
      if(toggleBtn){
        toggleBtn.innerHTML = '<strong>x</strong>';
        toggleBtn.classList.add('open');
      }

      const logoElement = document.querySelector('.logo-Blink');
      if (logoElement) {
        const IMG = logoElement.querySelector('img');
        if (!IMG) { return; }
        IMG.setAttribute('src', 'Blink.gif');
        setTimeout(() => {
          IMG.setAttribute('src', 'Blink.png');
        }, 1000);
      }
    }else{
      const toggleBtn = document.querySelector('.sidebar-toggle');
      if(toggleBtn){
        toggleBtn.innerHTML = '<strong>☰</strong>';
        toggleBtn.classList.remove('open');
      }
    }
  }, [isSidebarOpen]);

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
      <div className={`w-[300px] h-full bg-[rgba(17,25,40,0)] backdrop-blur-[20px] saturate-[138%] rounded-tr-[30px] rounded-br-[30px] py-5 px-0 shadow-[inset_0px_0px_80px_rgba(255,255,255,0.15)] flex flex-col justify-between items-center transition-transform duration-300 ease-in-out z-[2] fixed overflow-y-scroll scrollbar-none ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:w-[180px]`}>
        <nav className="w-full">
          <div className="logo-Blink flex justify-center w-full">
            <Image src={'/Blink.png'} width={80} height={80} alt="Logo" />
          </div>
          <ul className="list-none p-2.5 m-0">
            <li>
              <SideBarButtons href="/" isActive={activeButton === '/'} onClick={() => handleButtonClick('/')}>
                Receive Sol
              </SideBarButtons>
            </li>
            <li>
              <SideBarButtons href="/token" isActive={activeButton === '/token'} onClick={() => handleButtonClick('/token')}>
                Sell/ReSell tokens
              </SideBarButtons>
            </li>
            <li>
              <SideBarButtons href="/Blinks" isActive={activeButton === '/Blinks'} onClick={() => handleButtonClick('/Blinks')}>
                My Blinks
              </SideBarButtons>
            </li>
            <li>
              <SideBarButtons href="/ComingSoon" isActive={activeButton === '/gamble'} onClick={() => handleButtonClick('/gamble')}>
                Gamble Blinks
              </SideBarButtons>
            </li>
            <li>
              <SideBarButtons href="/ComingSoon" isActive={activeButton === '/gaming'} onClick={() => handleButtonClick('/gaming')}>
                Gaming Blinks
              </SideBarButtons>
            </li>
          </ul>
        </nav>
        <div className="flex flex-col gap-2.5 p-2.5 w-fit">
          <a 
            href='https://x.com/getblinkdotfun' 
            target='_blank' 
            className={`text-center text-white/70 bg-[rgba(17,25,40,0)] backdrop-blur-[20px] saturate-[138%] shadow-[inset_0px_0px_20px_rgba(255,255,255,0.15)] p-2.5 text-base rounded-md transition-all duration-300 no-underline whitespace-nowrap overflow-hidden text-ellipsis ${activeButton === '/saved' ? 'text-white bg-white/40 shadow-[0px_0px_10px_rgba(255,255,255,0.4)]' : 'hover:text-white hover:bg-white/40 hover:shadow-[0px_0px_10px_rgba(255,255,255,0.4)]'}`}
          >
            <span>X /@getblinkdotfun</span>
          </a>
          <a 
            href='https://github.com/Getblink-fun/Getblink.fun' 
            target='_blank' 
            className={`text-center text-white/70 bg-[rgba(17,25,40,0)] backdrop-blur-[20px] saturate-[138%] shadow-[inset_0px_0px_20px_rgba(255,255,255,0.15)] p-2.5 text-base rounded-md transition-all duration-300 no-underline whitespace-nowrap overflow-hidden text-ellipsis ${activeButton === '/draft' ? 'text-white bg-white/40 shadow-[0px_0px_10px_rgba(255,255,255,0.4)]' : 'hover:text-white hover:bg-white/40 hover:shadow-[0px_0px_10px_rgba(255,255,255,0.4)]'}`}
          >
            <span><FaGithub /> /Blink-Generator</span>
          </a>
        </div>
      </div>

      {isMobile && (
        <>
          <button 
            className={`transition-transform duration-300 ease-in-out fixed bottom-[3%] left-8 backdrop-blur-[20px] saturate-[138%] shadow-[inset_0px_0px_20px_rgba(0,0,0,0.3)] bg-white/10 text-white border-none rounded-full h-20 w-20 text-[2.5rem] cursor-pointer z-[3] md:h-[60px] md:w-[60px] md:text-[1.6rem] ${isSidebarOpen ? 'translate-x-[300px] md:translate-x-40' : 'translate-x-0'}`}
            onClick={handleSidebarToggle}
          >
            <strong>☰</strong>
          </button>
          {isSidebarOpen && <div className="fixed top-0 left-0 w-full h-full bg-black/60 backdrop-blur-[10px] z-[1]" onClick={handleSidebarToggle}></div>}
        </>
      )}
    </>
  );
};

export default Sidebar;
