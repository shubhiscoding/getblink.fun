import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { TREASURY_PUBKEY } from "@/lib/constant";
import {
  ActionGetResponse,
  ACTIONS_CORS_HEADERS,
  ActionPostRequest,
  createPostResponse,
  ActionPostResponse,
} from "@solana/actions";
import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

export const GET = async (req: NextRequest, { params }: { params: { uniqueid: string } }) => {
  try {
    const { uniqueid } = params;
    console.log('uniqueid', uniqueid);

    const client = await clientPromise;
    const db = client.db("Cluster0");
    // console.log(req.url.split('api/')[0]);
    let blinkData;
    if (ObjectId.isValid(uniqueid)) {
      blinkData = await db.collection("blinks").findOne({ _id: new ObjectId(uniqueid) });
    }

    // if(blinkData && blinkData.isPaid === false){
    //   return NextResponse.json(
    //     {
    //       message: "This blink is not paid for yet. Please pay to use it.",
    //     },
    //     {
    //       status: 403,
    //       headers: ACTIONS_CORS_HEADERS,
    //     },
    //   );
    // }

//     if (!blinkData) {
//       blinkData = {
//         icon: "http://localhost:3000/meteora.jpg",
//         label: "Open a JUP-USDC Position",
//         description: `**JUP-USDC Pool Information**

// - **Liquidity:** $16,6600000.048
// - **24h Volume:** $1,186.746
// - **APR:** 0.17%            **Bin Step:** 80
// - **Fee %:** 0.25%        **24h Fees:** $2.884

// **Token Pair**
// - **JUP:** JUPyiwrY...dZNsDvCN
// - **USDC:** EPjFWdd5...ZwyTDT1v
// `,
//         title: "Open a Position in JUP-USDC",
//       };
//     }
  if(!blinkData) {
    return NextResponse.json(
      {
        message: "This blink does not exist.",
      },
      {
        status: 404,
        headers: ACTIONS_CORS_HEADERS,
      },
    );
  }

    const blink_Description = `**${blinkData.poolName} Pool Information**
    - **Liquidity:** ${blinkData.Liquidity}
    - **24h Volume:** ${blinkData.Volume}
    - **APR:** ${blinkData.APR}            **Bin Step:** ${blinkData.BinStep}
    - **Fee %:** ${blinkData.Fee}        **24h Fees:** ${blinkData.DailyFee}
    **Token Pair**
    - **${blinkData.TokenXName}:** ${blinkData.mintX}
    - **${blinkData.TokenYName}:** ${blinkData.mintY}
    `;

    const payload: ActionGetResponse = {
      icon: blinkData.icon,
      label: `Open a ${blinkData.poolName} Position`,
      description: blink_Description,
      title: blinkData.title,
      links: {
        actions: [
          {
            href: `/api/actions/donate/${uniqueid}?amount=0.1`,
            label: "0.1 SOL",
            type: "post",
          },
          {
            href: `/api/actions/donate/${uniqueid}?amount=0.5`,
            label: "0.5 SOL",
            type: "post",
          },
          {
            href: `/api/actions/donate/${uniqueid}?amount=1.0`,
            label: "1.0 SOL",
            type: "post",
          },
          {
            href: `/api/actions/donate/${uniqueid}?amount={amount}`,
            label: "Send SOL",
            type: "post",
            parameters: [
              {
                name: "amount",
                label: "Enter a SOL amount",
              },
            ],
          },
        ],
      },
    };

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (error) {
    console.error("Error fetching blink data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};

export const OPTIONS = GET;

export const POST = async (req: NextRequest, { params }: { params: { uniqueid: string } }) => {
  try {
    const { uniqueid } = params;

    const client = await clientPromise;
    const db = client.db("Cluster0");

    let blinkData;
    if (ObjectId.isValid(uniqueid)) {
      blinkData = await db.collection("blinks").findOne({ _id: new ObjectId(uniqueid) });
    }

    if(blinkData && blinkData.isPaid === false){
      return NextResponse.json(
        {
          message: "This blink is not paid for yet. Please pay to use it.",
        },
        {
          status: 403,
          headers: ACTIONS_CORS_HEADERS,
        },
      );
    }

    const { searchParams } = new URL(req.url);
    const body: ActionPostRequest = await req.json();

    let account: PublicKey;
    try {
      account = new PublicKey(body.account);
    } catch (err) {
      throw "Invalid 'account' provided. It's not a real pubkey";
    }

    let amount: number = 0.1;
    const amountParam = searchParams.get("amount");
    if (amountParam) {
      try {
        amount = parseFloat(amountParam) || amount;
      } catch (err) {
        throw "Invalid 'amount' input";
      }
    }

    const SOLANA_RPC_URL = clusterApiUrl("mainnet-beta", false);
    if (!SOLANA_RPC_URL) throw "Unable to find RPC url...awkward...";
    const connection = new Connection(SOLANA_RPC_URL);

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: account,
        lamports: amount * LAMPORTS_PER_SOL,
        toPubkey: blinkData? (blinkData.wallet || TREASURY_PUBKEY): TREASURY_PUBKEY,
      }),
    );
    transaction.feePayer = account;
    transaction.recentBlockhash = (
      await connection.getLatestBlockhash()
    ).blockhash;

    const payload: ActionPostResponse = await createPostResponse({
      fields: {
        type: "transaction",
        transaction,
        message: "Thanks for the coffee fren :)",
      },
    });

    return NextResponse.json(payload, {
      headers: ACTIONS_CORS_HEADERS,
    });
  } catch (err) {
    console.error(err);
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
};
