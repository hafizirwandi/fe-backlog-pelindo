import Cookies from 'js-cookie'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const login = async (nip, password) => {
  try {
    const response = await fetch(`${url}v1/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nip, password })
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Login gagal')

    const expiresDate = new Date(data.data.expires_in) // Konversi ke Date object
    const expiresMilliseconds = expiresDate.getTime() - Date.now() // Selisih dengan waktu sekarang
    const expiresDays = expiresMilliseconds / (1000 * 60 * 60 * 24)

    Cookies.set('token', data.data.token, {
      expires: expiresDays,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    })

    Cookies.set('expires_in', data.data.expires_in, {
      expires: expiresDays,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    })

    Cookies.set('refresh_token', data.data.refresh_token, {
      expires: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    })

    return {
      status: true,
      message: data.message
    }
  } catch (error) {
    return {
      status: false,
      message: error
    }
  }
}

export const logout = async () => {
  const token = Cookies.get('token')

  try {
    const response = await fetch(`${url}v1/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Gagal logout')

    Cookies.remove('token')
    Cookies.remove('expires_iv')
    Cookies.remove('refresh_token')

    return {
      status: true,
      message: 'Logout berhasil'
    }
  } catch (error) {
    return {
      status: false,
      message: error
    }
  }
}

export const redirectToLogin = () => {
  Cookies.remove('token')
  Cookies.remove('expires_iv')
  Cookies.remove('refresh_token')
  window.location.href = '/login'
}

export const refreshToken = async () => {
  try {
    const refreshToken = Cookies.get('refresh_token')

    if (!refreshToken) return false // Kalau tidak ada refresh_token, langsung return false

    const res = await fetch(`${url}v1/refresh-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    })

    const data = await res.json()

    if (data.status) {
      Cookies.set('token', data.data.token, { httpOnly: true })
      Cookies.set('expires_in', data.data.expires_in, { httpOnly: true })

      return true
    } else {
      redirectToLogin()

      return false
    }
  } catch (error) {
    console.log(error)

    return false
  }
}
