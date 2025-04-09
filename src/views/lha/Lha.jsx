'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import dynamic from 'next/dynamic'

import {
  Typography,
  TextField,
  Button,
  CardContent,
  Card,
  Stack,
  CardHeader,
  Chip,
  IconButton,
  Box,
  useMediaQuery,
  Pagination,
  PaginationItem,
  Tooltip,
  Dialog,
  useTheme,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  CardActions,
  MenuItem
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Grid from '@mui/material/Grid2'
import { DataGrid, gridPageCountSelector, GridPagination, useGridApiContext, useGridSelector } from '@mui/x-data-grid'
import { Add, Delete, Edit, ListAlt, PlaylistAdd, PlusOne, Send } from '@mui/icons-material'

import { useDebouncedCallback } from '@coreui/react-pro'

import Swal from 'sweetalert2'

import { createLha, dataLha, deleteLha, findLha, updateLha } from '@/utils/lha'
import { useAuth } from '@/context/AuthContext'
import CustomTextField from '@/@core/components/mui/TextField'

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

export default function Lha() {
  const { user, loadingUser } = useAuth()
  const [openDialog, setOpenDialog] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const router = useRouter()

  // Form
  const [formData, setFormData] = useState({
    id: '',
    judul: '',
    nomor: '',
    tanggal: new Date().toISOString().split('T')[0],
    periode: '',
    deskripsi: ''
  })

  const [isEdit, setIsEdit] = useState(false)
  const inputRef = useRef(null)

  // Table
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState([])
  const [totalRows, setTotalRows] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTable, setFilterTable] = useState([])

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5
  })

  // View responsive
  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:960px)')
  const pageSize = isMobile ? 5 : isTablet ? 10 : 20

  const statusColor = {
    0: 'secondary',
    1: 'primary',
    2: 'success'
  }

  const fetchData = useCallback(() => {
    setLoading(true)

    dataLha(paginationModel.page + 1, paginationModel.pageSize, searchQuery)
      .then(response => {
        if (response.status) {
          let data = response.data.map((item, index) => ({
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
  }, [paginationModel.page, paginationModel.pageSize, searchQuery])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleClick = id => {
    router.push(`/temuan?lha=${id}`)
  }

  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    {
      field: 'no',
      headerName: 'No',
      width: 70
    },
    { field: 'no_lha', headerName: 'No. LHA', flex: 1 },
    { field: 'judul', headerName: 'Judul', flex: 1 },
    { field: 'periode', headerName: 'Periode', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: params => (
        <>
          <Chip
            label={params.row.status_name ?? '-'}
            variant='outlined'
            color={statusColor[params.row.status]}
            size='small'
          />
        </>
      )
    },

    // {
    //   field: 'last_stage',
    //   headerName: 'Stage/Posisi LHA',
    //   flex: 1,
    //   renderCell: params => (
    //     <>
    //       <Chip label={params.row.stage_name ?? '-'} variant='outlined' color='primary' size='small' />
    //     </>
    //   )
    // },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: params => (
        <>
          {user?.permissions?.includes('read lha') && (
            <Tooltip title='Lihat detail LHA' arrow>
              <IconButton
                size='small'
                color='secondary'
                sx={{ width: 24, height: 24 }}
                onClick={() => handleDetail(params.row.id)}
              >
                <VisibilityIcon fontSize='small' />
              </IconButton>
            </Tooltip>
          )}

          {user?.permissions?.includes('read temuan') && (
            <Tooltip title='Temuan' arrow>
              <IconButton
                size='small'
                color='primary'
                sx={{ width: 24, height: 24 }}
                onClick={() => handleClick(params.row.id)}
              >
                <PlaylistAdd fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
          {user?.permissions?.includes('update lha') && params.row.status === '0' && (
            <Tooltip title='Edit LHA' arrow>
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
          {user?.permissions?.includes('delete lha') && params.row.status === '0' && (
            <Tooltip title='Hapus LHA' arrow>
              <IconButton
                size='small'
                color='error'
                onClick={() => handleDelete(params.row.id)}
                sx={{ width: 24, height: 24 }}
              >
                <Delete fontSize='small' />
              </IconButton>
            </Tooltip>
          )}
        </>
      )
    }
  ]

  const CustomPagination = () => {
    const apiRef = useGridApiContext()
    const pageCount = useGridSelector(apiRef, gridPageCountSelector)
    const page = apiRef.current.state.pagination.paginationModel.page
    const pageSize = apiRef.current.state.pagination.paginationModel.pageSize

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {/* Rows per page di kiri */}
        <GridPagination
          sx={{
            flexGrow: 0, // Supaya tidak memenuhi ruang
            '& .MuiTablePagination-displayedRows': { display: 'none' }, // Hilangkan spacer bawaan
            '& .MuiTablePagination-actions': { display: 'none' } // Hilangkan tombol next/prev bawaan
          }}
        />

        {/* Range data + Pagination di kanan */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='body2'>
            {`${page * pageSize + 1}–${Math.min((page + 1) * pageSize, totalRows)} of ${totalRows}`}
          </Typography>

          <Pagination
            count={pageCount}
            page={page + 1}
            onChange={(event, newPage) => apiRef.current.setPage(newPage - 1)}
            renderItem={item => <PaginationItem {...item} />}
          />
        </Box>
      </Box>
    )
  }

  const handleEdit = id => {
    findLha(id).then(res => {
      if (res.status) {
        const data = res.data

        setFormData({
          id: data.id,
          judul: data.judul ?? '-',
          nomor: data.no_lha ?? '-',
          tanggal: data.tanggal ?? new Date().toISOString().split('T')[0],
          periode: data.periode ?? '-',
          deskripsi: data.deskripsi ?? '-'
        })

        setOpenDialog(true)

        setIsEdit(true)

        setTimeout(() => inputRef.current?.focus(), 50)
      }
    })
  }

  const handleSubmit = async () => {
    let dataRequest = {
      judul: formData.judul,
      no_lha: formData.nomor,
      periode: formData.periode,
      tanggal: formData.tanggal,
      deskripsi: formData.deskripsi
    }

    setLoading(true)

    try {
      const res = await createLha(dataRequest)

      if (res.status) {
        setOpenDialog(false)
        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })

        const response = await dataLha(paginationModel.page + 1, paginationModel.pageSize, searchQuery)

        if (response.status) {
          setRows(
            response.data.map((item, index) => ({
              no: index + 1 + paginationModel.page * paginationModel.pageSize,
              ...item
            }))
          )
          setTotalRows(response.pagination.total)
        }

        setFormData({
          id: '',
          judul: '',
          nomor: '',
          tanggal: new Date().toISOString().split('T')[0],
          periode: '',
          deskripsi: ''
        })
      } else {
        throw new Error(res.message)
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

  const handleUpdate = async () => {
    let dataRequest = {
      judul: formData.judul,
      no_lha: formData.nomor,
      periode: formData.periode,
      tanggal: formData.tanggal,
      deskripsi: formData.deskripsi
    }

    setLoading(true)

    try {
      const res = await updateLha(formData.id, dataRequest)

      if (res.status) {
        setOpenDialog(false)
        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false
        })

        const response = await dataLha(paginationModel.page + 1, paginationModel.pageSize, searchQuery)

        if (response.status) {
          setRows(
            response.data.map((item, index) => ({
              no: index + 1 + paginationModel.page * paginationModel.pageSize,
              ...item
            }))
          )
          setTotalRows(response.pagination.total)
        }

        setFormData({
          id: '',
          judul: '',
          nomor: '',
          tanggal: new Date().toISOString().split('T')[0],
          periode: '',
          deskripsi: ''
        })
        setIsEdit(false)
      } else {
        throw new Error(res.message)
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

  const handleDelete = async id => {
    setLoading(true)

    const result = await Swal.fire({
      title: 'Konfirmasi?',
      text: `Apakah anda yakin ingin menghapus LHA ini!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
      try {
        const res = await deleteLha(id)

        if (res.status) {
          await Swal.fire({
            title: 'Berhasil!',
            text: res.message,
            icon: 'success',
            showConfirmButton: false
          })
        }

        const response = await dataLha(paginationModel.page + 1, paginationModel.pageSize, searchQuery)

        if (response.status) {
          setRows(
            response.data.map((item, index) => ({
              no: index + 1 + paginationModel.page * paginationModel.pageSize,
              ...item
            }))
          )
          setTotalRows(response.pagination.total)
        }

        setFormData({
          id: '',
          judul: '',
          nomor: '',
          tanggal: new Date().toISOString().split('T')[0],
          periode: '',
          deskripsi: ''
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

    setLoading(false)
  }

  const handleDetail = id => {
    router.push(`/lha/${id}/detail`)
  }

  const handleFilter = async () => {
    setLoading(true)
    const response = await dataLha(paginationModel.page + 1, paginationModel.pageSize, searchQuery, filterTable)

    if (response.status) {
      setRows(
        response.data.map((item, index) => ({
          no: index + 1 + paginationModel.page * paginationModel.pageSize,
          ...item
        }))
      )
      setTotalRows(response.pagination.total)
    }

    setLoading(false)
  }

  return (
    <>
      <Typography variant='h4' gutterBottom>
        LHA (Laporan Hasil Audit)
      </Typography>
      {user?.permissions?.includes('create lha') && (
        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid size={{ sm: 12, md: 4 }}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant='h6'>Tambah LHA</Typography>
                <Typography variant='body2' color='textSecondary'>
                  Inputkan hasil audit baru untuk merekam proses dan temuan dari audit yang telah dilakukan.
                </Typography>
                <Button variant='contained' startIcon={<Add />} sx={{ mt: 2 }} onClick={() => setOpenDialog(true)}>
                  Tambah
                </Button>
              </CardContent>
            </Card>
          </Grid>
          {/* <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ width: '100%' }}>
              <CardContent>
                <Typography variant='h6'>Filter Data LHA</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label='Posisi LHA'
                    slotProps={{
                      select: {
                        displayEmpty: true,
                        multiple: false
                      }
                    }}
                    onChange={e => setFilterTable({ ...filterTable, last_stage: e.target.value })}
                  >
                    <MenuItem value=''>
                      <em>Pilih Status</em>
                    </MenuItem>
                    <MenuItem value={1}>Admin</MenuItem>
                    <MenuItem value={2}>Supervisor</MenuItem>
                    <MenuItem value={3}>PIC</MenuItem>
                    <MenuItem value={4}>Penanggung Jawab</MenuItem>
                    <MenuItem value={5}>Auditor</MenuItem>
                    <MenuItem value={6}>Selesai</MenuItem>
                  </CustomTextField>
                  <CustomTextField
                    select
                    fullWidth
                    defaultValue=''
                    label='Status'
                    slotProps={{
                      select: {
                        displayEmpty: true,
                        multiple: false
                      }
                    }}
                    onChange={e => setFilterTable({ ...filterTable, status: e.target.value })}
                  >
                    <MenuItem value=''>
                      <em>Pilih Status</em>
                    </MenuItem>
                    <MenuItem value={0}>Draf</MenuItem>
                    <MenuItem value={1}>Proses</MenuItem>
                    <MenuItem value={3}>Selesai</MenuItem>
                    <MenuItem value={2}>Ditolak</MenuItem>
                  </CustomTextField>
                </Box>
                <Button variant='contained' sx={{ mt: 2 }} fullWidth onClick={handleFilter}>
                  Terapkan Filter
                </Button>
              </CardContent>
            </Card>
          </Grid> */}
        </Grid>
      )}
      {user?.permissions?.includes('create lha', 'update lha') && (
        <Dialog
          fullScreen={fullScreen}
          aria-labelledby='responsive-dialog-title'
          open={openDialog}
          onClose={() => {
            setFormData({
              id: '',
              judul: '',
              nomor: '',
              tanggal: new Date().toISOString().split('T')[0],
              periode: '',
              deskripsi: ''
            })
            setIsEdit(false)
            setOpenDialog(false)
          }}
          aria-describedby='dialog-description'
        >
          <DialogTitle>Form Laporan Hasil Audit</DialogTitle>
          <DialogContent>
            <Stack spacing={2}>
              <Box>
                <TextField
                  fullWidth
                  required
                  label='Judul'
                  type='text'
                  variant='outlined'
                  onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  inputRef={inputRef}
                  value={formData.judul}
                />
              </Box>
              {/* Form Input */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='Nomor'
                    variant='outlined'
                    onChange={e => setFormData({ ...formData, nomor: e.target.value })}
                    value={formData.nomor}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='Tanggal'
                    type='date'
                    variant='outlined'
                    onChange={e => setFormData({ ...formData, tanggal: e.target.value })}
                    value={formData.tanggal}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    fullWidth
                    label='Periode Audit'
                    type='year'
                    variant='outlined'
                    onChange={e => setFormData({ ...formData, periode: e.target.value })}
                    value={formData.periode}
                  />
                </Grid>
              </Grid>
              <CustomTextField
                fullWidth
                rows={4}
                multiline
                label='Deskripsi'
                placeholder='Masukkan deskripsi...'
                onChange={e => setFormData({ ...formData, deskripsi: e.target.value })}
                value={formData.deskripsi}
                sx={{ '& .MuiInputBase-root.MuiFilledInput-root': { alignItems: 'baseline' } }}
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
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button
              variant='contained'
              color='secondary'
              sx={{ mt: 3 }}
              onClick={() => {
                setFormData({
                  id: '',
                  judul: '',
                  nomor: '',
                  tanggal: new Date().toISOString().split('T')[0],
                  periode: '',
                  deskripsi: ''
                })
                setIsEdit(false)
                setOpenDialog(false)
              }}
            >
              Batal
            </Button>
            {isEdit && user?.permissions?.includes('update lha') ? (
              <Box>
                <Button
                  type='submit'
                  variant='contained'
                  color='primary'
                  sx={{ mt: 3 }}
                  loading={loading}
                  onClick={handleUpdate}
                >
                  Ubah
                </Button>
              </Box>
            ) : (
              <Box>
                <Button
                  type='submit'
                  variant='contained'
                  loading={loading}
                  color='primary'
                  sx={{ mt: 3 }}
                  onClick={handleSubmit}
                >
                  Simpan
                </Button>
              </Box>
            )}
          </DialogActions>
        </Dialog>
      )}
      {/* Table */}
      <Grid container spacing={2} sx={{ mt: 5 }}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Box sx={{ mt: 2, width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  columnVisibilityModel={{ id: false }}
                  loading={loading}
                  paginationMode='server'
                  rowCount={totalRows}
                  pagination
                  paginationModel={paginationModel}
                  onPaginationModelChange={newModel => {
                    setPaginationModel(prev => ({
                      ...prev,
                      page: newModel.page,
                      pageSize: newModel.pageSize
                    }))
                  }}
                  pageSizeOptions={[5, 10, 20, 50]}
                  pageSize={pageSize}
                  slots={{
                    toolbar: () => <CustomToolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,

                    pagination: CustomPagination
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
