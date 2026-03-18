"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface SentryBrainReportProps {
  variant?: "default" | "compact" | "inline"
}

export function SentryBrainReport({ variant = "default" }: SentryBrainReportProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes("@")) {
      setStatus("error")
      setErrorMessage("Please enter a valid email address")
      return
    }

    setStatus("loading")

    try {
      // Store in localStorage for now (would connect to email service in production)
      const subscribers = JSON.parse(localStorage.getItem("sentry-brain-subscribers") || "[]")
      if (!subscribers.includes(email)) {
        subscribers.push(email)
        localStorage.setItem("sentry-brain-subscribers", JSON.stringify(subscribers))
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setStatus("success")
      setEmail("")
    } catch {
      setStatus("error")
      setErrorMessage("Something went wrong. Please try again.")
    }
  }

  if (variant === "compact") {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Sentry Brain Report
          </span>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="flex-1 px-3 py-2 bg-background border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            disabled={status === "loading" || status === "success"}
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[44px]"
          >
            {status === "loading" ? "..." : status === "success" ? "Done" : "Subscribe"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-xs text-red-500 mt-2">{errorMessage}</p>
        )}
      </div>
    )
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 items-center">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="px-3 py-2 bg-background border border-border rounded text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 w-48"
          disabled={status === "loading" || status === "success"}
        />
        <button
          type="submit"
          disabled={status === "loading" || status === "success"}
          className="px-4 py-2 bg-primary text-primary-foreground rounded text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[44px] whitespace-nowrap"
        >
          {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Get Report"}
        </button>
      </form>
    )
  }

  // Default variant - full featured
  return (
    <div className="bg-gradient-to-br from-card to-muted/30 border border-border rounded-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-primary animate-pulse" />
        </div>
        <div>
          <h3 className="font-mono text-lg font-semibold text-foreground">
            Sentry Brain Report
          </h3>
          <p className="text-xs text-muted-foreground">Weekly AI decision analysis</p>
        </div>
      </div>

      <p className="text-muted-foreground mb-6">
        Get the weekly breakdown of CrimsonARB's AI decisions: which opportunities we captured, 
        which we skipped, and the reasoning behind every choice. Plus early access to new features 
        and ecosystem updates.
      </p>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Decision summaries
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Market insights
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <svg className="w-4 h-4 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          No spam, ever
        </div>
      </div>

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center"
          >
            <svg className="w-8 h-8 text-primary mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="font-mono text-sm text-primary font-medium">You're subscribed!</p>
            <p className="text-xs text-muted-foreground mt-1">First report arrives Sunday at 9am CT</p>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  if (status === "error") setStatus("idle")
                }}
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[44px]"
                disabled={status === "loading"}
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[44px] whitespace-nowrap"
              >
                {status === "loading" ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Subscribing...
                  </span>
                ) : (
                  "Subscribe to Report"
                )}
              </button>
            </div>
            {status === "error" && (
              <p className="text-sm text-red-500">{errorMessage}</p>
            )}
          </motion.form>
        )}
      </AnimatePresence>

      <p className="text-xs text-muted-foreground mt-4 text-center">
        Join 200+ institutional investors tracking AI-native yield
      </p>
    </div>
  )
}
