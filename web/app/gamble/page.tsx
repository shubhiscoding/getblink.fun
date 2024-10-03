"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";

export default function Page(){
  const { publicKey, sendTransaction } = useWallet();
  console.log("IS IT RUNNING!!");
  const allLogic = async () =>{
    console.log("start logic!!");
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const wallet = Keypair.generate();
      console.log(wallet.publicKey);
      if(!publicKey || !wallet.publicKey){
        throw new Error("Connect The Damn Wallet!!");
      }
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey:publicKey,
          toPubkey: wallet.publicKey,
          lamports: (0.01*LAMPORTS_PER_SOL)+1250000
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
          title: 'Test101'
        }),
      });

      if (!response.ok) {
        console.log(response);
        throw new Error('Failed to generate blink');
      }
      const data = await response.json();
      console.log(data.blinkLink);
    } catch (error) {
      console.log(error);
    }
  }
  return(
    <div className="gamble">
      <button onClick={allLogic}>Get The Blink!!</button>
    </div>
  );
}
