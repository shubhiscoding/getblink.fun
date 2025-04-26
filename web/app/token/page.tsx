"use client";
import { useState, useRef, useEffect } from 'react';
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
import { Footer } from '@/components/footer';
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
    const infoCard = document.querySelector('.info-icon');

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
        if (form.current) {
          form.current.className = form.current.className.replace('p-[120px]', 'p-[70px]');
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
      form.current.className = form.current.className.replace('p-[70px]', 'p-[120px]');
    }
  };


  return (
    <>
    <div className='flex-grow flex justify-center p-5 gap-5'>
      {loading && <LoadingScreen subtext={loadingText}/>}
      <div className="flex flex-col justify-between rounded-2xl px-0 md:px-5 w-fit">
        <div className="p-[120px] rounded-[50px] backdrop-blur-[20px] saturate-[138%] shadow-[inset_0px_0px_20px_rgba(255,255,255,0.15)] bg-[rgba(17,25,40,0)] text-white font-sans md:p-5 sm:p-2.5" ref={form}>
          {showForm && <h1 className="text-3xl md:text-[3rem] font-bold mb-2.5 text-[#989898]">Customize Your Blink</h1>}
          {showForm && (
            <div className="flex justify-between mb-5 md:flex-col">
              <input
                type="text"
                value={mint}
                onChange={(e) => setMint(e.target.value)}
                className="w-full p-3 max-w-[900px] bg-black shadow-[0_3px_10px_rgba(0,0,0,1)] border border-[var(--border-color)] rounded-full text-[#bbbdbd] text-base"
                placeholder="Mint Address"
                maxLength={45}
              />
            </div>
          )}
          {showForm && (
            <div className="flex justify-between mb-5 md:flex-col">
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full p-3 max-w-[900px] bg-black shadow-[0_3px_10px_rgba(0,0,0,1)] border border-[var(--border-color)] rounded-full text-[#bbbdbd] text-base"
                placeholder="Label"
                maxLength={30}
              />
            </div>
          )}
          {showForm && (
            <div className="flex justify-between mb-5 md:flex-col">
              <div className='min-w-[150px] flex flex-col justify-between ml-2.5 mr-[30px] text-[#c6c6c6] md:flex-row md:justify-start md:min-w-0'>
                <label className="flex gap-0.5 items-center">
                  Take commission: <FaInfoCircle className="text-[#b2b2b2] cursor-pointer info-icon" />
                </label>
                <div className='flex justify-between md:ml-2.5 md:min-w-[90px]'>
                  <label className="flex gap-0.5 items-center">
                    <input
                      type="radio"
                      value="yes"
                      checked={takeCommission === "yes"}
                      onChange={(e) => setTakeCommission(e.target.value)}
                      className="cursor-pointer"
                    />
                    Yes
                  </label>
                  <label className="flex gap-0.5 items-center">
                    <input
                      type="radio"
                      value="no"
                      checked={takeCommission === "no"}
                      onChange={(e) => setTakeCommission(e.target.value)}
                      className="cursor-pointer"
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
                className="w-full p-3 max-w-[900px] bg-black shadow-[0_3px_10px_rgba(0,0,0,1)] border border-[var(--border-color)] rounded-full text-[#bbbdbd] text-base disabled:opacity-50"
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
            <div className="flex justify-between mb-5 md:flex-col">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 max-w-[900px] bg-black shadow-[0_3px_10px_rgba(0,0,0,1)] border border-[var(--border-color)] rounded-[30px] text-[#bbbdbd] text-base resize-none min-h-[20px]"
                rows={3}
                placeholder="Description"
                maxLength={143}
              />
            </div>
          )}
          {showForm && publicKey ? (
           <button 
            className="bg-white text-[var(--bg-color)] border-none py-3 px-5 rounded-full font-bold cursor-pointer transition-colors duration-1000 shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_10px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent md:py-2.5 md:px-4 md:text-[0.9rem] sm:py-2 sm:px-3 sm:text-[0.8rem]" 
            onClick={showPreview ? handlePreview: handleSubmit} 
            disabled={!connected}
           >
            {showPreview ?  'Preview Blink' : 'Generate Blink'}
          </button>
          ) : (
            showForm && <WalletButton />
          )}
          {blinkLink && !showForm && (
            <div className="w-fit flex flex-col mt-5 p-[30px] rounded-[50px] shadow-[inset_0px_0px_20px_rgba(255,255,255,0.15)] backdrop-blur-[20px] saturate-[138%] bg-[rgba(17,25,40,0)] text-white font-sans max-w-[700px]">
              <h2 className="text-xl font-bold mb-2">Your Blink Link:</h2>
              <div className="flex items-center mt-2 flex-wrap gap-2">
                <a href={`https://dial.to/?action=solana-action:${blinkLink}`} target="_blank" className="py-[3px] px-2.5 rounded-full text-white break-all bg-black/30">
                  https://dial.to/?action=solana-action:{blinkLink}
                </a>
              </div>
              <div className="flex gap-[15px] mt-[5px]">
                {copied ? (
                  <span className="text-[var(--accent-green)]">Copied!</span>
                ) : (
                  <button 
                    className="w-full max-w-[100px] border-none py-2 px-3 rounded-full text-[0.9rem] cursor-pointer bg-white text-[var(--bg-color)] shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_5px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent md:py-2.5 md:px-4 md:text-[0.9rem] sm:py-2 sm:px-3 sm:text-[0.8rem]" 
                    onClick={handleCopy}
                  >
                    Copy
                  </button>
                )}
                <button 
                  className="w-full max-w-[100px] border-none py-2 px-3 rounded-full text-[0.9rem] cursor-pointer bg-white text-[var(--bg-color)] shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_5px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent md:py-2.5 md:px-4 md:text-[0.9rem] sm:py-2 sm:px-3 sm:text-[0.8rem]" 
                  onClick={handleTweet}
                >
                  Tweet
                </button>
                <button 
                  className="w-full max-w-[110px] border-none py-2 px-3 rounded-full text-[0.9rem] cursor-pointer bg-white text-[var(--bg-color)] shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_5px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent md:py-2.5 md:px-4 md:text-[0.9rem] sm:py-2 sm:px-3 sm:text-[0.8rem]" 
                  onClick={handleNew}
                >
                  Create New
                </button>
              </div>
            </div>
          )}
        </div>
        {blinkLink && showForm && (
            <div className="w-fit flex flex-col mt-5 p-[30px] rounded-[50px] shadow-[inset_0px_0px_20px_rgba(255,255,255,0.15)] backdrop-blur-[20px] saturate-[138%] bg-[rgba(17,25,40,0)] text-white font-sans">
              <h2 className="text-xl font-bold mb-2">Your Blink Link:</h2>
              <div className="flex items-center mt-2 flex-wrap gap-2">
                <a href={`https://dial.to/?action=solana-action:${blinkLink}`} target="_blank" className="py-[3px] px-2.5 rounded-full text-white break-all bg-black/30">
                  https://dial.to/?action=solana-action:{blinkLink}
                </a>
              </div>
              <div className="flex gap-[15px] mt-[5px]">
                {copied ? (
                  <span className="text-[var(--accent-green)]">Copied!</span>
                ) : (
                  <button 
                    className="w-full max-w-[100px] border-none py-2 px-3 rounded-full text-[0.9rem] cursor-pointer bg-white text-[var(--bg-color)] shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_5px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent md:py-2.5 md:px-4 md:text-[0.9rem] sm:py-2 sm:px-3 sm:text-[0.8rem]" 
                    onClick={handleCopy}
                  >
                    Copy
                  </button>
                )}
                <button 
                  className="w-full max-w-[100px] border-none py-2 px-3 rounded-full text-[0.9rem] cursor-pointer bg-white text-[var(--bg-color)] shadow-[0_3px_10px_rgba(0,0,0,1)] hover:backdrop-blur-[20px] hover:saturate-[138%] hover:shadow-[inset_0px_0px_5px_rgba(255,255,255,0.1)] hover:bg-[rgba(17,25,40,0)] hover:bg-gradient-to-l hover:from-[#c0c0c0] hover:via-white hover:to-[#c0c0c0] hover:bg-clip-text hover:text-transparent md:py-2.5 md:px-4 md:text-[0.9rem] sm:py-2 sm:px-3 sm:text-[0.8rem]" 
                  onClick={handleTweet}
                >
                  Tweet
                </button>
              </div>
            </div>
        )}
      </div>
      {!showPreview && (
        <Preview
          icon={icon || 'https://raw.githubusercontent.com/shubhiscoding/Blink-Generator/main/web/public/solana.jpg'}
          label={label || 'Your Label'}
          description={description || 'Your Description shows up here, Keep it short and simple'}
          title={title || "Your Tittle : )"}
        />
      )}
    </div>
    <Footer />
    </>
  );
}
