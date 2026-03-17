// CrimsonARB Configuration
// Video URLs - update these after recording

export const VIDEOS = {
  demo: process.env.NEXT_PUBLIC_DEMO_VIDEO_URL || '',
  pitch: process.env.NEXT_PUBLIC_PITCH_VIDEO_URL || ''
}

// Anchor Program Addresses (Devnet)
export const ANCHOR_PROGRAMS = {
  ctokenMarket: {
    address: "CRMSNqm8cYyuLZMQTdQ5YHZwpNE4kxQ8TpjkVrDKPsNt",
    name: "ctoken-market-program",
    solscanUrl: "https://solscan.io/account/CRMSNqm8cYyuLZMQTdQ5YHZwpNE4kxQ8TpjkVrDKPsNt?cluster=devnet"
  },
  customAdaptor: {
    address: "ADPTqm9xYZMQTdQ5YHZwpNE4kxQ8TpjkVrDKPsNtXYZ",
    name: "custom-adaptor-program", 
    solscanUrl: "https://solscan.io/account/ADPTqm9xYZMQTdQ5YHZwpNE4kxQ8TpjkVrDKPsNtXYZ?cluster=devnet"
  }
}

// Drift Protocol
export const DRIFT_CONFIG = {
  programId: "dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH",
  network: "devnet"
}

// External Links
export const EXTERNAL_LINKS = {
  github: "https://github.com/LCTXTECH",
  agentSentry: "https://agentsentry.net",
  bcblock: "https://bcblock.net",
  discord: "https://discord.gg/V2DksdSE",
  twitter: "https://twitter.com/bcblockhtx"
}

// Contact
export const CONTACT = {
  name: "Christopher Trotti",
  company: "Bayou City Blockchain LLC",
  email: "info@bcblock.net",
  twitter: "@bcblockhtx"
}
