import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET() {
  try {
    // Get count and sum of intended amounts
    const { data, error } = await supabase
      .from("founders_waitlist")
      .select("amount_intended")

    if (error) {
      // Return zeros if table doesn't exist yet
      return NextResponse.json({ count: 0, totalIntended: 0 })
    }

    const count = data?.length || 0
    const totalIntended = data?.reduce((sum, row) => sum + (row.amount_intended || 0), 0) || 0

    return NextResponse.json({
      count,
      totalIntended,
      spotsRemaining: Math.max(0, 100 - count),
      capacityRemaining: Math.max(0, 100000 - totalIntended),
    })
  } catch (error) {
    console.error("Stats fetch error:", error)
    // Return zeros on error
    return NextResponse.json({ count: 0, totalIntended: 0 })
  }
}
