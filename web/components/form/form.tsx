'use client';

import React, { useState, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';
import LoadingScreen from '../Loading/loading';
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl
} from '@solana/web3.js';

interface FormProps {
  icon: string;
  setIcon: (value: string) => void;
  label: string;
  setLabel: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  title: string;
  setTitle: (value: string) => void;
}

const Form: React.FC<FormProps> = ({
  icon,
  setIcon,
  label,
  setLabel,
  description,
  setDescription,
  title,
  setTitle,
}) => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [showForm, setShowForm] = useState(true);
  const [blinkLink, setBlinkLink] = useState('');
  const [copied, setCopied] = useState(false);
  const form = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePreview = async () => {
    if (!connected || !publicKey) {
      console.error('Wallet not connected');
      return;
    }

    if (!icon || !label || !description || !title) {
      console.error('Please fill all fields');
      window.alert('Please fill all fields');
      return;
    }
    setLoading(true);
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC|| clusterApiUrl("mainnet-beta"));
    const recipientPubKey = new PublicKey("8twrkXxvDzuUezvbkgg3LxpTEZ59KiFx2VxPFDkucLk3");
    const amount = 0.001 * LAMPORTS_PER_SOL;

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: publicKey,
        toPubkey: recipientPubKey,
        lamports: amount,
      })
    );

    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = publicKey;

    try {
      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction sent:', signature);

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });
      console.log('Transaction confirmed:', confirmation);
    } catch (error) {
      setLoading(false);
      console.error('Failed to send transaction', error);
      window.alert('Failed to send transaction');
      return;
    }

    try {
      const walletAddress = publicKey.toString();
      const response = await fetch('/api/actions/generate-blink', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          icon,
          label,
          description,
          title,
          wallet: walletAddress,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate blink');
      }

      const data = await response.json();
      setBlinkLink(data.blinkLink);
      setShowForm(false);
      setLoading(false);
      if (form.current) {
        form.current.className = form.current.className.replace('p-[120px]', 'p-[70px]');
      }
    } catch (error) {
      setLoading(false);
      console.error('Failed to generate blink', error);
      window.alert('Failed to generate blink');
      return;
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://dial.to/?action=solana-action:${blinkLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleTweet = () => {
    const tweetText = `Check out this Blink I just made @getblinkdotfun: https://dial.to/?action=solana-action:${blinkLink}`;
    const twitterUrl = `https://X.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleNew = () => {
    setShowForm(true);
    if (form.current) {
      form.current.className = form.current.className.replace('p-[70px]', 'p-[120px]');
    }
  };

  return (
    <div className="flex flex-col justify-between rounded-2xl px-0 md:px-5 w-fit">
      {loading && <LoadingScreen subtext="Waiting For Transaction Confirmation!!" />}
      <div className="p-[120px] rounded-[50px] backdrop-blur-[20px] saturate-[138%] shadow-[inset_0px_0px_20px_rgba(255,255,255,0.15)] bg-[rgba(17,25,40,0)] text-white font-sans" ref={form}>
        {showForm && <h1 className="text-3xl md:text-[3rem] font-bold mb-2.5 text-[#989898]">Customize Your Blink</h1>}
        {showForm && (
          <div className="mb-5">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 max-w-[900px] bg-black shadow-[0_3px_10px_rgba(0,0,0,1)] border border-[var(--border-color)] rounded-full text-[#bbbdbd] text-base"
              placeholder="Title"
              maxLength={50}
            />
          </div>
        )}
        {showForm && (
          <div className="mb-5">
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full p-3 max-w-[900px] bg-black shadow-[0_3px_10px_rgba(0,0,0,1)] border border-[var(--border-color)] rounded-full text-[#bbbdbd] text-base"
              placeholder="Label"
              maxLength={50}
            />
          </div>
        )}
        {showForm && (
          <div className="mb-5">
            <input
              type="text"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="w-full p-3 max-w-[900px] bg-black shadow-[0_3px_10px_rgba(0,0,0,1)] border border-[var(--border-color)] rounded-full text-[#bbbdbd] text-base"
              placeholder="Image Url"
            />
          </div>
        )}
        {showForm && (
          <div className="mb-5">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 max-w-[900px] bg-black shadow-[0_3px_10px_rgba(0,0,0,1)] border border-[var(--border-color)] rounded-[30px] text-[#bbbdbd] text-base resize-none min-h-[20px]"
              rows={3}
              placeholder="Description"
              maxLength={143}
            />
          </div>
        )}
        {showForm && publicKey ? (
          <button 
            className="bg-white text-[var(--bg-color)] border-none py-3 px-5 rounded-full font-bold cursor-pointer transition-colors duration-1000 shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent" 
            onClick={handlePreview} 
            disabled={!connected}
          >
            Generate Blink
          </button>
        ) : (
          showForm && <WalletButton />
        )}
        {blinkLink && !showForm && (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-2xl font-bold mb-2">Your Blink is Ready!</h2>
            <div className="flex flex-col items-center gap-2 mb-4">
              <p className="text-center">Share your Blink with the world:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button 
                  className="bg-white text-[var(--bg-color)] border-none py-2 px-4 rounded-full font-bold cursor-pointer transition-colors duration-1000 shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent"
                  onClick={handleCopy}
                >
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button 
                  className="bg-white text-[var(--bg-color)] border-none py-2 px-4 rounded-full font-bold cursor-pointer transition-colors duration-1000 shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent"
                  onClick={handleTweet}
                >
                  Tweet
                </button>
                <button 
                  className="bg-white text-[var(--bg-color)] border-none py-2 px-4 rounded-full font-bold cursor-pointer transition-colors duration-1000 shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent"
                  onClick={handleNew}
                >
                  Create New
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
