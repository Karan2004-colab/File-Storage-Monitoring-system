import React, { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import SignIn from './pages/SignIn'
import FileUpload from './components/FileUpload'
import FileList from './components/FileList'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) setUser(session.user)
      else setUser(null)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) setUser(session.user)
      else setUser(null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (!user) return <SignIn />

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-100 via-green-100 to-blue-100 p-6 flex flex-col items-center">
      <header className="w-full max-w-5xl flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-700">File Storage monitoring system</h1>
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            setUser(null)
          }}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold transition"
        >
          Sign Out
        </button>
      </header>

      <main className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-6">
        <p className="mb-4 text-gray-700 font-medium">
          Welcome, <span className="font-semibold">{user.email}</span>
        </p>

        <FileUpload user={user} />
        <FileList user={user} />
      </main>
    </div>
  )
}
