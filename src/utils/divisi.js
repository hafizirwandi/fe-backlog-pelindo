import Cookies from 'js-cookie'

import { refreshToken } from './auth'
import pagination from '@/@core/theme/overrides/pagination'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const dataDivisiByUnit = async (page, pageSize, searchQuery, unit_id) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/divisi/find-by-unit-id/${unit_id}?page=${page}&page_size=${pageSize}`

    if (searchQuery != '') {
      urlRequest += `&keyword=${searchQuery}`
    }

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataDivisiByUnit(page, pageSize, searchQuery, unit_id)
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
        return dataDivisiByUnit(page, pageSize, searchQuery, unit_id)
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

export const dataDivisi = async (page, pageSize, searchQuery) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/divisi?page=${page}&page_size=${pageSize}`

    if (searchQuery != '') {
      urlRequest += `&keyword=${searchQuery}`
    }

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataDivisi(page, pageSize, searchQuery)
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
        return dataDivisi(page, pageSize, searchQuery)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok) throw new Error(data.message || 'Gagal mengambil data!')

    return data
  } catch (error) {
    return {
      status: false,
      data: [],
      message: error
    }
  }
}

export const createDivisi = async dataDivisi => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/divisi`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createDivisi(dataDivisi)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        nama: dataDivisi.nama,
        unit_id: dataDivisi.unit_id
      })
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createDivisi(dataDivisi)
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

export const findDivisi = async id => {
  const token = Cookies.get('token')

  let urlRequest = `${url}v1/divisi/${id}`

  if (!token) {
    const refreshSuccess = await refreshToken()

    if (refreshSuccess) {
      return findDivisi(id)
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

export const updateDivisi = async (id, dataDivisi) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/divisi/${id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateDivisi(id, dataDivisi)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        id: dataDivisi.id,
        nama: dataDivisi.nama,
        unit_id: dataDivisi.unit_id
      })
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateDivisi(id, dataUnit)
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

export const deleteDivisi = async id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/divisi/${id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return deleteDivisi(id)
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
        return deleteDivisi(id)
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
