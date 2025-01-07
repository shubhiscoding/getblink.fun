"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import "./sidebar.css";
import { FaGithub, FaHardHat, FaBars } from 'react-icons/fa';

interface SideButtonProps {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const SideBarButtons: React.FC<SideButtonProps> = ({ href, children, isActive, onClick }) => (
  <Link href={href} style={{ textDecoration: 'none' }}>
    <p
      className={`navButton ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {children}
    </p>
  </Link>
);

const Sidebar = () => {
  const [activeButton, setActiveButton] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar is open by default on larger screens
  const [isMobile, setIsMobile] = useState(true);

  // useEffect(() => {
  //   // Check if the screen is mobile-sized
  //   const handleResize = () => setIsMobile(window.innerWidth < 768);

  //   // Set initial state and add resize listener
  //   handleResize();
  //   window.addEventListener('resize', handleResize);

  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, []);

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
      setIsSidebarOpen(false); // Close sidebar on mobile after option click
    }
  };

  return (
    <>
      <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <nav className="sidebar-nav">
          <div className="logo-Blink" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <img src='Blink.png' width={'80%'} alt="Logo" />
          </div>
          <ul>
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
        <div className="sidebar-bottom">
          <a href='https://x.com/getblinkdotfun' target='_blank' className={activeButton === '/saved' ? 'active' : ''}>
            <span>X /@getblinkdotfun</span>
          </a>
          <a href='https://github.com/Getblink-fun/Getblink.fun' target='_blank' className={activeButton === '/draft' ? 'active' : ''}>
            <span><FaGithub /> /Blink-Generator</span>
          </a>
          {/* <a href='https://x.com/LookWhatIbuild' target='_blank' className={activeButton === '/trash' ? 'active' : ''}>
            <span><FaHardHat /> /@LookWhatIBuild</span>
          </a> */}
        </div>
      </div>

      {isMobile && (
        <>
          <button className="sidebar-toggle" onClick={handleSidebarToggle}>
            <strong>x</strong>
          </button>
          {isSidebarOpen && <div className="backdrop" onClick={handleSidebarToggle}></div>}
        </>
      )}
    </>
  );
};

export default Sidebar;
