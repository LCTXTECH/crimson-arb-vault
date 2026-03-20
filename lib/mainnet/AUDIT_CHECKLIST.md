# CrimsonARB Security Audit Checklist
## Pre-Mainnet Requirements

### Anchor Programs (ctoken-market-program)
- [ ] Deposit instruction: input validation on amount
- [ ] Deposit instruction: overflow check on u64
- [ ] cToken mint: 1:1 ratio enforced
- [ ] Withdraw instruction: cToken burn before transfer
- [ ] Authority checks: only vault keypair can execute
- [ ] Reentrancy: not possible with Solana account model (document this explicitly)

### Anchor Programs (custom-adaptor-program)
- [ ] CPI to Ranger vault: program ID validation
- [ ] Return value (u64): validated before use
- [ ] Initialize: only callable once
- [ ] Upgrade authority: multisig or renounced

### JavaScript/TypeScript (vault-executor.ts)
- [ ] requireMainnet(): cannot be bypassed
- [ ] Cap enforcement: atomic with transfer
- [ ] AgentSentry: non-optional, hard requirement
- [ ] Webacy score: minimum threshold enforced
- [ ] Position size: validated against VAULT constants
- [ ] encodeDepositInstruction: matches IDL exactly

### JavaScript/TypeScript (drift-executor.ts)
- [ ] calculateBaseAmount: oracle staleness check
- [ ] Market index mapping: hardcoded correctly
- [ ] Direction: always 'short' — cannot be changed
- [ ] Audit log: fires before returning txSig

### Key Management
- [ ] CTOKEN_MARKET_PROGRAM_ID: in env, not code
- [ ] Delegate wallet: Privy embedded, limited scope
- [ ] Treasury wallet: separate from delegate
- [ ] Service role key: server-side only

### Known Issues (for auditor)
1. calculateBaseAmount uses oracle — implement Pyth feed
2. AgentSentry call is server-side — consider on-chain
3. Webacy score check is server-side — consider on-chain
4. Cap enforcement is JavaScript — consider program-level

### Audit Firms Targeted
- Codespect (offered via TokenTon26)
- Hacken
- OtterSec (Drift Protocol used them)

### Estimated Timeline
- Fund audit: immediately after hackathon prize
- Audit duration: 4-6 weeks
- Mainnet launch: audit complete + 2 weeks buffer
