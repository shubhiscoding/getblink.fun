"use client";
import { useWallet } from "@solana/wallet-adapter-react";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, SystemProgram, Transaction } from "@solana/web3.js";
import Form from "@/components/GamebleForm/gambleform";
import Preview from "@/components/GamblePreview/gamblePreview";
import { useState } from "react";

export default function Page(){
  const [title, setTitle] = useState<string>('');
  const [balance, setBalance] = useState<number>();
  const { publicKey, sendTransaction } = useWallet();
  const icon = "https://logicalfact.in/wp-content/uploads/2024/02/Screenshot-2024-02-13-124229.png";
  const label = "Roll The Dice";
  const description = "Choose your bet and amount to gamble and once you place the bet, a number will be generated between 1-10 and based on your bet you will win or lose the amount!!";

  const allLogic = async () =>{
    try {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const wallet = Keypair.generate();

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
    <div className="main">
      <Form title={title} setTitle={setTitle} balance={balance} setBalance={setBalance}/>
      <Preview icon={icon} label="" description={description} title={title || "Roll The Number"}/>
    </div>
  );
}
