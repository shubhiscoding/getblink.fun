"use client";
import { useState } from "react";
import "../form/form.css";
import "../preview/preview.css";
interface DataProps {
  base: string;
  code: string;
  title: string;
  endpoint: string;
}

const DataCard: React.FC<DataProps> = ({ base, code, title, endpoint }) => {
    const [copied, setCopied] = useState(false);
    const blinkLink = `https://www.getblink.fun/api/actions/${endpoint}/${code}`;

    const handleCopy = () => {
      navigator.clipboard.writeText(`${base}${blinkLink}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    };

    const handleTweet = () => {
      const tweetText = `Check out this Blink I just made @getblinkdotfun: ${base}${blinkLink}`;
      const twitterUrl = `https://X.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(twitterUrl, '_blank');
    };

    return (
      <div className="blink-box">
        <h2>{title}:</h2>
        <div className="link-container">
          <a href={`${base}${blinkLink}`} target="_blank" className="link">
          {base}{base.includes("devnet") ? blinkLink.slice(0, -9)+"..." : blinkLink}
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
