'use client';

import React, { useState } from 'react';
import './form.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '../solana/solana-provider';

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

const Form: React.FC<FormProps> = ({ icon, setIcon, label, setLabel, description, setDescription, title, setTitle }) => {
  const { publicKey, connected } = useWallet();
  const [blinkLink, setBlinkLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handlePreview = async () => {
    if (!connected || !publicKey) {
      console.error('Wallet not connected');
      return;
    }

    if(!icon || !label || !description || !title) {
      console.error('Please fill all fields');
      window.alert('Please fill all fields');
      return;
    }

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
        wallet: walletAddress
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate blink');
    }

    const data = await response.json();
    setBlinkLink(data.blinkLink);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://dial.to/?action=solana-action:${blinkLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleTweet = () => {
    const tweetText = `Check out this Blink I just made: https://dial.to/?action=solana-action:${blinkLink}`;
    const twitterUrl = `https://X.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <div className="customize-form">
      <h1 className="gradient-text">Customize Your Blink</h1>
      <div className="form">
        <div className="form-group">
          <label className="form-label">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-input"
            placeholder='Enter the title of your blink'
          />
        </div>
        <div className="form-group">
          <label className="form-label">Label:</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="form-input"
            placeholder='Enter the label of your blink'
          />
        </div>
        <div className="form-group">
          <label className="form-label">Icon URL:</label>
          <input
            type="text"
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="form-input"
            placeholder='Enter the icon URL of your blink'
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="form-textarea"
            rows={3}
            placeholder='Enter the description of your blink'
          />
        </div>
        {publicKey? (<button className="submit-button" onClick={handlePreview} disabled={!connected}>
          Generate Blink
        </button>):( <WalletButton />)}
      </div>
      {blinkLink &&(
        <div className="blink-box">
          <span>Your Blink Link: </span>
          <div className="link-container">
            <a href={`https://dial.to/?action=solana-action:${blinkLink}`} target='_blank' className="link">
              https://dial.to/?action=solana-action:{blinkLink}
            </a>
            {copied?(<span className="copy-message">Copied!</span>):
             (<button className="copy-button" onClick={handleCopy}>
              Copy
              </button>)
            }
            <button className="tweet-button" onClick={handleTweet}>
              Tweet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
