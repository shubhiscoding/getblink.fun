"use client";
import { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/solana-provider';
import TokenPreview from "@/components/preview/token-preview";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl
} from '@solana/web3.js';
import { FaInfoCircle } from 'react-icons/fa';
import { HiOutlineClipboardCopy, HiOutlineShare, HiOutlinePlus } from 'react-icons/hi';
import { Footer } from '@/components/footer';
import LoadingScreen from '@/components/Loading/loading';

// Define commission types for type safety
type CommissionType = "yes" | "no";

export default function Page() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [icon, setIcon] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);
  const [takeCommission, setTakeCommission] = useState<CommissionType>("no");
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [mint, setMint] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Please Wait!!');
  const [showForm, setShowForm] = useState(true);
  const [blinkLink, setBlinkLink] = useState('');
  const [copied, setCopied] = useState(false);
  const form = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleInfoClick = (e: MouseEvent) => {
      window.alert("If you opt to take a commission, the specified percentage of the total transaction amount will be credited to your wallet. Please note that the maximum commission percentage allowed is 1%.");
    };

    document.querySelectorAll('.info-icon').forEach(icon => {
      icon.addEventListener('click', handleInfoClick as EventListener);
    });

    return () => {
      document.querySelectorAll('.info-icon').forEach(icon => {
        icon.removeEventListener('click', handleInfoClick as EventListener);
      });
    };
  }, []);

  useEffect(() => {
    setShowPreview(true);
  }, [mint]);

  useEffect(() => {
    if(takeCommission === "no"){
      setPercentage(0);
    }
  }, [takeCommission]);

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingText('Waiting for Transaction confirmation!!');
    try {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC|| clusterApiUrl("mainnet-beta"));

      if (!connected || !publicKey) {
        console.error('Wallet not connected or not available');
        window.alert('Please connect your wallet first');
        return;
      }

      // Validate form fields (label, description, mint)
      if (!label || !description || !mint) {
        console.error('Please fill all fields');
        window.alert('Please fill all fields');
        return;
      }

      // Define recipient public key and transaction amount (0.01 SOL)
      const recipientPubKey = new PublicKey("8twrkXxvDzuUezvbkgg3LxpTEZ59KiFx2VxPFDkucLk3");
      const amount = 0.01 * LAMPORTS_PER_SOL;

      // Create a new Solana transaction
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

        const response = await fetch('/api/actions/generate-blink/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            label,
            description,
            wallet: publicKey.toString(),
            mint,
            commission: takeCommission,
            percentage: percentage,
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
        console.error('Error sending transaction:', error);
        window.alert('Transaction failed. Please try again.');
      }

    } catch (error) {
      setLoading(false);
      console.error('Error in handleSubmit:', error);
      window.alert('There was an issue generating your blink. Please try again.');
    }
  };

  const handlePreview = async () => {
    try {
      setLoading(true);
      setLoadingText('Generating Blink Preview!!');
      if (!connected || !publicKey) {
        console.error('Wallet not connected');
        return;
      }

      if (!label || !description || !mint) {
        console.error('Please fill all fields');
        window.alert('Please fill all fields');
        return;
      }
      const response = await fetch('/api/actions/generate-blink/token?mint=' + mint);

      if (!response.ok) {
        console.log('Error:', response);
        throw new Error('Failed to generate blink');
      }

      const data = await response.json();
      setIcon(data.icon);
      setTitle(data.title);
      setLoading(false);
    } catch(err){
      setLoading(false);
      console.error(err);
      window.alert("Invalid Mint Address!!");
      return;
    }
  }

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
    <div className="flex flex-col md:min-h-screen">
      {loading && <LoadingScreen subtext={loadingText}/>}

      <div className="flex-1 flex flex-col md:flex-row items-center md:items-start md:justify-center gap-8 md:p-8">
        <div className="w-full max-w-2xl">
          <div className="card md:p-10" ref={form}>
            {showForm && (
              <div className="space-y-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gradient bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                  Sell/Resell Token
                </h1>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Mint Address</label>
                  <input
                    type="text"
                    value={mint}
                    onChange={(e) => setMint(e.target.value)}
                    className="input-field"
                    placeholder="Enter token mint address"
                    maxLength={45}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Label</label>
                  <input
                    type="text"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    className="input-field"
                    placeholder="Enter a label"
                    maxLength={30}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea-field"
                    rows={3}
                    placeholder="Enter a description"
                    maxLength={143}
                  />
                  <p className="text-xs text-[var(--text-secondary)] mt-1">
                    {description.length}/143 characters
                  </p>
                </div>

                <div className="bg-[var(--card-bg)] rounded-xl p-4 border border-[var(--border-color)]">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-[var(--text-color)]">
                        Take commission
                      </label>
                      <FaInfoCircle className="text-[var(--text-secondary)] cursor-pointer info-icon" />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="yes"
                          checked={takeCommission === "yes"}
                          onChange={(e) => setTakeCommission(e.target.value as CommissionType)}
                          className="accent-[var(--accent-primary)]"
                        />
                        <span className="text-[var(--text-color)]">Yes</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          value="no"
                          checked={takeCommission === "no"}
                          onChange={(e) => setTakeCommission(e.target.value as CommissionType)}
                          className="accent-[var(--accent-primary)]"
                        />
                        <span className="text-[var(--text-color)]">No</span>
                      </label>
                    </div>
                  </div>

                  {takeCommission === "yes" && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2 text-[var(--text-secondary)]">
                        Commission Percentage (max 1%)
                      </label>
                      <input
                        type="number"
                        value={percentage}
                        onChange={(e) => {
                          const value = Math.min(1, parseFloat(e.target.value) || 0);
                          setPercentage(value);
                        }}
                        className="input-field"
                        placeholder="Enter commission percentage"
                        max={1}
                        min={0}
                        step={0.01}
                        disabled={takeCommission === "no"}
                      />
                    </div>
                  )}
                </div>

                {publicKey ? (
                  <button
                    className="button-primary w-full mt-4 flex items-center justify-center gap-2"
                    onClick={showPreview ? handlePreview : handleSubmit}
                    disabled={!connected}
                  >
                    {showPreview ? 'Preview Blink' : 'Generate Blink'}
                  </button>
                ) : (
                  <div className="mt-4 text-center">
                    <p className="text-[var(--text-secondary)] mb-3">Connect your wallet to generate a Blink</p>
                    <WalletButton />
                  </div>
                )}
              </div>
            )}

            {!showForm && (
              <div className="space-y-6">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gradient bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                  Your Blink is Ready!
                </h1>

                <div className="p-4 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)]">
                  <p className="text-sm text-[var(--text-secondary)] mb-2">Blink Link:</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-[rgba(0,0,0,0.2)] rounded-lg text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                      https://dial.to/?action=solana-action:{blinkLink}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="p-3 rounded-lg bg-[var(--border-color)] hover:bg-[var(--accent-primary)] transition-colors duration-300"
                      title="Copy to clipboard"
                    >
                      {copied ? 'Copied!' : <HiOutlineClipboardCopy size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6">
                  <button
                    className="button-primary flex-1 flex items-center justify-center gap-2"
                    onClick={handleTweet}
                  >
                    <HiOutlineShare size={18} />
                    Share on X
                  </button>

                  <button
                    className="button-secondary flex-1 flex items-center justify-center gap-2"
                    onClick={handleNew}
                  >
                    <HiOutlinePlus size={18} />
                    Create New Blink
                  </button>
                </div>
              </div>
            )}
          </div>

          {blinkLink && showForm && (
            <div className="glass-card p-6 mt-6">
              <h2 className="text-xl font-semibold mb-4 text-gradient bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">
                Your Previous Blink
              </h2>

              <div className="p-3 bg-[var(--card-bg)] rounded-lg mb-4 border border-[var(--border-color)]">
                <a
                  href={`https://dial.to/?action=solana-action:${blinkLink}`}
                  target="_blank"
                  className="text-[var(--text-color)] hover:text-[var(--accent-primary)] transition-colors break-all"
                >
                  https://dial.to/?action=solana-action:{blinkLink}
                </a>
              </div>

              <div className="flex gap-3">
                <button
                  className="button-secondary flex items-center gap-2 py-2 px-4"
                  onClick={handleCopy}
                >
                  {copied ? 'Copied!' : <><HiOutlineClipboardCopy size={18} /> Copy</>}
                </button>
                <button
                  className="button-primary flex items-center gap-2 py-2 px-4"
                  onClick={handleTweet}
                >
                  <HiOutlineShare size={18} /> Tweet
                </button>
              </div>
            </div>
          )}
        </div>

        {showPreview && (
          <div className="w-full md:w-auto flex justify-center">
            <TokenPreview
              icon={icon || 'https://raw.githubusercontent.com/shubhiscoding/Blink-Generator/main/web/public/solana.jpg'}
              label={label || 'Your Label'}
              description={description || 'Your Description shows up here, Keep it short and simple'}
              title={title || "Your Title"}
            />
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
