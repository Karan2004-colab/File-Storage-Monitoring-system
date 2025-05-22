import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function FileUpload({ user }) {
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleFileChange(event) {
    const file = event.target.files[0]
    if (!file || !user) return

    setUploading(true)
    setMessage('')

    const filePath = `${user.id}/${file.name}`

    const { error } = await supabase.storage
      .from('user-files')
      .upload(filePath, file, { upsert: true })

    if (error) {
      setMessage('Upload failed: ' + error.message)
    } else {
      setMessage('File uploaded successfully!')
    }

    setUploading(false)
    event.target.value = null // reset input
  }

  return (
    <div className="mb-6">
      <label
        htmlFor="file-upload"
        className="inline-block cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md font-semibold transition"
      >
        {uploading ? 'Uploading...' : 'Upload a File'}
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  )
}
