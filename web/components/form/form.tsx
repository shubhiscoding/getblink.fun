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
import { HiOutlineClipboardCopy, HiOutlineShare } from 'react-icons/hi';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    setTimeout(() => setCopied(false), 1500);
  };

  const handleTweet = () => {
    const tweetText = `Check out this Blink I just made @getblinkdotfun: https://dial.to/?action=solana-action:${blinkLink}`;
    const twitterUrl = `https://X.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleNew = () => {
    setShowForm(true);
  };

  return (
    <div className="w-full max-w-2xl h-full">
      {loading && <LoadingScreen subtext="Waiting For Transaction Confirmation!!" />}
      <Card className="border-[var(--border-color)] bg-[var(--card-bg)] h-full" ref={form}>
        {showForm && (
          <div className="space-y-5 h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl md:text-3xl font-bold text-[var(--accent-primary)]">
                Customize Your Blink
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Title</label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-color)]"
                  placeholder="Enter a title for your Blink"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Label</label>
                <Input
                  type="text"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-color)]"
                  placeholder="Enter a label"
                  maxLength={50}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Image URL</label>
                <Input
                  type="text"
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="bg-[var(--bg-color)] border-[var(--border-color)] text-[var(--text-color)]"
                  placeholder="Enter image URL"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-md text-[var(--text-color)] text-base resize-none focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition-all duration-300"
                  rows={3}
                  placeholder="Enter a description"
                  maxLength={143}
                />
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {description.length}/143 characters
                </p>
              </div>

              {publicKey ? (
                <Button
                  variant="gradient"
                  className="w-full mt-6"
                  onClick={handlePreview}
                  disabled={!connected}
                >
                  Generate Blink
                </Button>
              ) : (
                <div className="mt-6 text-center">
                  <p className="text-[var(--text-secondary)] mb-3">Connect your wallet to generate a Blink</p>
                  <WalletButton />
                </div>
              )}
            </CardContent>
          </div>
        )}

        {!showForm && (
          <div className="space-y-5">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl md:text-3xl font-bold text-[var(--accent-primary)]">
                Your Blink is Ready!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="p-4 rounded-md bg-[var(--bg-color)] border border-[var(--border-color)]">
                <p className="text-sm font-medium mb-2 text-[var(--text-secondary)]">Blink Link:</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 p-3 bg-[var(--card-bg)] rounded-md text-sm overflow-hidden overflow-ellipsis whitespace-nowrap border border-[var(--border-color)]">
                    https://dial.to/?action=solana-action:{blinkLink}
                  </div>
                  <Button
                    onClick={handleCopy}
                    variant="outline"
                    className="p-3 hover:bg-[var(--accent-primary)] hover:text-white"
                    title="Copy to clipboard"
                  >
                    {copied ? 'Copied!' : <HiOutlineClipboardCopy size={20} />}
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-4 pt-2">
              <Button
                variant="gradient"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleTweet}
              >
                <HiOutlineShare size={18} />
                Share on X
              </Button>

              <Button
                variant="outline"
                className="flex-1 border-[var(--border-color)]"
                onClick={handleNew}
              >
                Create New Blink
              </Button>
            </CardFooter>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Form;
