import { ReactNode } from 'react';
import { WalletButton } from '../solana/solana-provider';
import Sidebar from '../SideBar/sidebar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-row h-full">
      <Sidebar />
      <div className="flex-1 flex flex-col m-4 md:m-6 glass-card overflow-hidden">
        <div className="flex flex-row items-center justify-between p-6 border-b border-[var(--border-color)] bg-[rgba(30,41,59,0.6)]">
          <h1 className="Title">Getblink.fun</h1>
          <div className="flex items-center">
            <WalletButton />
          </div>
        </div>
        <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[var(--border-color)] scrollbar-track-transparent">
          {children}
        </div>
      </div>
    </div>
  );
}
