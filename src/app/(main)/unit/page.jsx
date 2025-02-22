'use client'
import React, { useEffect, useRef, useState } from 'react'

import {
  Box,
  Button,
  CardContent,
  Stack,
  TextField,
  Typography,
  Card,
  useMediaQuery,
  IconButton,
  Icon
} from '@mui/material'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import { useDebouncedCallback, useDebounce } from '@coreui/react-pro'

import { Delete, Edit } from '@mui/icons-material'

import Swal from 'sweetalert2'

import { createUnit, dataUnit, deleteUnit, findUnit, updateUnit } from '@/utils/unit'

const CustomToolbar = ({ searchQuery, setSearchQuery }) => {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const debouncedSearch = useDebouncedCallback(value => {
    setSearchQuery(value)
  }, 500)

  useEffect(() => {
    debouncedSearch(localSearch)
  }, [localSearch, debouncedSearch])

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        borderBottom: '1px solid #ddd'
      }}
    >
      <Stack direction='row' alignItems='center' spacing={1} sx={{ justifyContent: 'flex-end', width: '100%' }}>
        <TextField
          variant='outlined'
          placeholder='Search...'
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
          size='small'
        />
      </Stack>
    </Box>
  )
}

export default function DataGridDemo() {
  // Form
  const [formData, setFormData] = useState({ id: '', nama: '' })
  const [isEdit, setIsEdit] = useState(false)
  const inputRef = useRef(null)

  // Table
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  // View responsive
  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:960px)')
  const pageSize = isMobile ? 5 : isTablet ? 10 : 20

  useEffect(() => {
    setLoading(true)

    dataUnit(paginationModel.page + 1, paginationModel.pageSize, searchQuery)
      .then(response => {
        if (response.status) {
          let data = response.data

          data = data.map((item, index) => ({
            no: index + 1 + paginationModel.page * paginationModel.pageSize,
            ...item
          }))
          setRows(data)
          setTotalRows(response.pagination.total)
        }

        setLoading(false)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setLoading(false)
      })

    if (isEdit && inputRef.current) {
      inputRef.current.focus()
    }
  }, [paginationModel.page, paginationModel.pageSize, searchQuery, isEdit])

  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    {
      field: 'no',
      headerName: 'No',
      width: 70
    },
    { field: 'nama', headerName: 'Nama', flex: 1 },
    {
      field: 'actions',
      headerName: 'Aksi',
      renderCell: params => (
        <>
          <IconButton
            size='small'
            color='primary'
            onClick={() => handleEdit(params.row.id)}
            sx={{ width: 24, height: 24 }}
          >
            <Edit fontSize='small' />
          </IconButton>
          <IconButton
            size='small'
            color='warning'
            onClick={() => handleDelete(params.row.id, params.row.nama)}
            sx={{ width: 24, height: 24 }}
          >
            <Delete fontSize='small' />
          </IconButton>
        </>
      )
    }
  ]

  const handleEdit = id => {
    findUnit(id).then(res => {
      if (res.status) {
        setFormData({
          id: res.data.id,
          nama: res.data.nama
        })

        setIsEdit(true)

        setTimeout(() => inputRef.current?.focus(), 50)
      }
    })
  }

  const handleDelete = async (id, nama) => {
    setLoading(true)

    const result = await Swal.fire({
      title: 'Konfirmasi?',
      text: `Apakah anda yakin ingin menghapus Unit ${nama}!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
      try {
        const res = await deleteUnit(id)

        if (res.status) {
          await Swal.fire({
            title: 'Berhasil!',
            text: res.message,
            icon: 'success',
            showConfirmButton: false
          })
        }

        const response = await dataUnit(paginationModel.page + 1, paginationModel.pageSize, searchQuery)

        if (response.status) {
          setRows(
            response.data.map((item, index) => ({
              no: index + 1 + paginationModel.page * paginationModel.pageSize,
              ...item
            }))
          )
          setTotalRows(response.pagination.total)
        }

        setFormData({ id: '', nama: '' })
      } catch (err) {
        Swal.fire({
          title: 'Gagal!',
          text: err.message || 'Terjadi kesalahan',
          icon: 'error'
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleUpdate = async () => {
    setLoading(true)

    Swal.fire({
      title: 'Sedang Proses...',
      text: 'Mohon tunggu sebentar',
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading()
      }
    })

    try {
      const res = await updateUnit(formData.id, formData)

      if (res.status) {
        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false
        })

        const response = await dataUnit(paginationModel.page + 1, paginationModel.pageSize, searchQuery)

        if (response.status) {
          setRows(
            response.data.map((item, index) => ({
              no: index + 1 + paginationModel.page * paginationModel.pageSize,
              ...item
            }))
          )
          setTotalRows(response.pagination.total)
        }

        setFormData({ id: '', nama: '' }) // Reset form
        setIsEdit(false)
      }
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: err.message || 'Terjadi kesalahan',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    setLoading(true)

    if (!formData.nama.trim()) {
      Swal.fire('Peringatan', 'Nama tidak boleh kosong!', 'warning')

      return
    }

    try {
      const res = await createUnit(formData)

      if (res.status) {
        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false
        })

        const response = await dataUnit(paginationModel.page + 1, paginationModel.pageSize, searchQuery)

        if (response.status) {
          setRows(
            response.data.map((item, index) => ({
              no: index + 1 + paginationModel.page * paginationModel.pageSize,
              ...item
            }))
          )
          setTotalRows(response.pagination.total)
        }

        setFormData({ id: '', nama: '' })
      }
    } catch (err) {
      Swal.fire({
        title: 'Gagal!',
        text: err.message || 'Terjadi kesalahan',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Typography variant='h3'>Unit</Typography>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        {/* Card Form */}
        <Card sx={{ flex: { xs: '1', md: '30%' }, padding: 2, maxHeight: { md: 200 } }}>
          <CardContent>
            <Typography variant='h6'>Form Unit</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                size='small'
                label='Nama'
                fullWidth
                value={formData.nama}
                onChange={e => setFormData({ ...formData, nama: e.target.value })}
                inputRef={inputRef}
              />
              {isEdit ? (
                <Stack direction='row' spacing={1}>
                  <Button size='small' variant='contained' color='primary' onClick={handleUpdate} disabled={loading}>
                    {loading ? 'Memproses...' : 'Ubah'}
                  </Button>
                  <Button
                    size='small'
                    variant='outlined'
                    color='secondary'
                    onClick={() => {
                      setFormData({ id: '', nama: '' }) // Reset form
                      setIsEdit(false) // Keluar dari mode edit
                    }}
                    disabled={loading}
                  >
                    Batal
                  </Button>
                </Stack>
              ) : (
                <Button size='small' variant='contained' color='primary' onClick={handleCreate} disabled={loading}>
                  {loading ? 'Memproses...' : 'Tambah'}
                </Button>
              )}
            </Box>
          </CardContent>
        </Card>

        {/* Card Tabel */}
        <Card sx={{ flex: { xs: '1', md: '70%' } }}>
          <CardContent>
            <Typography variant='h6'>Data Unit</Typography>
            <Box sx={{ mt: 2, width: '100%' }}>
              <DataGrid
                rows={rows}
                columns={columns}
                columnVisibilityModel={{ id: false }}
                loading={loading}
                paginationMode='server'
                rowCount={totalRows}
                paginationModel={paginationModel}
                onPaginationModelChange={newModel => {
                  setPaginationModel(prev => ({
                    ...prev,
                    page: newModel.page,
                    pageSize: newModel.pageSize
                  }))
                }}
                pageSizeOptions={[10, 20, 50]}
                pageSize={pageSize}
                slots={{ toolbar: () => <CustomToolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} /> }}
              />
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
