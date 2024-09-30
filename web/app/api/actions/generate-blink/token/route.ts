import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Connection, PublicKey } from '@solana/web3.js';
import { programs } from '@metaplex/js';

const { metadata: { Metadata } } = programs;

const connection = new Connection('https://api.mainnet-beta.solana.com');

export async function GET(req: Request) {
  try {
    // Extract mint address from URL query parameters
    const { searchParams } = new URL(req.url);
    const mint = searchParams.get('mint'); // Get the "mint" query parameter

    if (!mint) {
      return NextResponse.json({ error: 'Mint address is required' }, { status: 400 });
    }

    const mintAddress = new PublicKey(mint);

    let tokenMetadata;
    try {
      const metadataPDA = await Metadata.getPDA(mintAddress);
      tokenMetadata = await Metadata.load(connection, metadataPDA);
    } catch (error) {
      console.log('Error fetching token metadata:', error);
      return NextResponse.json({ error: 'Failed to fetch token metadata' }, { status: 500 });
    }

    const tokenName = tokenMetadata.data.data.name;
    const tokenUri = tokenMetadata.data.data.uri;

    let tokenJson;
    try {
      const response = await fetch(tokenUri);
      tokenJson = await response.json();
    } catch (error) {
      console.log('Error fetching token metadata JSON:', error);
      return NextResponse.json({ error: 'Failed to fetch token metadata JSON' }, { status: 500 });
    }

    const icon = tokenJson.image;
    const title = "BUY " + tokenName;

    const retPayLoad = { icon, title };
    return NextResponse.json(retPayLoad);

  } catch (error) {
    console.log('Error fetching data:', error);
    return NextResponse.json({ error: 'Invalid mint' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    console.log('Raw request body:', rawBody);

    let data;
    try {
      data = JSON.parse(rawBody);
    } catch (parseError) {
      console.log('Error parsing JSON:', parseError);
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const { label, description, wallet, mint, commission, percentage } = data;
    if (!label || !description || !wallet || !mint) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const mintAddress = new PublicKey(mint);

    let tokenMetadata;
    try {
      const metadataPDA = await Metadata.getPDA(mintAddress);
      tokenMetadata = await Metadata.load(connection, metadataPDA);
    } catch (error) {
      console.log('Error fetching token metadata:', error);
      return NextResponse.json({ error: 'Failed to fetch token metadata' }, { status: 500 });
    }

    const tokenName = tokenMetadata.data.data.name;
    const tokenUri = tokenMetadata.data.data.uri;

    let tokenJson;
    try {
      const response = await fetch(tokenUri);
      tokenJson = await response.json();
    } catch (error) {
      console.log('Error fetching token metadata JSON:', error);
      return NextResponse.json({ error: 'Failed to fetch token metadata JSON' }, { status: 500 });
    }

    const icon = tokenJson.image;
    const title = "BUY " + tokenName;

    const client = await clientPromise;
    const db = client.db("Cluster0");

    const result = await db.collection("blinks").insertOne({
      icon,
      label,
      description,
      title,
      wallet,
      mint,
      commission,
      percentage,
      createdAt: new Date()
    });
    console.log(result.insertedId);
    const blinkLink = `https://www.getblink.fun/api/actions/tokens/${result.insertedId}`;
    return NextResponse.json({ blinkLink });
  } catch (error) {
    console.log('Error generating blink:', error);
    return NextResponse.json({ error: 'Failed to generate blink' }, { status: 500 });
  }
}
