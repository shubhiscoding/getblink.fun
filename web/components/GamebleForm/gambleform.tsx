import { useRef, useState } from 'react';
import LoadingScreen from '../Loading/loading';
import { useWallet } from '@solana/wallet-adapter-react';
import "./gambleform.css";
import { WalletButton } from '../solana/solana-provider';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from '@solana/web3.js';

interface FormProps {
  title: string;
  setTitle: (value: string) => void;
  balance: number | undefined;
  setBalance: (value: number) => void;
}

const Form: React.FC<FormProps> = ({
  title,
  setTitle,
  balance,
  setBalance
}) => {
  const { publicKey, connected, sendTransaction } = useWallet();
  const [showForm, setShowForm] = useState(true);
  const [blinkLink, setBlinkLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if(!balance || balance < 0.01 || title.length< 1){
        window.alert("Balance can't be less than 0.01, and title can't be empty!!");
        throw new Error("Please Fill All The Fields!!");
      }
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const wallet = Keypair.generate();

      if(!publicKey || !wallet.publicKey){
        throw new Error("Connect The Damn Wallet!!");
      }

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey:publicKey,
          toPubkey: wallet.publicKey,
          lamports: (balance*LAMPORTS_PER_SOL)+1250000
        })
      )

      const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = publicKey;

      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction signed:', signature);

      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      });
      console.log('Transaction confirmed:', confirmation);

      const response = await fetch('/api/actions/generate-blink/gamble', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          privateKey: wallet.secretKey,
          wallet: publicKey,
          title: title
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to generate blink');
      }
      const data = await response.json();
      console.log(data.blinkLink);
      setBlinkLink(data.blinkLink);
      setShowForm(false);
      setLoading(false);
      if (form.current) {
        form.current.style.padding = '70px';
      }
    } catch (error) {
      setLoading(false);
      console.error('Error in handleSubmit:', error);
      window.alert('There was an issue generating your blink. Please try again.');
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://dial.to/devnet?action=solana-action:${blinkLink}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const handleTweet = () => {
    const tweetText = `Check out this Blink I just made @getblinkdotfun: https://dial.to/devnet?action=solana-action:${blinkLink}`;
    const twitterUrl = `https://X.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  const handleNew = () => {
    setShowForm(true);
    if (form.current) {
      form.current.style.padding = '120px';
    }
  };


  return(
    <div className="customize-form">
      {loading && <LoadingScreen subtext="Waiting For Transaction Confirmation!!" />}
      <div className="form" ref={form}>
        <h3>This is feature is currently in devnet only!!</h3>
        <br />
        {showForm && <h1 className="gradient-text">Customize Your Blink</h1>}
        {showForm && (
          <div className="form-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
              placeholder="Title"
              maxLength={50}
            />
          </div>
        )}
        {showForm && (
          <div className="form-group">
            <input
              type="number"
              value={balance}
              onChange={(e) => {
                  const value = parseFloat(e.target.value);
                  setBalance(value);
              }}
              className="form-input"
              placeholder="Set Your Casino's Balance"
              min={0}
              step={0.01}
              maxLength={30}
            />
          </div>
        )}
        {showForm && publicKey ? (
         <button className="submit-button" onClick={handleSubmit} disabled={!connected}>
          Generate Blink
        </button>
        ) : (
          showForm && <WalletButton />
        )}
        {blinkLink && !showForm && (
          <div className="blink-box">
            <h2>Your Blink Link:</h2>
            <div className="link-container">
              <a href={`https://dial.to/devnet?action=solana-action:${blinkLink}`} target="_blank" className="link">
                https://dial.to/devnet?action=solana-action:{blinkLink}
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
      {blinkLink && !showForm && (
          <div className="blink-box">
            <h2>Your Blink Link:</h2>
            <div className="link-container">
              <a href={`https://dial.to/devnet?action=solana-action:${blinkLink}`} target="_blank" className="link">
                https://dial.to/devnet?action=solana-action:{blinkLink}
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
  );
}

export default Form;
