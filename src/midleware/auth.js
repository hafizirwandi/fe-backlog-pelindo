import { NextResponse } from 'next/server'

import { refreshToken } from '@/utils/auth'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export async function middleware(req) {
  const url = req.nextUrl
  const token = req.cookies.get('token')
  const refreshTokenCookies = req.cookies.get('refresh_token')
  const expiresIn = req.cookies.get('expires_in')

  const publicRoutes = ['/login']

  if (publicRoutes.includes(url.pathname)) {
    return NextResponse.next()
  }

  console.log(refreshTokenCookies)

  // return

  if (!token) {
    if (!refreshTokenCookies) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    const getNewToken = await refreshToken()

    if (!getNewToken) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  const now = new Date()
  const expireTime = new Date(expiresIn)
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)

  if (expireTime < oneHourLater && refreshTokenCookies) {
    try {
      const res = await fetch(`${url}/v1/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshTokenCookies })
      })

      const data = await res.json()

      if (data.status) {
        const response = NextResponse.next()

        response.cookies.set('token', data.data.token, { httpOnly: true, secure: true, sameSite: 'Strict' })
        response.cookies.set('expires_in', data.data.expires_in, { httpOnly: true, secure: true, sameSite: 'Strict' })

        return response
      } else {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    } catch (error) {
      console.error('Error refreshing token:', error)

      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return NextResponse.next()
}
