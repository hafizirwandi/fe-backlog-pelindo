import Cookies from 'js-cookie'

import { refreshToken } from './auth'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const dataTindaklanjut = async id => {
  const token = Cookies.get('token')

  let urlRequest = `${url}v1/tindaklanjut/find-by-rekomendasi-id/${id}`

  try {
    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataTindaklanjut()
      } else {
        throw new Error('Session expired, please login again fuck.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    const data = await response.json()

    if (!response.ok || response.status != 200) throw new Error(data.message || 'Gagal mengambil data!')

    return {
      status: true,
      data: data.data
    }
  } catch (error) {
    return {
      status: false,
      message: error
    }
  }
}

export const createTindaklanjut = async dataTindaklanjut => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/tindaklanjut`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createTindaklanjut(dataTindaklanjut)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataTindaklanjut)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createTindaklanjut(dataTindaklanjut)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Gagal create data!')

    return {
      status: true,
      message: data.message
    }
  } catch (err) {
    return {
      status: false,
      message: err
    }
  }
}

export const findTindaklanjut = async id => {
  const token = Cookies.get('token')

  let urlRequest = `${url}v1/tindaklanjut/${id}`

  try {
    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return findTindaklanjut(id)
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

    return {
      status: true,
      data: data.data
    }
  } catch (error) {
    return {
      status: false,
      message: error
    }
  }
}

export const updateTindaklanjut = async (id, dataTindaklanjut) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/tindaklanjut/${id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateTindaklanjut(id, dataTindaklanjut)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataTindaklanjut)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateTindaklanjut(id, dataTindaklanjut)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Gagal delete data!')

    return {
      status: true,
      message: data.message
    }
  } catch (err) {
    return {
      status: false,
      message: err
    }
  }
}

export const deleteTindaklanjut = async id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/tindaklanjut/${id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return deleteTindaklanjut(id)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return deleteTindaklanjut(id)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Gagal delete data!')

    return {
      status: true,
      message: data.message
    }
  } catch (err) {
    return {
      status: false,
      data: [],
      message: err
    }
  }
}
