import { ReactNode } from 'react';
import { WalletButton } from '../solana/solana-provider';
import Sidebar from '../SideBar/sidebar';
import ThemeToggle from './theme-toggle';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col m-4 md:m-6 card overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border-b border-[var(--border-color)] bg-[var(--card-bg)]">
          <h1 className="Title">Getblink.fun</h1>
          <div className="flex items-center gap-4 mt-3 md:mt-0">
            <ThemeToggle />
            <WalletButton />
          </div>
        </div>
        <div className="flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}
