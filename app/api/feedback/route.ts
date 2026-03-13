import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, category, source, walletAddress } = body

    if (!message || !category) {
      return NextResponse.json(
        { error: "Message and category are required" },
        { status: 400 }
      )
    }

    // Initialize Supabase client with service role for backend operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase.from("dev_feedback").insert({
      message,
      category,
      source: source || "unknown",
      wallet_address: walletAddress || null,
      network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || "devnet",
      user_agent: request.headers.get("user-agent"),
      created_at: new Date().toISOString(),
    }).select()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to save feedback" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "50")
    const category = searchParams.get("category")

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    let query = supabase
      .from("dev_feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (category) {
      query = query.eq("category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to fetch feedback" },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Feedback API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
