import Cookies from 'js-cookie'

import { refreshToken } from './auth'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const dataDepartemenByDivisi = async (page, pageSize, searchQuery, divisiId) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/departemen/find-by-divisi-id/${divisiId}?page=${page}&page_size=${pageSize}`

    if (searchQuery != '') {
      urlRequest += `&keyword=${searchQuery}`
    }

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataDepartemenByDivisi(page, pageSize, searchQuery, divisiId)
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
        return dataDepartemenByDivisi(page, pageSize, searchQuery, divisiId)
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
