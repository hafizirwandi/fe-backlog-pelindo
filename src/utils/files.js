import Cookies from 'js-cookie'

import { refreshToken } from './auth'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const uploadFiles = async dataFiles => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/files/upload`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return uploadFiles(dataFiles)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: dataFiles
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return uploadFiles(dataFiles)
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

export const dataFilesByLha = async lha_id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/files/find-by-lha/${lha_id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataFilesByLha(lha_id)
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
        return dataFilesByLha(lha_id)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok || response.status != 200) throw new Error(data.message || 'Gagal mengambil data.')

    return {
      status: true,
      data: data.data
    }
  } catch (err) {
    return {
      status: false,
      message: err
    }
  }
}

export const deleteFile = async id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/files/${id}/destroy`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return deleteFile(id)
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
        return deleteFile(id)
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

export const dataFilesByLhaSpi = async lha_id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/files/find-by-lha-spi/${lha_id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataFilesByLhaSpi(lha_id)
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
        return dataFilesByLhaSpi(lha_id)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok || response.status != 200) throw new Error(data.message || 'Gagal mengambil data.')

    return {
      status: true,
      data: data.data
    }
  } catch (err) {
    return {
      status: false,
      message: err
    }
  }
}
