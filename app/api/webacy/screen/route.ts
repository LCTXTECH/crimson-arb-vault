import { ddScreenAddress } from '@/lib/webacy'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const address = req.nextUrl.searchParams.get('address')
  const chain = (req.nextUrl.searchParams.get('chain') || 'sol') as 'sol' | 'eth' | 'base'

  if (!address) {
    return NextResponse.json({ error: 'address required' }, { status: 400 })
  }

  const result = await ddScreenAddress(address, chain)
  
  return NextResponse.json(result, {
    headers: {
      'Cache-Control': 'public, s-maxage=60',
      'X-Webacy-Source': result.source,
    },
  })
}
