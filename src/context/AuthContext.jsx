'use client'
import { createContext, useContext, useEffect, useState } from 'react'

import { usePathname } from 'next/navigation'

import { NextResponse } from 'next/server'

import Cookies from 'js-cookie'

import { refreshToken } from '@/utils/auth'

const AuthContext = createContext()
const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const fetchProfile = async () => {
      let token = Cookies.get('token')

      if (!token) {
        const newToken = await refreshToken()

        if (newToken) {
          token = Cookies.get('token')
        }
      }

      try {
        const res = await fetch(`${url}v1/user/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        })

        const data = await res.json()

        if (data.status) {
          setUser(data.data)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()
  }, [pathname])

  return <AuthContext.Provider value={{ user, loading, setUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
