"use client";
import { useState } from "react";
import "../form/form.css";
import "../preview/preview.css";
interface DataProps {
  code: string;
  title: string;
  endpoint: string;
}

const DataCard: React.FC<DataProps> = ({ code, title, endpoint }) => {
    const [copied, setCopied] = useState(false);
    const blinkLink = `https://www.getblink.fun/api/actions/${endpoint}/${code}`;

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

    return (
      <div className="blink-box">
        <h2>{title}:</h2>
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
    );
}

export default DataCard;
