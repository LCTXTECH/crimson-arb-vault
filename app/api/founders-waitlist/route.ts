import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, wallet, amount_intended, source } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!amount_intended || amount_intended < 1000 || amount_intended > 5000) {
      return NextResponse.json(
        { error: "Amount must be between $1,000 and $5,000" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const { data: existing } = await supabase
      .from("founders_waitlist")
      .select("id")
      .eq("email", email)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "This email is already on the waitlist" },
        { status: 400 }
      )
    }

    // Get current count for position
    const { count } = await supabase
      .from("founders_waitlist")
      .select("*", { count: "exact", head: true })

    const position = (count || 0) + 1

    // Insert new waitlist entry
    const { data, error } = await supabase
      .from("founders_waitlist")
      .insert({
        email,
        wallet: wallet || null,
        amount_intended,
        source: source || "direct",
        position,
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json(
        { error: "Failed to join waitlist" },
        { status: 500 }
      )
    }

    // Fire ecosystem event to bcblock.net (optional)
    try {
      await fetch("https://bcblock.net/api/ecosystem/event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "founders_waitlist_signup",
          product: "crimsonarb",
          data: { email, amount_intended, position },
        }),
      }).catch(() => {}) // Don't fail if ecosystem event fails
    } catch {
      // Ignore ecosystem event failures
    }

    return NextResponse.json({
      success: true,
      position,
      message: "You're on the Founders Waitlist!",
    })
  } catch (error) {
    console.error("Waitlist error:", error)
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("founders_waitlist")
      .select("*")
      .order("position", { ascending: true })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Waitlist fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch waitlist" },
      { status: 500 }
    )
  }
}
