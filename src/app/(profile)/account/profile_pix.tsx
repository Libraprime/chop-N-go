'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import Image from 'next/image'

interface AvatarProps {
  uid: string | null
  url: string | null
  size: number
  onUpload: (url: string) => void
  onError?: (error: unknown) => void
}

export default function Avatar({
  uid,
  url,
  size,
  onUpload,
  onError,
}: AvatarProps) {
  const supabase = createClient()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(url)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function downloadImage(path: string) {
      try {
        const { data, error } = await supabase.storage
          .from('avatars')
          .download(path)
        if (error) throw error

        const objectUrl = URL.createObjectURL(data)
        setAvatarUrl(objectUrl)
      } catch (error: unknown) {
      const message =
        (error instanceof Error && error.message) ||
        (typeof error === 'object' && error !== null && 'error_description' in error && error.error_description) ||
        JSON.stringify(error)
        
        console.error('Error downloading avatar:', message)
        onError?.(message)
      }
    }

    if (url) downloadImage(url)
  }, [url, supabase, onError])

  const uploadAvatar: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    try {
      setUploading(true)

      const file = event.target.files?.[0]
      if (!file) throw new Error('You must select an image to upload.')

      const fileExt = file.name.split('.').pop()
      const filePath = `${uid || 'user'}-${crypto.randomUUID()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      const { data, error: downloadError } = await supabase.storage
        .from('avatars')
        .download(filePath)

      if (downloadError) throw downloadError

      const objectUrl = URL.createObjectURL(data)
      setAvatarUrl(objectUrl)

      onUpload(filePath)
    } catch (error: unknown) {
      const message =
        (error instanceof Error && error.message) ||
        (typeof error === 'object' && error !== null && 'error_description' in error && error.error_description) ||
        JSON.stringify(error)

      console.error('Error uploading avatar:', message)
      onError?.(message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {avatarUrl ? (
        <Image
          width={size}
          height={size}
          src={avatarUrl}
          alt="User Avatar"
          className="rounded-full object-cover"
        />
      ) : (
        <div
          className="bg-gray-200 rounded-full"
          style={{ width: size, height: size }}
        />
      )}

      <label className="cursor-pointer text-sm bg-[#F36B2F] hover:bg-blue-700 text-white py-1 px-3 rounded">
        {uploading ? 'Uploading...' : 'Upload'}
        <input
          type="file"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  )
}
