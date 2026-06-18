import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '../../lib/supabase/server'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { path, referrer, device_type } = body

    // Create a privacy-friendly visitor ID by hashing their IP with a daily salt
    // This tracks unique daily visitors without storing persistent cookies or their actual IP
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'anonymous'
    const today = new Date().toISOString().split('T')[0]
    const visitor_id = crypto.createHash('sha256').update(`${ip}-${today}`).digest('hex')
    
    // Attempt to get country from Vercel headers if deployed
    const country = request.headers.get('x-vercel-ip-country') || 'Unknown'

    const supabase = await createClient()

    await supabase.from('analytics_events').insert({
      path,
      visitor_id,
      referrer,
      device_type,
      country
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    // Fail silently for analytics
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
