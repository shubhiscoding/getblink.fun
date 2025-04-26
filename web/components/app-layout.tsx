import { ReactNode } from 'react';
import Link from 'next/link';
import { WalletButton } from './solana/solana-provider';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-3 py-0">
        <div>
          <Link href="/">
            <h1 className='Title'>Blink Generator</h1>
          </Link>
        </div>
        <div>
          <WalletButton />
        </div>
      </div>
      <div className="flex-grow p-1.5">{children}</div>
    </div>
  );
}
