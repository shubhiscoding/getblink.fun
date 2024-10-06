import clientPromise from "@/lib/mongodb";
import { ActionGetResponse, ActionPostRequest, ActionPostResponse, ACTIONS_CORS_HEADERS, CompletedAction, createPostResponse, NextAction } from "@solana/actions";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}:{params: {uniqueid: string}}) =>{
  try {
    const { uniqueid } = params;
    const client = await clientPromise;
    const db = client.db("Cluster0");

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    let blinkData;
    if(ObjectId.isValid(uniqueid)){
      blinkData = await db.collection("blinks").findOne({_id: new ObjectId(uniqueid)});
    }

    const privateKeyUint8Array = Uint8Array.from(Object.values(blinkData?.privateKey));
    const wallet = Keypair.fromSecretKey(privateKeyUint8Array);
    const balance = await connection.getBalance(wallet.publicKey);

    if(!blinkData){
      blinkData = {title: "Gamble"};
    }

    const payload: ActionGetResponse = {
      icon: 'https://logicalfact.in/wp-content/uploads/2024/02/Screenshot-2024-02-13-124229.png',
      label: 'Roll The Dice',
      description: 'Choose your bet and amount to gamble and once you place the bet, a number will be generated between 1-10 and based on your bet you will win or lose the amount!!',
      title: blinkData.title,
      links: {
        actions: [
          {
            href: `/api/actions/gamble/${uniqueid}?amount={amount}&bet={Bet}`,
            label: `Place Bet`,
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
    console.log("---------------------------------------------------------------Got Till Here!!");

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export const OPTIONS = GET;

export const POST = async (req: NextRequest, {params}:{params:{uniqueid: string}}) => {
  try {
    console.log("POST REQUEST!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1111");
    const {uniqueid} = params;
    const client = await clientPromise;
    const db = client.db("Cluster0");

    let blinkData;
    if(ObjectId.isValid(uniqueid)){
      blinkData = await db.collection("blinks").findOne({_id: new ObjectId(uniqueid)});
    }

    const {searchParams} = new URL(req.url);
    const body: ActionPostRequest = await req.json();

    const amount = searchParams.get('amount');
    const bet = searchParams.get('bet');

    if(!blinkData || !blinkData.privateKey || !amount || !blinkData.wallet){
      return NextResponse.json({"message":"INVALID BLINK!!"}, {status: 404})
    }
    const privateKeyUint8Array = Uint8Array.from(Object.values(blinkData?.privateKey));

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw "Invalid 'account' provided. It's not a real pubkey";
    }

    const wallet = Keypair.fromSecretKey(privateKeyUint8Array);
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Create user's transaction
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account,
        toPubkey: wallet.publicKey,
        lamports: (parseFloat(amount))*LAMPORTS_PER_SOL,
      })
    );

    transaction.feePayer = account;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    // Create the payload with a next action link
    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        transaction,
        message: "Placing your bet...",
        links: {
          next: {
            href: `/api/actions/gamble/${uniqueid}/result?amount=${amount}&bet=${bet}`,
            type: 'post',
          },
        }
      },
    });

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS
    });
  } catch (err) {
    console.log(err);
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
