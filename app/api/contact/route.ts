import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, company, aum, message, to, subject, source } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    // Store inquiry in Supabase for tracking
    const { error: dbError } = await supabase.from("contact_inquiries").insert({
      name,
      email,
      company,
      aum_range: aum,
      message,
      source: source || "website",
      recipient_email: to || "info@bcblock.net",
      subject,
      status: "pending",
    })

    if (dbError) {
      console.error("Database error:", dbError)
      // Continue even if DB fails - we still want to try sending
    }

    // For production, integrate with email service (Resend, SendGrid, etc.)
    // For now, we log and return success - the form has a mailto fallback
    console.log("Contact form submission:", {
      to: to || "info@bcblock.net",
      subject,
      from: email,
      name,
      company,
      aum,
      message,
      source,
      timestamp: new Date().toISOString(),
    })

    // In production, you would send email here:
    // await resend.emails.send({
    //   from: "CrimsonArb <noreply@crimsonarb.com>",
    //   to: to || "info@bcblock.net",
    //   subject: subject || `New Inquiry from ${name}`,
    //   html: `...`,
    // })

    return NextResponse.json({ 
      success: true, 
      message: "Inquiry submitted successfully" 
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: "Failed to submit inquiry" },
      { status: 500 }
    )
  }
}
