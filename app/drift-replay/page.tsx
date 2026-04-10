import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { DriftAttackReplay } from "@/components/drift-attack-replay"

export const metadata: Metadata = {
  title: 'Drift Attack Replay | CrimsonARB Security Demo',
  description: 'Watch CrimsonARB\'s three-layer security model block the $285M Drift exploit in real-time. Layer by layer. Vector by vector. Zero funds lost.',
}

export default function DriftReplayPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Top Nav */}
      <header className="border-b border-[#1e293b]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#f1f5f9] hover:text-[#dc2626] transition-colors">
            <span className="text-[#dc2626] font-mono font-bold">CRIMSONARB</span>
          </Link>
          <Link 
            href="/judges" 
            className="flex items-center gap-2 text-sm text-[#94a3b8] hover:text-[#f1f5f9] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Judges
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <DriftAttackReplay className="mb-8" />

        {/* Bottom Callout */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#f1f5f9] mb-4">What you just watched</h3>
            <ul className="space-y-3 text-sm text-[#94a3b8]">
              <li className="flex items-start gap-2">
                <span className="text-[#f59e0b]">•</span>
                <span><strong className="text-[#f1f5f9]">Layer 1 (Sentry Brain)</strong> detected manufactured CVT price history and issued SKIP</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#ef4444]">•</span>
                <span><strong className="text-[#f1f5f9]">Layer 2 (AgentSentry)</strong> detected governance migration and triggered CIRCUIT BREAK</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#dc2626]">•</span>
                <span><strong className="text-[#f1f5f9]">Layer 3 (Webacy DD)</strong> detected Tornado Cash-origin wallet and issued BLOCK</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#dc2626]/10 border border-[#dc2626]/30 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#f1f5f9] mb-4">This is Proof of No-Trade</h3>
              <p className="text-sm text-[#94a3b8] mb-6">
                Every SKIP, GUARD, and BLOCK decision is logged to Supabase with full reasoning. 
                The vault earns credibility by documenting what it {"doesn't"} do.
              </p>
            </div>
            <Link 
              href="/proof-of-no-trade"
              className="flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-mono font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              SEE ALL DECISIONS
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
