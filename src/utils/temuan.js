import Cookies from 'js-cookie'

import { redirectToLogin, refreshToken } from './auth'

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

    let urlRequest = `${url}v1/temuan/store`

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

    if (!response.ok) {
      let errorMessage = 'Gagal simpan data!'

      if (data.message && typeof data.message === 'object') {
        errorMessage = Object.entries(data.message)
          .map(([key, messages]) => `${key}: ${messages.join(', ')}`)
          .join('; ')
      } else if (typeof data.message === 'string') {
        errorMessage = data.message
      }

      throw new Error(errorMessage)
    }

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

export const findTemuan = async id => {
  const token = Cookies.get('token')

  let urlRequest = `${url}v1/temuan/${id}/show`

  try {
    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return findTemuan(id)
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

export const updateTemuan = async (id, dataTemuan) => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/${id}/update`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateTemuan(id, dataTemuan)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const response = await fetch(urlRequest, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(dataTemuan)
    })

    if (response.status === 401) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return updateTemuan(id, dataTemuan)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    const data = await response.json()

    if (!response.ok) {
      let errorMessage = 'Gagal update data!'

      if (data.message && typeof data.message === 'object') {
        errorMessage = Object.entries(data.message)
          .map(([key, messages]) => `${key}: ${messages.join(', ')}`)
          .join('; ')
      } else if (typeof data.message === 'string') {
        errorMessage = data.message
      }

      throw new Error(errorMessage)
    }

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

export const deleteTemuan = async id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/${id}/delete`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return deleteTemuan(id)
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
        return deleteTemuan(id)
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

export const rejectTemuan = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/reject-temuan`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return rejectTemuan(dataLha)
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
        return rejectTemuan(dataLha)
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

export const submitTemuan = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/submit-temuan`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return submitTemuan(dataLha)
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
        return submitTemuan(dataLha)
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

export const acceptTemuan = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/accept-temuan`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return acceptTemuan(dataLha)
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
        return acceptTemuan(dataLha)
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

export const sendTemuanPic = async dataTemuan => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/send-temuan-to-pic`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return sendTemuanPic(dataTemuan)
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
        return sendTemuanPic(dataTemuan)
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

export const generateTemuanPdf = async id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/cetak/temuan/${id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return generateTemuanPdf(id)
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
        return generateTemuanPdf(id)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    if (!response.ok) {
      throw new Error('Gagal mendapatkan PDF')
    }

    const blob = await response.blob()

    return blob
  } catch (error) {
    console.error('Error dalam generatePdf:', error)
    throw error
  }
}

export const logTemuan = async id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/log-stage/${id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return logTemuan(id)
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
        return logTemuan(id)
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

export const tolakSelesaiInternalTemuan = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/tolak-selesai-internal`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return tolakSelesaiInternalTemuan(dataLha)
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
        return tolakSelesaiInternalTemuan(dataLha)
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

export const selesaiInternalTemuan = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/selesai-internal`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return selesaiInternalTemuan(dataLha)
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
        return selesaiInternalTemuan(dataLha)
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

export const dataTemuanHasilAuditor = async lha_id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/hasil-auditor/${lha_id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return dataTemuanHasilAuditor(page, pageSize, searchQuery)
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
        return dataTemuanHasilAuditor(page, pageSize, searchQuery)
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

export const tolakAuditorTemuan = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/tolak-auditor`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return tolakAuditorTemuan(dataLha)
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
        return tolakAuditorTemuan(dataLha)
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

export const terimaAuditorTemuan = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/terima-auditor`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return terimaAuditorTemuan(dataLha)
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
        return terimaAuditorTemuan(dataLha)
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

export const inputHasilAuditor = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/input-hasil-auditor`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return inputHasilAuditor(dataLha)
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
        return inputHasilAuditor(dataLha)
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

export const closingTemuan = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/closing-temuan`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return closingTemuan(dataLha)
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
        return closingTemuan(dataLha)
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

export const selesaiClosingTemuan = async dataLha => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/temuan/selesai-closing-temuan`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return selesaiClosingTemuan(dataLha)
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
        return selesaiClosingTemuan(dataLha)
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

export const generateMonitoringPdf = async id => {
  try {
    const token = Cookies.get('token')

    let urlRequest = `${url}v1/cetak/monitoring/${id}`

    if (!token) {
      const refreshSuccess = await refreshToken()

      if (refreshSuccess) {
        return generateMonitoringPdf(id)
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
        return generateMonitoringPdf(id)
      } else {
        throw new Error('Session expired, please login again.')
      }
    }

    if (!response.ok) {
      throw new Error('Gagal mendapatkan PDF')
    }

    const blob = await response.blob()

    return blob
  } catch (error) {
    console.error('Error dalam generatePdf:', error)
    throw error
  }
}
