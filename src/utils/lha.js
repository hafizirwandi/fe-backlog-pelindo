import Cookies from 'js-cookie'

import { refreshToken } from './auth'

const url = process.env.NEXT_PUBLIC_API_BASE_URL

export const dataLha = async (page, pageSize, searchQuery, filters) => {
  try {
    const token = Cookies.get('token')

    const queryParams = new URLSearchParams()

    // Tambahkan parameter hanya jika tidak kosong
    queryParams.append('page', page)
    queryParams.append('page_size', pageSize)

    if (searchQuery.trim() !== '') {
      queryParams.append('keyword', searchQuery)
    }

    // Jika filters ada isinya, tambahkan ke query params
    if (filters && typeof filters === 'object') {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          queryParams.append(`filters[${key}]`, value)
        }
      })

      console.log(queryParams.toString())
    }

    let urlRequest = `${url}v1/lha?${queryParams.toString()}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataLha(page, pageSize, searchQuery)
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
        return dataLha(page, pageSize, searchQuery)
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

export const detailsLha = async id => {
  const token = Cookies.get('token')

  let urlRequest = `${url}v1/lha/details/${id}`

  try {
    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return detailsLha(id)
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

export const findLha = async id => {
  const token = Cookies.get('token')

  let urlRequest = `${url}v1/lha/${id}/show`

  try {
    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return findLha(id)
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

export const updateLha = async (id, dataLha) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/lha/${id}/update`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateLha(id, dataLha)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataLha)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateLha(id, dataLha)
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

export const deleteLha = async id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/lha/${id}/delete`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return deleteLha(id)
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
        return deleteLha(id)
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

export const createLha = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/lha/create`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createLha(dataLha)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataLha)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return createLha(dataLha)
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

export const rejectLha = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/lha/reject-lha`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaPic(dataLha)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataLha)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaPic(dataLha)
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

export const sendLhaSpv = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/lha/send-lha-to-spv`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaSpv(dataLha)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataLha)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaSpv(dataLha)
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

export const sendLhaPic = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/lha/send-lha-to-pic`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaPic(dataLha)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataLha)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaPic(dataLha)
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

export const sendLhaPj = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/lha/send-lha-to-pj`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaPj(dataLha)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataLha)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaPic(dataLha)
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

export const sendLhaAuditor = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/lha/send-lha-to-auditor`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaAuditor(dataLha)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataLha)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendLhaPic(dataLha)
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

export const dataLhaSpi = async (page, pageSize, searchQuery, filters) => {
  try {
    const token = Cookies.get('token')

    const queryParams = new URLSearchParams()

    // Tambahkan parameter hanya jika tidak kosong
    queryParams.append('page', page)
    queryParams.append('page_size', pageSize)

    if (searchQuery.trim() !== '') {
      queryParams.append('keyword', searchQuery)
    }

    let urlRequest = `${url}v1/lha/hasil-spi?${queryParams.toString()}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataLhaSpi()
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    })

    const data = await response.json()

    return data
  } catch (error) {
    return {
      status: false,
      data: [],
      message: error
    }
  }
}
