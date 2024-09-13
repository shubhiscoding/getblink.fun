"use client";
import { useState, useRef } from 'react';
import './page.css';
import '../../components/form/form.css';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletButton } from '@/components/solana/solana-provider';
import Preview from "@/components/preview/preview";

export default function Page() {
  const { publicKey, connected } = useWallet();
  const [icon, setIcon] = useState<string>('');
  const [label, setLabel] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [mint, setMint] = useState<string>('');
  const [showPreview, setShowPreview] = useState(true);

  const [showForm, setShowForm] = useState(true);
  const [blinkLink, setBlinkLink] = useState('');
  const [copied, setCopied] = useState(false);
  const form = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async () => {
    if (!connected || !publicKey) {
      console.error('Wallet not connected');
      return;
    }

    if (!label || !description || !mint) {
      console.error('Please fill all fields');
      window.alert('Please fill all fields');
      return;
    }

    const walletAddress = publicKey.toString();

    const response = await fetch('/api/actions/generate-blink/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        label,
        description,
        wallet: walletAddress,
        mint
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate blink');
    }

    const data = await response.json();
    setBlinkLink(data.blinkLink);
    setShowForm(false);

    if (form.current) {
      form.current.style.padding = '70px';
    }
  };

  const handlePreview = async () => {
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
      throw new Error('Failed to generate blink');
    }

    const data = await response.json();
    setShowPreview(false);
    setIcon(data.icon);
    setTitle(data.title);
  }

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

  const handleNew = () => {
    setShowForm(true);
    if (form.current) {
      form.current.style.padding = '120px';
    }
  };


  return (
    <div className='main-container'>
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
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-textarea"
                rows={3}
                placeholder="Description"
                maxLength={150}
              />
            </div>
          )}
          {showForm && publicKey ? (
            <button className="submit-button" onClick={handlePreview} disabled={!connected}>
              Generate Blink
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
