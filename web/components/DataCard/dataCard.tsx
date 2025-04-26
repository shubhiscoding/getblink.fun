"use client";
import { useState } from "react";
import { HiOutlineClipboardCopy, HiOutlineShare } from 'react-icons/hi';

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
      setTimeout(() => setCopied(false), 1500);
    };

    const handleTweet = () => {
      const tweetText = `Check out this Blink I just made @getblinkdotfun: ${base}${blinkLink}`;
      const twitterUrl = `https://X.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      window.open(twitterUrl, '_blank');
    };

    return (
      <div className="glass-card p-4 sm:p-5 md:p-6">
        <h2 className="text-lg sm:text-xl font-semibold mb-3 gradient-text">
          {title}
        </h2>
        
        <div className="p-3 bg-[var(--card-bg)] rounded-lg mb-4 border border-[var(--border-color)] transition-all duration-300 hover:border-[var(--accent-primary)] group">
          <a 
            href={`${base}${blinkLink}`} 
            target="_blank" 
            className="text-[var(--text-color)] group-hover:text-[var(--accent-primary)] transition-all duration-300 break-all text-sm sm:text-base"
            rel="noopener noreferrer"
          >
            {base}{base.includes("devnet") ? blinkLink.slice(0, -9)+"..." : blinkLink}
          </a>
        </div>
        
        <div className="flex gap-2 sm:gap-3 flex-wrap sm:flex-nowrap">
          <button
            className="button-secondary text-sm py-2 px-3 sm:px-4 transition-all duration-300"
            onClick={handleCopy}
            aria-label="Copy link"
          >
            {copied ? (
              <span className="fade-in">Copied!</span>
            ) : (
              <span className="flex items-center">
                <HiOutlineClipboardCopy size={16} /> 
                <span className="ml-1">Copy</span>
              </span>
            )}
          </button>
          <button
            className="button-primary text-sm py-2 px-3 sm:px-4 transition-all duration-300"
            onClick={handleTweet}
            aria-label="Share on Twitter"
          >
            <HiOutlineShare size={16} /> 
            <span className="ml-1">Tweet</span>
          </button>
        </div>
      </div>
    );
}

export default DataCard;
