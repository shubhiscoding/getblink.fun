"use client";
import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import DataCard from '../../components/DataCard/dataCard';
import { WalletButton } from '@/components/solana/solana-provider';
import { Footer } from '@/components/footer';

export default function Page() {
  const { publicKey } = useWallet();
  const [data, setData] = useState<Array<Record<string, any>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getBlinks = async () => {
      if (!publicKey) return;
      
      try {
        const response = await fetch('/api/actions/getBlinks?wallet=' + publicKey.toString());
        const { blinks } = await response.json();
        setData(blinks);
        console.log('Blinks:', blinks);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching blinks:', error);
      }
    };

    if (publicKey) {
      getBlinks();
    }
  }, [publicKey]);

  return (
    <>
    <div className='flex p-[10px_50px] h-[80vh] w-full justify-center md:p-[10px_30px] sm:p-[10px_20px] xs:p-[10px]'>
      <div className='flex flex-col items-center justify-center rounded-[50px] p-10 backdrop-blur-md saturate-[138%] shadow-[inset_0px_0px_20px_rgba(27,27,27,0.8)] bg-[rgba(17,25,40,0)] text-white font-sans w-full md:p-[30px] sm:p-5'>
        <h1 className='bg-gradient-to-r from-[#6d6d6d] via-[#dadada] to-[#989898] bg-clip-text text-transparent text-[3rem] font-bold mb-2.5 md:text-[2.5rem] sm:text-[2rem] xs:text-[1.5rem]'>Your Blinks</h1>
        {publicKey && loading && <p>Loading...</p>}
        {publicKey ? (
          <div className='p-[20px_40px] max-h-[400px] overflow-y-scroll rounded-[50px] shadow-[inset_0px_0px_100px_rgba(26,36,33,0.8)] bg-[rgba(17,25,40,0)] text-white font-sans scrollbar-none md:p-5 sm:p-[15px] xs:p-2.5 xs:max-h-[300px]'>
            {data && data.length > 0 ? data.slice().reverse().map((blink) => (
              <DataCard
               key={blink['_id']}
               code={blink['_id']}
               base={blink.privateKey ? "https://dial.to/devnet?action=solana-action:" : "https://dial.to/?action=solana-action:"}
               title={blink.title}
               endpoint={blink.mint ? "tokens" : (blink.privateKey ? "gamble" : "donate")} />
            )) : <p>No Blinks found</p>}
          </div>
        ) : <WalletButton />}
      </div>
    </div>
    <Footer />
    </>
  );
}
