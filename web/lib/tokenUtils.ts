import { Connection, PublicKey, TransactionInstruction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID, u64 } from '@solana/spl-token';
import axios from 'axios';

interface PumpFunTokenData {
  mint: string;
  symbol: string;
  price: number;
  decimals: number;
}

export async function getTokenDataFromPumpFun(tokenId: string): Promise<PumpFunTokenData> {
  try {
    const response = await axios.get(`https://api.pump.fun/token/${tokenId}`);
    const tokenData = response.data;

    if (!tokenData || !tokenData.mint || !tokenData.symbol || !tokenData.price || !tokenData.decimals) {
      throw new Error('Invalid token data received from pump.fun');
    }

    return {
      mint: tokenData.mint,
      symbol: tokenData.symbol,
      price: tokenData.price,
      decimals: tokenData.decimals
    };
  } catch (error) {
    console.error('Error fetching token data from pump.fun:', error);
    throw new Error('Failed to fetch token data');
  }
}

export async function createTokenTransferInstruction(
  connection: Connection,
  tokenMint: PublicKey,
  sourceTokenAccount: PublicKey,
  destinationTokenAccount: PublicKey,
  amount: number,
  decimals: number
): Promise<TransactionInstruction> {
  try {
    const adjustedAmount = amount * Math.pow(10, decimals);

    return Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      sourceTokenAccount,
      destinationTokenAccount,
      tokenMint,
      [],
      new u64(adjustedAmount.toString())
    );
  } catch (error) {
    console.error('Error creating token transfer instruction:', error);
    throw new Error('Failed to create token transfer instruction');
  }
}

export async function getOrCreateAssociatedTokenAccount(
  connection: Connection,
  tokenMint: PublicKey,
  owner: PublicKey
): Promise<PublicKey> {
  try {
    const token = new Token(connection, tokenMint, TOKEN_PROGRAM_ID, null);
    const associatedTokenAccount = await token.getOrCreateAssociatedAccountInfo(owner);
    return associatedTokenAccount.address;
  } catch (error) {
    console.error('Error getting or creating associated token account:', error);
    throw new Error('Failed to get or create associated token account');
  }
}
