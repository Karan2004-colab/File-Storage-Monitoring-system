import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleAuth() {
    setLoading(true)
    setMessage('')
    if (isSigningUp) {
      // Sign up
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Check your email for the confirmation link!')
    } else {
      // Sign in
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else setMessage('Logged in successfully!')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <h2>{isSigningUp ? 'Sign Up' : 'Sign In'}</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        disabled={loading}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        disabled={loading}
      />

      <button onClick={handleAuth} disabled={loading}>
        {loading ? 'Loading...' : isSigningUp ? 'Sign Up' : 'Sign In'}
      </button>

      <p onClick={() => setIsSigningUp(!isSigningUp)} style={{ cursor: 'pointer', color: 'blue' }}>
        {isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </p>

      {message && <p>{message}</p>}
    </div>
  )
}
