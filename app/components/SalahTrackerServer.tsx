import { createClient } from '../lib/supabase/server'
import SalahTrackerGrid from './SalahTrackerGrid'

type Props = {
  year: number
  month: number
}

export default async function SalahTrackerServer({ year, month }: Props) {
  const supabase = await createClient()

  // Verify if current user is admin
  const { data: { user } } = await supabase.auth.getUser()
  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    isAdmin = profile?.role === 'admin'
  }

  // Format as YYYY-MM-DD
  const pad = (n: number) => String(n).padStart(2, '0')
  const startDate = `${year}-${pad(month + 1)}-01`
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const endDate = `${year}-${pad(month + 1)}-${pad(daysInMonth)}`

  const { data: trackingData } = await supabase
    .from('salah_tracking')
    .select('*')
    .lte('date', endDate)
    .order('date', { ascending: true })

  return (
    <SalahTrackerGrid 
      initialData={trackingData || []} 
      isAdmin={isAdmin}
      year={year}
      month={month}
    />
  )
}
