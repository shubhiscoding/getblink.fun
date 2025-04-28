import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("-------------------------------------------------------------------------------------");
    const {privateKey, wallet, title} = await req.json();
    if (!privateKey || !wallet || !title) {
      console.log(req.json());
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    console.log("That's not the priblem------------------------------------------");
    const client = await clientPromise;
    const db = client.db("Cluster0");

    const result = await db.collection("blinks").insertOne({
      privateKey,
      wallet,
      title,
      createdAt: new Date()
    });

    const blinkLink = `https://getblink.fun/api/actions/gamble/${result.insertedId}`;
    console.log("---------------------Blink Link---------------------");
    console.log(blinkLink);
    console.log("----------------------------------------------------");
    return NextResponse.json({ blinkLink });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
