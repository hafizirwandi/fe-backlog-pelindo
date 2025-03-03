import Cookies from 'js-cookie'

import { refreshToken } from './auth'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const dataTemuan = async (page, pageSize, searchQuery) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan?page=${page}&page_size=${pageSize}`

    if (searchQuery != '') {
      urlRequest += `&keyword=${searchQuery}`
    }

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataTemuan(page, pageSize, searchQuery)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataTemuan(page, pageSize, searchQuery)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Gagal mengambil data!')

    return {
      status: true,
      data: data.data,
      pagination: data.pagination
    }
  } catch (error) {
    return {
      status: false,
      data: [],
      message: error
    }
  }
}

export const dataTemuanByLha = async (page, pageSize, searchQuery, lha_id) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/find-by-lha-id/${lha_id}?page=${page}&page_size=${pageSize}`

    if (searchQuery != '') {
      urlRequest += `&keyword=${searchQuery}`
    }

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataTemuanByLha(page, pageSize, searchQuery, lha_id)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataTemuanByLha(page, pageSize, searchQuery, lha_id)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Gagal mengambil data!')

    return {
      status: true,
      data: data.data,
      pagination: data.pagination
    }
  } catch (error) {
    return {
      status: false,
      data: [],
      message: error
    }
  }
}

export const createTemuan = async dataTemuan => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createTemuan(dataTemuan)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataTemuan)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createTemuan(dataTemuan)
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
