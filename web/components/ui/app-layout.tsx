import { ReactNode } from 'react';
import { WalletButton } from '../solana/solana-provider';
import Sidebar from '../SideBar/sidebar';
import ThemeToggle from './theme-toggle';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row h-full">
      <div className='md:mt-6 md:mb-6'>
        <Sidebar />
      </div>
      <div 
        className="flex-1 flex flex-col m-4 md:m-6 card overflow-hidden shadow-lg fade-in bg-opacity-90 backdrop-blur-md"
      >
        <div className="flex flex-col md:flex-row items-center justify-between p-5 md:p-7 border-b border-[var(--border-color)] bg-[var(--card-bg)] backdrop-blur-sm">
          <h1 
            className="Title bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] text-transparent bg-clip-text animation-delay-200 fade-in"
          >
            Getblink.fun
          </h1>
          <div 
            className="flex items-center gap-6 mt-3 md:mt-0 animation-delay-300 fade-in"
          >
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
        <div 
          className="flex-1 p-5 md:p-7 overflow-y-auto custom-scrollbar animation-delay-400 fade-in"
          style={{
            backgroundImage: 'radial-gradient(circle at 50% 50%, var(--bg-color) 0%, transparent 100%)',
            backgroundSize: '100% 100%'
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
