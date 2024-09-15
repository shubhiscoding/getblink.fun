"use client";
import { useState, useEffect, Suspense } from 'react';
import './page.css';
import { useWallet } from '@solana/wallet-adapter-react';
import DataCard from '../../components/DataCard/dataCard';
import { WalletButton } from '@/components/solana/solana-provider';

export default function Page() {
  const { publicKey, connected } = useWallet();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const getBlinks = async () => {
    try {
      const response = await fetch('/api/actions/getBlinks?wallet=' + (publicKey ? publicKey.toString() : ''));
      const { blinks } = await response.json();
      setData(blinks);
      console.log('Blinks:', blinks);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching blinks:', error);
    }
  };

  useEffect(() => {
    if (publicKey) {
      getBlinks();
    }
  }, [publicKey]);

  return (
    <div className='parnt-container'>
      <div className='Container'>
        <h1 className='gradient-text txt'>Your Blinks</h1>
        {publicKey && loading && <p>Loading...</p>}
        {publicKey?(<div className='Blinks'>
          {data && data.length>0? data.map((blink) => (
            <DataCard key={blink['_id']} code={blink['_id']} title={blink.title} endpoint={blink.mint? "tokens": "donate"} />
          )): <p>No Blinks found</p>}
        </div>): <WalletButton />}
      </div>
    </div>
  );
}
