import clientPromise from "@/lib/mongodb";
import { ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, createPostResponse, NextAction } from "@solana/actions";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { sign } from "crypto";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: Request) => {
  return NextResponse.json({message: "You Won't Get it!! Try POSTING!!"}, {
    headers: ACTIONS_CORS_HEADERS,
  });
};

export const OPTIONS = GET;

export const POST = async (req: NextRequest, {params}:{params:{uniqueid: string}}) => {
  try {
    const {uniqueid} = params;
    const client = await clientPromise;
    const db = client.db("Cluster0");

    let blinkData;
    if(ObjectId.isValid(uniqueid)){
      blinkData = await db.collection("blinks").findOne({_id: new ObjectId(uniqueid)});
    }

    const {searchParams} = new URL(req.url);
    const body: ActionPostRequest = await req.json();

    let Sendamount = searchParams.get('amount');
    const UserBet = searchParams.get('bet');

    console.log("-----------------Amount-----------------");
    console.log(Sendamount, UserBet);

    if(!blinkData || !blinkData.privateKey || !Sendamount || !blinkData.wallet){
      return NextResponse.json({"message":"INVALID BLINK!!"}, {status: 404})
    }

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw "Invalid 'account' provided. It's not a real pubkey";
    }

    const privateKeyUint8Array = Uint8Array.from(Object.values(blinkData?.privateKey));
    const wallet = Keypair.fromSecretKey(privateKeyUint8Array);
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    const randomNumber = Math.floor(Math.random() * 11);

    //Bet logic here

    const walletTnx = new Transaction();
    let result ="";
    console.log(randomNumber);
    let totalLamports = 0;

    if(UserBet == '5'){
      if(randomNumber < 5){
        walletTnx.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: account,
            lamports: (parseFloat(Sendamount)*2)*LAMPORTS_PER_SOL -100000
          })
        );
        totalLamports += (parseFloat(Sendamount)*2)*LAMPORTS_PER_SOL-100000;
        result += `number is ${randomNumber}! You Won!!`
      }else if(randomNumber == 5){
        walletTnx.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: account,
            lamports: (parseFloat(Sendamount))*LAMPORTS_PER_SOL-100000
          })
        );
        walletTnx.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(blinkData.wallet),
            lamports: (parseFloat(Sendamount))*LAMPORTS_PER_SOL-100000
          })
        );
        totalLamports += (parseFloat(Sendamount))*LAMPORTS_PER_SOL-100000;
        totalLamports += (parseFloat(Sendamount))*LAMPORTS_PER_SOL-100000;
        result += `number is 5! It's a Tie!!`
      }else {
        walletTnx.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(blinkData.wallet),
            lamports: (parseFloat(Sendamount)*2)*LAMPORTS_PER_SOL-100000
          })
        );
        totalLamports += (parseFloat(Sendamount)*2)*LAMPORTS_PER_SOL-100000;
        result += `number is ${randomNumber}! You Lost!!`
      }
    }else {
      if(randomNumber > 5){
        walletTnx.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: account,
            lamports: (parseFloat(Sendamount)*2)*LAMPORTS_PER_SOL-100000
          })
        );
        totalLamports += (parseFloat(Sendamount)*2)*LAMPORTS_PER_SOL-100000;
        result += `number is ${randomNumber}! You Won!!`
      }else if(randomNumber == 5){
        walletTnx.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: account,
            lamports: (parseFloat(Sendamount))*LAMPORTS_PER_SOL-100000
          })
        );
        totalLamports += (parseFloat(Sendamount))*LAMPORTS_PER_SOL-100000;
        walletTnx.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(blinkData.wallet),
            lamports: (parseFloat(Sendamount))*LAMPORTS_PER_SOL-100000
          })
        );
        totalLamports += (parseFloat(Sendamount))*LAMPORTS_PER_SOL-100000;
        result += `number is 5! It's a Tie!!`
      }else {
        walletTnx.add(
          SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(blinkData.wallet),
            lamports: (parseFloat(Sendamount)*2)*LAMPORTS_PER_SOL-100000
          })
        );
        totalLamports += (parseFloat(Sendamount)*2)*LAMPORTS_PER_SOL-100000;
        result += `number is ${randomNumber}! You Lost!!`
      }
    }


    console.log(result);
    console.log(walletTnx);
    const bal = (await connection.getBalance(wallet.publicKey));
    console.log(`Total transaction value in Lamports: ${totalLamports/LAMPORTS_PER_SOL}`, "my balance", bal/LAMPORTS_PER_SOL, "gas money: ", ((bal) - (totalLamports))/LAMPORTS_PER_SOL);

    const {blockhash, lastValidBlockHeight} = await connection.getLatestBlockhash();

    walletTnx.feePayer = wallet.publicKey;
    walletTnx.recentBlockhash = blockhash;

    const sig = await connection.sendTransaction(walletTnx,[wallet]);

    console.log("-------------------Finishing The Game-----------------")
    console.log(sig);

    await connection.confirmTransaction({
      signature: sig,
      blockhash,
      lastValidBlockHeight
    });

    Sendamount = '0';
    console.log("--------------------Send Tnx----------------------------");

    const balance = await connection.getBalance(wallet.publicKey);
    const nextAction: NextAction ={
      type: "action",
      icon: 'https://www.pianobook.co.uk/wp-content/uploads/2022/02/banner-1-1024x576.jpeg',
      label: 'Roll The Dice',
      description: 'Gamble on the dice',
      title: blinkData.title,
      links:{
        actions: [
          {
            href: `/api/actions/testGamble/${uniqueid}?amount={amount}&bet={Bet}`,
            label: `${result}, Place Bet Again!`,
            parameters: [
              {
                type: "radio",
                name: "Bet",
                label: "Select Your Bet",
                options: [
                  {
                    label: "More then 5",
                    value: "10",
                    selected: true
                  },
                  {
                    label: "Less then 5",
                    value: "5",
                    selected: false
                  }
                ]
              },
              {
                type: "number",
                name: "amount",
                label: "Enter amount",
                max: (balance-1250000)/LAMPORTS_PER_SOL,
                min: 0.01,
              },
            ],
          }
        ]
      }
    }


    const signEmptyMsg = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: wallet.publicKey,
        lamports: 100
      })
    );

    signEmptyMsg.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;
    signEmptyMsg.feePayer = account;

    // Create the payload with house transaction
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction: signEmptyMsg,
        message: result,
        links:{
          next:{
            action: nextAction,
            type: 'inline'
          }
        }
      },
    });

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS
    });
  } catch (err) {
    console.log("Error in GamePlay!!",err);
    return NextResponse.json(
      {
        message: err instanceof Error ? err.message : String(err),
      },
      {
        status: 500,
        headers: ACTIONS_CORS_HEADERS,
      },
    );
  }
}
