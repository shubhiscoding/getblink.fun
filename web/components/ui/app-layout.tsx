import { ReactNode } from 'react';
import { WalletButton } from '../solana/solana-provider';
import Sidebar from '../SideBar/sidebar';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '100%'}}>
      <Sidebar />
      <div className='Content' style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        boxShadow: 'inset 0px 0px 80px rgba(255, 255, 255, 0.15)',
        margin: '20px',
        borderRadius: '20px',
        }}>
        <div
          className='Head'
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'start',
            justifyContent: 'space-between',
            padding: '20px 50px',
            paddingBottom: '0px',
            width: '100%',
          }}
        >
          <h1 className='Title'>Blink Generator</h1>
          <div>
            <WalletButton />
          </div>
        </div>
        <div style={{
          padding: '10px',
          overflowY: 'scroll',
          scrollbarWidth: 'none',
        }}>{children}</div>
      </div>
    </div>
  );
}
