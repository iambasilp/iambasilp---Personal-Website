'use client'

import { useState } from 'react'
import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const handleSignUp = async () => {
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setError('Success! Now go to your Supabase Dashboard -> Table Editor -> profiles -> and change your role to "admin" to access the dashboard.')
    setLoading(false)
  }

  return (
    <div className="max-w-sm mx-auto mt-24">
      <h1 className="text-xl font-medium mb-8 text-[#2C2C2A] dark:text-[#E4E3DF]">Admin Portal</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 text-sm">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-transparent border border-[#E8E6E0] dark:border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-colors w-full text-[#2C2C2A] dark:text-[#E4E3DF]"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-transparent border border-[#E8E6E0] dark:border-zinc-800 rounded-lg px-4 py-2.5 focus:outline-none focus:border-gray-400 dark:focus:border-zinc-600 transition-colors w-full text-[#2C2C2A] dark:text-[#E4E3DF]"
          required
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        <div className="flex gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#2C2C2A] text-white dark:bg-[#E4E3DF] dark:text-[#20201F] px-4 py-2.5 rounded-lg font-medium hover:opacity-80 transition-opacity disabled:opacity-50 flex-1"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="border border-[#E8E6E0] dark:border-zinc-800 px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50 flex-1 text-[#2C2C2A] dark:text-[#E4E3DF]"
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  )
}
