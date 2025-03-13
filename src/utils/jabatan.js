import Cookies from 'js-cookie'

import { refreshToken } from './auth'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const dataJabatan = async (page, pageSize, searchQuery) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/jabatan?page=${page}&page_size=${pageSize}`

    if (searchQuery != '') {
      urlRequest += `&keyword=${searchQuery}`
    }

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataJabatan(page, pageSize, searchQuery)
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
        return dataJabatan(page, pageSize, searchQuery)
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

export const createJabatan = async dataJabatan => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/jabatan`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createJabatan(dataJabatan)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        nama: dataJabatan.nama
      })
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createJabatan(dataJabatan)
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

export const updateJabatan = async (id, dataJabatan) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/jabatan/${id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateJabatan(id, dataJabatan)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id: dataJabatan.id,
        nama: dataJabatan.nama
      })
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateJabatan(id, dataJabatan)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Gagal update data!')

    return {
      status: true,
      message: data.message
    }
  } catch (error) {
    return {
      status: false,
      data: [],
      message: error
    }
  }
}

export const deleteJabatan = async id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/jabatan/${id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return deleteJabatan(id)
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
        return deleteJabatan(id)
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

export const findJabatan = async id => {
  const token = Cookies.get('token')

  let urlRequest = `${url}v1/jabatan/${id}`

  if (!token) {
    const refreshSuccess = await refreshToken()

    if (refreshSuccess) {
      return findJabatan(id)
    } else {
      throw new Error('Session expired, please login again.')
    }
  }

  const response = await fetch(urlRequest, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  })

  const data = await response.json()

  return {
    status: true,
    data: data.data
  }
}
