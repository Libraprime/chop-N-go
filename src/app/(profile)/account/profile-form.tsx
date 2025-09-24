'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './profile_pix'
import toast from 'react-hot-toast'


export default function AccountForm({ user }: { user: User | null }) {
  const supabase = createClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [location, setLocation] = useState('')
  const [avatar_url, setAvatarUrl] = useState<string | null>(null)
  const [contact_info, setContactInfo] = useState('')
  const [notify_delivery, setNotifyDelivery] = useState(false)
  const [errors, setErrors] = useState<{ username?: string }>({})

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error } = await supabase
        .from('consumers')
        .select('full_name, username, location, contact_info, notify_delivery, avatar_url')
        .eq('id', user?.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (error?.code === '23505') {
        toast.error('Username already taken.')
      }


      if (data) {
        setFullname(data.full_name ?? '')
        setUsername(data.username ?? '')
        setLocation(data.location ?? '')
        setContactInfo(data.contact_info ?? '')
        setNotifyDelivery(data.notify_delivery ?? false)
        setAvatarUrl(data.avatar_url ?? '')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }, [supabase, user])

  useEffect(() => {
    if (user) getProfile()
  }, [user, getProfile])

  const validate = () => {
    const newErrors: typeof errors = {}
    if (!username?.trim()) newErrors.username = 'Username is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const updateProfile = async () => {
    if (!validate()) return

    try {
      setLoading(true)

      const updates = {
        id: user?.id,
        full_name: fullname.trim() || null,
        username: username.trim() || null,
        location: location.trim() || null,
        contact_info: contact_info.trim() || null,
        notify_delivery,
        avatar_url,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase.from('consumers').upsert(updates)

      if (error) {
        console.error('Supabase update error:', error)
        toast.error(error.message || 'An error occurred while updating your profile.')
        return
      }

      toast.success('Profile updated successfully!')

      if (fullname && username && location && contact_info) {
        router.push('/explore')
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      toast.error('Unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget max-w-md mx-auto space-y-6 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center">Complete Your Profile</h2>

      <div className="flex justify-center">
        <Avatar
          uid={user?.id ?? null}
          url={avatar_url}
          size={120}
          onUpload={(url) => setAvatarUrl(url)}
        />
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input
            id="email"
            type="text"
            value={user?.email || ''}
            disabled
            className="input input-bordered  w-full"
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block text-sm font-medium">Full Name</label>
          <input
            id="fullName"
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            className="input input-bordered text-amber-50 w-full"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm font-medium">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input input-bordered w-full text-amber-50"
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium">Location</label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="input input-bordered w-full text-amber-50"
          />
        </div>

        <div>
          <label htmlFor="contact" className="block text-sm font-medium">Contact Info</label>
          <input
            id="contact"
            type="text"
            value={contact_info}
            onChange={(e) => setContactInfo(e.target.value)}
            className="input input-bordered w-full text-amber-50"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="notify"
            type="checkbox"
            checked={notify_delivery}
            onChange={() => setNotifyDelivery(!notify_delivery)}
          />
          <label htmlFor="notify">Notify me about deliveries</label>
        </div>

        <button onClick={updateProfile} disabled={loading} className="w-full btn bg-[#F36B2F]">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>

        <form action="/auth/signout" method="post">
          <button className="w-full btn bg-[#F36B2F] mt-2" type="submit">
            Sign out
          </button>
        </form>

        <button className='w-full btn bg-[#F36B2F] mt-2' onClick={router.back}>Go back</button>
      </div>
    </div>
  )
}
