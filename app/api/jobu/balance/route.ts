"use server"

import { Connection, Keypair, PublicKey } from "@solana/web3.js"
import { NextResponse } from "next/server"
import bs58 from "bs58"

// Default devnet treasury address (for demo purposes when secret key not set)
const DEFAULT_TREASURY_ADDRESS = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"

export async function GET() {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com"
    const connection = new Connection(rpcUrl, "confirmed")

    let treasuryAddress: string

    // Check if we have a secret key configured
    const secretKeyString = process.env.JOBU_TREASURY_SECRET_KEY

    if (secretKeyString) {
      // Parse the secret key (supports both JSON array and base58 formats)
      const treasuryKeypair = Keypair.fromSecretKey(
        secretKeyString.startsWith("[")
          ? Uint8Array.from(JSON.parse(secretKeyString))
          : bs58.decode(secretKeyString)
      )
      treasuryAddress = treasuryKeypair.publicKey.toBase58()
    } else {
      // Use default demo address
      treasuryAddress = DEFAULT_TREASURY_ADDRESS
    }

    const publicKey = new PublicKey(treasuryAddress)
    const balance = await connection.getBalance(publicKey)

    return NextResponse.json({
      balance: balance / 1e9, // Convert Lamports to SOL
      address: treasuryAddress,
      network: rpcUrl.includes("devnet") ? "devnet" : "mainnet",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Jobu balance fetch error:", error)
    return NextResponse.json(
      {
        error: "Could not fetch Jobu's rum supply",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
