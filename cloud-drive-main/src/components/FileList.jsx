import React, { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function FileList({ user }) {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [signedUrls, setSignedUrls] = useState({})
  const [copySuccess, setCopySuccess] = useState('')

  useEffect(() => {
    if (!user) return

    async function fetchFiles() {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.storage
        .from('user-files')
        .list(user.id + '/', { limit: 100, sortBy: { column: 'name', order: 'asc' } })

      if (error) {
        setError(error.message)
        setFiles([])
      } else {
        setFiles(data)

        const urlPromises = data.map(async (file) => {
          const { data: urlData, error: urlError } = await supabase.storage
            .from('user-files')
            .createSignedUrl(`${user.id}/${file.name}`, 3600)

          if (urlError) {
            console.error('Error creating signed URL:', urlError.message)
            return { [file.name]: null }
          }
          return { [file.name]: urlData.signedUrl }
        })

        const urlResults = await Promise.all(urlPromises)
        const urls = Object.assign({}, ...urlResults)
        setSignedUrls(urls)
      }
      setLoading(false)
    }

    fetchFiles()
  }, [user])

  async function handleDelete(filename) {
    const confirmed = window.confirm(`Are you sure you want to delete "${filename}"?`)
    if (!confirmed) return

    const { error } = await supabase.storage
      .from('user-files')
      .remove([`${user.id}/${filename}`])

    if (error) {
      alert('Error deleting file: ' + error.message)
    } else {
      setFiles(files.filter(file => file.name !== filename))
      setSignedUrls(prev => {
        const updated = { ...prev }
        delete updated[filename]
        return updated
      })
    }
  }

  function getFileType(filename) {
    const ext = filename.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) return 'image'
    if (['mp4', 'webm', 'ogg'].includes(ext)) return 'video'
    if (ext === 'pdf') return 'pdf'
    return 'other'
  }

  function copyToClipboard(url) {
    if (!url) return
    navigator.clipboard.writeText(url).then(() => {
      setCopySuccess('Link copied to clipboard!')
      setTimeout(() => setCopySuccess(''), 3000)
    }).catch(() => {
      setCopySuccess('Failed to copy link.')
      setTimeout(() => setCopySuccess(''), 3000)
    })
  }

  if (loading) return <p className="text-center mt-8 text-gray-600">Loading files...</p>
  if (error) return <p className="text-center mt-8 text-red-500">Error loading files: {error}</p>
  if (!files.length) return <p className="text-center mt-8 text-gray-600">No files uploaded yet.</p>

  return (
    <div className="mt-6">
      <h3 className="text-2xl font-semibold text-gray-700 mb-4">Your Files</h3>

      {copySuccess && (
        <div className="mb-4 text-green-600 font-semibold">{copySuccess}</div>
      )}

      <table className="w-full border-collapse shadow rounded-lg overflow-hidden">
        <thead className="bg-purple-200">
          <tr>
            <th className="p-3 text-left w-16">Sl. No.</th>
            <th className="p-3 text-left max-w-xs">File Name</th>
            <th className="p-3 text-left max-w-xs">Preview</th>
            <th className="p-3 text-left w-40">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file, index) => {
            const fileType = getFileType(file.name)
            const url = signedUrls[file.name] || ''

            return (
              <tr
                key={file.name}
                className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} align-middle`}
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3 max-w-xs break-words">{file.name}</td>
                <td className="p-3 max-w-xs">
                  {fileType === 'image' && url && (
                    <img
                      src={url}
                      alt={file.name}
                      className="max-w-[150px] max-h-[100px] rounded-md object-cover"
                    />
                  )}

                  {fileType === 'video' && url && (
                    <video
                      src={url}
                      controls
                      className="max-w-[150px] rounded-md"
                    />
                  )}

                  {fileType === 'pdf' && url && (
                    <embed
                      src={url}
                      type="application/pdf"
                      width="150"
                      height="100"
                      className="border border-gray-300 rounded-md"
                    />
                  )}

                  {fileType === 'other' && url && (
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Download File
                    </a>
                  )}

                  {!url && <p className="text-gray-400">Preview not available</p>}
                </td>
                <td className="p-3 flex space-x-2">
                  <a
                    href={url}
                    download={file.name}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition"
                  >
                    Download
                  </a>

                  <button
                    onClick={() => copyToClipboard(url)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition"
                    disabled={!url}
                    title="Copy share link"
                  >
                    Share
                  </button>

                  <button
                    onClick={() => handleDelete(file.name)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
