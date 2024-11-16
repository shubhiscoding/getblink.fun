"use client";
import { useState, useRef, useEffect, use } from 'react';
import './page.css';
import '../../components/form/form.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/solana-provider';
import Preview from "@/components/preview/preview";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  Connection,
  clusterApiUrl
} from '@solana/web3.js';
import { FaInfoCircle } from 'react-icons/fa';

import LoadingScreen from '@/components/Loading/loading';

export default function Page() {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [icon, setIcon] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [percentage, setPercentage] = useState<number>(0);
  const [takeCommission, setTakeCommission] = useState<string>("no");
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
    const infoCard = document.querySelector('.radio-container')?.querySelector('label')?.querySelector('svg');

    const handleClick = () => {
      console.log('clicked');
      window.alert("If you opt to take a commission, the specified percentage of the total transaction amount will be credited to your wallet. Please note that the maximum commission percentage allowed is 1%.");
    };

    if (infoCard) {
      infoCard.addEventListener('click', handleClick);
      console.log('added');
    }

    return () => {
      if (infoCard) {
        infoCard.removeEventListener('click', handleClick);
      }
    };
  }, []);

  useEffect(()=>{
      setShowPreview(true);
  }, [mint]);

  useEffect(()=>{
    if(takeCommission === "no"){
      setPercentage(0);
    }
  }, [takeCommission]);

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingText('Waiting for Transaction confirmation!!');
    try {
      const connection = new Connection(process.env.SOLANA_RPC || clusterApiUrl("mainnet-beta"));

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
        if (form.current) {
          form.current.style.padding = '70px';
        }

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
      setShowPreview(false);
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
      form.current.style.padding = '120px';
    }
  };


  return (
    <div className='main'>
      {loading && <LoadingScreen subtext={loadingText}/>}
      <div className="customize-form">
        <div className="form" ref={form}>
          {showForm && <h1 className="gradient-text">Customize Your Blink</h1>}
          {showForm && (
            <div className="form-group">
              <input
                type="text"
                value={mint}
                onChange={(e) => setMint(e.target.value)}
                className="form-input"
                placeholder="Mint Address"
                maxLength={45}
              />
            </div>
          )}
          {showForm && (
            <div className="form-group">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="form-input"
                placeholder="Label"
                maxLength={30}
              />
            </div>
          )}
          {showForm && (
            <div className="form-group">
              <div className='radio-container'>
                <label>Take commission: <FaInfoCircle /></label>
                <div className='radio'>
                  <label>
                    <input
                      type="radio"
                      value="yes"
                      checked={takeCommission === "yes"}
                      onChange={(e) => setTakeCommission(e.target.value)}
                    />
                    Yes
                  </label>
                  <label>
                    <input
                      type="radio"
                      value="no"
                      checked={takeCommission === "no"}
                      onChange={(e) => setTakeCommission(e.target.value)}
                    />
                    No
                  </label>
                </div>
              </div>
               <input
                type="number"
                value={percentage}
                onChange={(e) => {
                  if (takeCommission === "yes") {
                    const value = Math.min(1, parseFloat(e.target.value) || 0);
                    setPercentage(value);
                  }
                }}
                className="form-input"
                placeholder="Commission Percentage"
                max={1}
                min={0}
                step={0.01}
                maxLength={30}
                disabled={takeCommission === "no"}
              />
            </div>
          )}
          {showForm && (
            <div className="form-group">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Description"
                maxLength={143}
              />
            </div>
          )}
          {showForm && publicKey ? (
           <button className="submit-button" onClick={showPreview ? handlePreview: handleSubmit} disabled={!connected}>
            {showPreview ?  'Preview Blink' : 'Generate Blink'}
          </button>
          ) : (
            showForm && <WalletButton />
          )}
          {blinkLink && !showForm && (
            <div className="blink-box">
              <h2>Your Blink Link:</h2>
              <div className="link-container">
                <a href={`https://dial.to/?action=solana-action:${blinkLink}`} target="_blank" className="link">
                  https://dial.to/?action=solana-action:{blinkLink}
                </a>
              </div>
              <div className="button-container">
                {copied ? (
                  <span className="copy-message">Copied!</span>
                ) : (
                  <button className="copy-button" onClick={handleCopy}>
                    Copy
                  </button>
                )}
                <button className="tweet-button" onClick={handleTweet}>
                  Tweet
                </button>
                <button className="new-button" onClick={handleNew}>
                  Create New
                </button>
              </div>
            </div>
          )}
        </div>
        {blinkLink && showForm && (
            <div className="blink-box">
              <h2>Your Blink Link:</h2>
              <div className="link-container">
                <a href={`https://dial.to/?action=solana-action:${blinkLink}`} target="_blank" className="link">
                  https://dial.to/?action=solana-action:{blinkLink}
                </a>
              </div>
              <div className="button-container">
                {copied ? (
                  <span className="copy-message">Copied!</span>
                ) : (
                  <button className="copy-button" onClick={handleCopy}>
                    Copy
                  </button>
                )}
                <button className="tweet-button" onClick={handleTweet}>
                  Tweet
                </button>
              </div>
            </div>
          )}
      </div>
      <div className='BlinksContainer'>
          <Preview
            icon={icon || 'https://raw.githubusercontent.com/shubhiscoding/Blink-Generator/main/web/public/solana.jpg'}
            label={label || 'Your Label'}
            description={description || 'Your Description shows up here, Keep it short and simple'}
            title={title || "Your Tittle : )"}
          />
      </div>
    </div>
  );
}
