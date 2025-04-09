'use client'
import React, { useCallback, useEffect, useState } from 'react'

import { useParams, useRouter } from 'next/navigation'

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Divider,
  Grid2,
  TextField,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  useMediaQuery,
  useTheme,
  IconButton,
  Chip,
  Tooltip,
  InputAdornment
} from '@mui/material'
import Swal from 'sweetalert2'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { Edit, Delete, Visibility as VisibilityIcon, PlaylistAdd } from '@mui/icons-material'

import { DataGrid, gridClasses } from '@mui/x-data-grid'

import { findTemuan } from '@/utils/temuan'

import {
  createRekomendasi,
  dataRekomendasi,
  deleteRekomendasi,
  findRekomendasi,
  updateRekomendasi
} from '@/utils/rekomendasi'
import { useAuth } from '@/context/AuthContext'
import CustomTextField from '@/@core/components/mui/TextField'

dayjs.locale('id')

const statusColor = {
  0: 'secondary',
  1: 'primary',
  2: 'success',
  3: 'error'
}

export default function DetailTemuan() {
  const { user } = useAuth()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [detailData, setDetailData] = useState(null)

  const [isEdit, setIsEdit] = useState(false)

  const [loading, setLoading] = useState(false)

  const [rows, setRows] = useState([])

  const id = useParams()

  const router = useRouter()

  const [formData, setFormData] = useState({
    temuan_id: '',
    nomor: '',
    deskripsi: '',
    batas_tanggal: '',
    tanggal_selesai: '',
    status: 0
  })

  const fetchDetailData = useCallback(async () => {
    if (!id) return

    try {
      const idTemuan = id.id

      setLoading(true)
      const response = await findTemuan(idTemuan)

      if (response.status) {
        setDetailData(response.data)
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: response.message || 'Terjadi kesalahan',
          icon: 'error'
        })
      }
    } catch (error) {
      setLoading(false)
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }, [id])

  const fetchRekomendasiData = async id => {
    if (!id) return
    const idTemuan = id

    try {
      const response = await dataRekomendasi(idTemuan)

      if (response.status) {
        return response.data.map((item, index) => ({
          ...item,
          no: index + 1
        }))
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: response.message || 'Terjadi kesalahan',
          icon: 'error'
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan',
        icon: 'error'
      })
    }
  }

  useEffect(() => {
    fetchDetailData()

    setFormData(prev => ({ ...prev, temuan_id: id.id }))
  }, [fetchDetailData, id])

  useEffect(() => {
    if (detailData?.rekomendasi) {
      setRows(
        detailData.rekomendasi.map((item, index) => ({
          ...item,
          no: index + 1
        }))
      )
    }
  }, [detailData?.rekomendasi])

  if (!detailData) {
    return null
  }

  const handleUrlTindaklanjut = idRekomendasi => {
    const idTemuan = id.id

    router.push(`rekomendasi/${idRekomendasi}/tindak-lanjut`)
  }

  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    {
      field: 'no',
      headerName: 'No',
      width: 50,
      headerAlign: 'center',
      align: 'center'
    },
    { field: 'nomor', headerName: 'Nomor Rekomendasi', width: 150 },
    {
      field: 'deskripsi',
      headerName: 'Deskripsi',
      width: 300,
      renderCell: params => <p style={{ whiteSpace: 'pre-line' }}>{params.row.deskripsi}</p>
    },
    { field: 'batas_tanggal', headerName: 'Batas Tanggal', width: 150 },
    detailData.last_stage !== 1 ? { field: 'tanggal_selesai', headerName: 'Tanggal Selesai', width: 150 } : null,
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      alignItems: 'center',
      renderCell: params => (
        <Chip
          label={params.row.status_name ?? '-'}
          variant='outlined'
          color={statusColor[params.row.status]}
          size='small'
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <>
          {user?.permissions?.includes('read tindaklanjut') && (
            <Tooltip title='Tindaklanjut' arrow>
              <IconButton
                size='small'
                color='primary'
                sx={{ width: 24, height: 24 }}
                onClick={() => handleUrlTindaklanjut(params.row.id)}
              >
                <PlaylistAdd fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          {user?.permissions?.includes('update rekomendasi') &&
            checkId(detailData.last_stage) &&
            !params.row.is_spi && (
              <Tooltip title='Ubah Rekomendasi' arrow>
                <IconButton
                  size='small'
                  color='warning'
                  onClick={() => handleEdit(params.row.id)}
                  sx={{ width: 24, height: 24 }}
                >
                  <Edit fontSize='small' />
                </IconButton>
              </Tooltip>
            )}

          {user?.permissions?.includes('delete rekomendasi') &&
            checkId(detailData.last_stage) &&
            !params.row.is_spi && (
              <Tooltip title='Tindak Lanjut' arrow>
                <IconButton
                  size='small'
                  color='error'
                  onClick={() => handleDeleteRekomendasi(params.row.id)}
                  sx={{ width: 24, height: 24 }}
                >
                  <Delete fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
        </>
      )
    }
  ].filter(Boolean)

  const handleCreateRekomendasi = async () => {
    const dataRekomendasi = {
      id: formData.id,
      temuan_id: formData.temuan_id,
      nomor: formData.nomor,
      deskripsi: formData.deskripsi,
      batas_tanggal: formData.batas_tanggal,
      tanggal_selesai: formData.tanggal_selesai,
      status: formData.status
    }

    setLoading(true)

    try {
      let res = null

      if (formData.id) {
        res = await updateRekomendasi(dataRekomendasi)
      } else {
        res = await createRekomendasi(dataRekomendasi)
      }

      if (res.status) {
        setIsEdit(false)

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          backdrop: false
        })

        fetchRekomendasiData(formData.temuan_id).then(data => setRows(data))

        setFormData({
          id: '',
          temuan_id: formData.temuan_id,
          nomor: '',
          deskripsi: '',
          batas_tanggal: '',
          tanggal_selesai: '',
          status: 0
        })
      }
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async id => {
    try {
      const res = await findRekomendasi(id)

      if (res.status) {
        setFormData(res.data)
        setIsEdit(true)
      }
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan',
        icon: 'error'
      })
    }
  }

  const handleDeleteRekomendasi = async id => {
    setLoading(true)

    const result = await Swal.fire({
      title: 'Konfirmasi?',
      text: `Apakah anda yakin ingin menghapus Rekomendasi ini!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
      try {
        const res = await deleteRekomendasi(id)

        if (!res.status) {
          throw new Error(res.message)
        }

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false
        })

        fetchRekomendasiData(formData.temuan_id).then(data => setRows(data))

        setFormData({
          id: '',
          temuan_id: formData.temuan_id,
          nomor: '',
          deskripsi: '',
          batas_tanggal: '',
          tanggal_selesai: '',
          status: 0
        })
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

  const checkId = idToCheck => {
    return user?.roleAndPermissions?.some(role => role.id === idToCheck)
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Detail Temuan'
          action={
            <Box>
              <Button
                variant='contained'
                color='secondary'
                onClick={() => router.push(`/temuan?lha=${detailData.lha_id}`)}
                sx={{ mx: 2 }}
              >
                Kembali
              </Button>
              <Button
                variant='contained'
                color='primary'
                onClick={() => router.push(`/lha/${detailData.lha_id}/detail`)}
              >
                Lihat Detail LHA
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Grid2 container spacing={5}>
            {' '}
            <Grid2 size={{ xs: 12, md: 5 }}>
              <Typography variant='h6' gutterBottom>
                LHA
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.lha}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Nomor
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.nomor}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Judul
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.judul}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Deskripsi
              </Typography>
              <Box sx={{ mt: 1 }}>
                <Typography variant='body1' gutterBottom style={{ whiteSpace: 'pre-line' }}>
                  {detailData.deskripsi}
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Unit
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.unit}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Divisi
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.divisi}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Departemen
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.departemen}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Status
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.status_name}
              </Typography>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box sx={{ height: 'auto', minHeight: 400 }}>
                <Typography variant='h6' gutterBottom>
                  Rekomendasi
                </Typography>
                {user?.permissions?.includes('create rekomendasi') && checkId(detailData.last_stage) && (
                  <Button variant='contained' color='primary' onClick={() => setIsEdit(true)}>
                    Tambah Rekomendasi
                  </Button>
                )}
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 2 }} />
                </Box>
                <DataGrid
                  loading={loading}
                  columnVisibilityModel={{ id: false }}
                  rows={rows}
                  columns={columns}
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  getRowHeight={() => 'auto'}
                  sx={{
                    [`& .${gridClasses.cell}`]: {
                      py: 3
                    }
                  }}
                />
              </Box>
            </Grid2>
            {user?.permissions?.some(permission =>
              ['create rekomendasi', 'update rekomendasi'].includes(permission)
            ) && (
              <Grid2 size={{ xs: 12 }}>
                <Dialog
                  fullScreen={fullScreen}
                  aria-labelledby='rekomendasi-dialog'
                  open={isEdit}
                  onClose={() => setIsEdit(false)}
                  aria-describedby='dialog-rekomendasi-description'
                  maxWidth={'sm'}
                  fullWidth={true}
                >
                  <DialogTitle>Form Rekomendasi</DialogTitle>
                  <DialogContent>
                    <TextField
                      fullWidth
                      label='Nomor'
                      variant='outlined'
                      margin='normal'
                      value={formData.nomor}
                      onChange={e => setFormData({ ...formData, nomor: e.target.value })}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 4,
                          mt: 2,
                          flexDirection: { xs: 'column', sm: 'row' }
                        }}
                      >
                        <DatePicker
                          label='Batas Tanggal'
                          value={formData.batas_tanggal ? dayjs(formData.batas_tanggal) : null}
                          format='DD/MM/YYYY'
                          onChange={newValue =>
                            setFormData({
                              ...formData,
                              batas_tanggal: newValue ? dayjs(newValue).format('YYYY-MM-DD') : ''
                            })
                          }
                          slotProps={{ textField: { fullWidth: true } }} // Agar input full width
                          sx={{ width: '100%' }}
                        />
                        {detailData.last_stage !== 1 && (
                          <DatePicker
                            label='Tanggal Selesai'
                            value={formData.tanggal_selesai ? dayjs(formData.tanggal_selesai) : null}
                            format='DD/MM/YYYY'
                            onChange={newValue =>
                              setFormData({
                                ...formData,
                                tanggal_selesai: newValue ? dayjs(newValue).format('YYYY-MM-DD') : ''
                              })
                            }
                            slotProps={{ textField: { fullWidth: true } }} // Agar input full width
                            sx={{ width: '100%' }}
                          />
                        )}
                      </Box>
                    </LocalizationProvider>
                    <CustomTextField
                      fullWidth
                      rows={4}
                      multiline
                      label='Deskripsi'
                      placeholder='Masukkan deskripsi...'
                      onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                      value={formData.deskripsi}
                      sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' }, mt: 3 }}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position='start'>
                              <i className='tabler-message' />
                            </InputAdornment>
                          )
                        }
                      }}
                    />
                    <FormControl fullWidth margin='normal'>
                      <InputLabel>Status</InputLabel>
                      <Select
                        id='demo-simple-select'
                        value={formData.status}
                        label='Status'
                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                      >
                        <MenuItem value={0} selected>
                          BD (Belum Ditindaklanjuti)
                        </MenuItem>
                        <MenuItem value={1}>BS (Belum Selesai)</MenuItem>
                        <MenuItem value={2}>Selesai</MenuItem>
                        <MenuItem value={3}>Batal</MenuItem>
                      </Select>
                    </FormControl>
                  </DialogContent>
                  <DialogActions>
                    <Button variant='contained' color='secondary' onClick={() => setIsEdit(false)}>
                      Close
                    </Button>
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      onClick={handleCreateRekomendasi}
                      disabled={loading}
                      loading={loading}
                    >
                      Submit
                    </Button>
                  </DialogActions>
                </Dialog>
              </Grid2>
            )}
          </Grid2>
        </CardContent>
      </Card>
    </>
  )
}
