import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleAuth() {
    setLoading(true)
    setMessage('')
    if (isSigningUp) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email for the confirmation link!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Logged in successfully!')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-600">
          File Storage and Sharing Application
        </h1>

        <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">
          {isSigningUp ? 'Create an Account' : 'Sign In'}
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={loading}
          className="w-full px-4 py-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
        >
          {loading ? 'Please wait...' : isSigningUp ? 'Sign Up' : 'Sign In'}
        </button>

        <p
          onClick={() => setIsSigningUp(!isSigningUp)}
          className="mt-5 text-center text-indigo-600 hover:underline cursor-pointer select-none"
        >
          {isSigningUp
            ? 'Already have an account? Sign In'
            : "Don't have an account? Create One"}
        </p>

        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.toLowerCase().includes('error') ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
