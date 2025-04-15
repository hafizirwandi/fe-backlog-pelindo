import Cookies from 'js-cookie'

import { data } from 'autoprefixer'

import { redirectToLogin, refreshToken } from './auth'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const dashboardSummary = async (lhaId = null) => {
  const token = Cookies.get('token')

  let urlRequest = `${url}v1/statistik/dashboard-summary`

  if (lhaId) {
    urlRequest = `${url}v1/statistik/dashboard-summary?lha_id=${lhaId}`
  }

  try {
    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dashboardSummary()
      } else {
        throw new Error('Session expired, please login again fuck.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    const data = await response.json()

    if (!response.ok || response.status != 200) throw new Error(data.message || 'Gagal update data!')

    return data
  } catch (error) {
    return data
  }
}

export const logStage = async (lhaId = null) => {
  const token = Cookies.get('token')

  let urlRequest = `${url}v1/statistik/log-stage`

  if (lhaId) {
    urlRequest = `${url}v1/statistik/log-stage?lha_id=${lhaId}`
  }

  try {
    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return logStage()
      } else {
        throw new Error('Session expired, please login again fuck.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    const data = await response.json()

    if (!response.ok || response.status != 200) throw new Error(data.message || 'Gagal update data!')

    return data
  } catch (error) {
    return data
  }
}
