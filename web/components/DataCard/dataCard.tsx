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
      <div className="glass-card p-6 mb-4">
        <h2 className="text-xl font-semibold mb-3 text-gradient bg-gradient-to-r from-[var(--gradient-start)] to-[var(--gradient-end)] bg-clip-text text-transparent">{title}</h2>
        <div className="p-3 bg-[var(--card-bg)] rounded-lg mb-4 border border-[var(--border-color)]">
          <a href={`${base}${blinkLink}`} target="_blank" className="text-[var(--text-color)] hover:text-[var(--accent-primary)] transition-colors break-all">
            {base}{base.includes("devnet") ? blinkLink.slice(0, -9)+"..." : blinkLink}
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
    );
}

export default DataCard;
