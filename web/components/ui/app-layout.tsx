import { ReactNode } from 'react';
import Link from 'next/link';
import { WalletButton } from '../solana/solana-provider';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0px 12px'
        }}
      >
        <div>
          <h1 className='Title'>Blink Generator</h1>
        </div>
        <div>
          <WalletButton />
        </div>
      </div>
      <div style={{padding: '10px' }}>{children}</div>
    </div>
  );
}
