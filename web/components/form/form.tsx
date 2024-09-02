'use client';

import React, { useState } from 'react';
import './form.css';
import { useWallet } from '@solana/wallet-adapter-react';

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

  const handlePreview = async () => {
    if (!connected || !publicKey) {
      console.error('Wallet not connected');
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
        </button>):(<h4>Please Connect A Wallet</h4>)}
      </div>
      {blinkLink && <div className="blink">
        Your Blink Link: <a href={`https://dial.to/?action=solana-action:${blinkLink}`}>https://dial.to/?action=solana-action:{blinkLink}</a>
      </div>}
    </div>
  );
};

export default Form;
