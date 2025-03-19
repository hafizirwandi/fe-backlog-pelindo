'use client'
import React, { useEffect, useState } from 'react'

import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  FormControl,
  CardContent,
  Card,
  useMediaQuery,
  Pagination,
  PaginationItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material'
import Grid from '@mui/material/Grid2'

import {
  DataGrid,
  gridPageCountSelector,
  GridPagination,
  GridToolbarQuickFilter,
  useGridApiContext,
  useGridSelector
} from '@mui/x-data-grid'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid' // Import SweetAlert2

import { useDebouncedCallback } from '@coreui/react-pro'

import { Add } from '@mui/icons-material'

import CustomTextField from '@/@core/components/mui/TextField'

import CustomIconButton from '@core/components/mui/IconButton'
import { createUser, dataUsers, deleteUser, findUser, updateUser } from '@/utils/user'
import UnitSelect from '@/components/UnitSelect'
import DivisiSelect from '@/components/DivisiSelect'
import DepartemenSelect from '@/components/DepartemenSelect'
import { useAuth } from '@/context/AuthContext'
import JabatanSelect from '@/components/JabatanSelect'

const units = ['IT', 'HR', 'Finance']
const divisions = ['Development', 'Operations', 'Support']
const positions = ['Manager', 'Staff', 'Intern']
const statuses = ['Active', 'Inactive']
const roles = ['Group Role 1', 'Group Role 2']

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
        justifyContent: 'space-between',
        padding: '8px 16px',

        borderBottom: '1px solid #ddd'
      }}
    >
      {/* Title Section */}
      <Typography variant='h6' component='div' sx={{ fontWeight: 'bold' }}>
        Users
      </Typography>

      {/* Quick Filter Section */}
      <Stack direction='row' alignItems='center' spacing={1}>
        <GridToolbarQuickFilter
          placeholder='Search...'
          value={localSearch}
          onChange={e => setLocalSearch(e.target.value)}
        />
      </Stack>
    </Box>
  )
}

export default function Users() {
  const [rows, setRows] = useState([])
  const theme = useTheme()
  const { user } = useAuth()

  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))

  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    id: '',
    nama: '',
    nip: '',
    password: '',
    is_active: '',
    unit_id: '',
    divisi_id: '',
    departemen_id: '',
    jabatan_id: '',
    roles: []
  })

  const [isEdit, setIsEdit] = useState(false)
  const [selectedRoles, setSelectedRoles] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [totalRows, setTotalRows] = useState(0)

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:960px)')
  const pageSize = isMobile ? 5 : isTablet ? 10 : 20

  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    dataUsers(paginationModel.page + 1, paginationModel.pageSize, searchQuery)
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
  }, [paginationModel.page, paginationModel.pageSize, searchQuery])

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

  const columns = [
    {
      field: 'nama',
      headerName: 'Nama'
    },
    {
      field: 'nip',
      headerName: 'NIP'
    },
    {
      field: 'unit',
      headerName: 'Unit'
    },
    {
      field: 'divisi',
      headerName: 'Divisi'
    },
    {
      field: 'departemen',
      headerName: 'Departemen'
    },
    {
      field: 'jabatan',
      headerName: 'Jabatan'
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 150,
      renderCell: params => (
        <>
          {params.row.roles.map((role, index) => (
            <Chip key={index} label={role.nama} size='small' color='primary' variant='outlined' />
          ))}
        </>
      )
    },
    {
      field: 'is_active',
      headerName: 'Status'
    },

    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: params => (
        <>
          <CustomIconButton color='secondary' variant='text' size='small' onClick={() => handleEdit(params.row.id)}>
            <i className='tabler-pencil' />
          </CustomIconButton>
          <CustomIconButton color='secondary' variant='text' size='small' onClick={() => handleDelete(params.row.id)}>
            <i className='tabler-trash' />
          </CustomIconButton>
        </>
      )
    }
  ]

  const handleEdit = id => {
    findUser(id).then(res => {
      if (res.status) {
        const data = res.data
        const roleId = data.roles.map(item => item.id)

        console.log(roleId)

        setFormData({
          id: data.id,
          nama: data.nama,
          nip: data.nip,
          password: '',
          is_active: data.is_active,
          unit_id: data.unit_id,
          divisi_id: data.divisi_id,
          departemen_id: data.departemen_id,
          jabatan_id: data.jabatan_id,
          roles: roleId
        })

        setOpenDialog(true)
        setIsEdit(true)
      }
    })
  }

  const handleUpdate = async () => {
    const dataUser = {
      id: formData.id,
      nama: formData.nama,
      nip: formData.nip,
      password: formData.password,
      is_active: formData.is_active,
      unit_id: formData.unit_id,
      divisi_id: formData.divisi_id,
      departemen_id: formData.departemen_id,
      jabatan_id: formData.jabatan_id,
      roles: formData.roles
    }

    setLoading(true)

    try {
      const res = await updateUser(formData.id, dataUser)

      if (res.status) {
        setOpenDialog(false)
        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })
        const response = await dataUsers(paginationModel.page + 1, paginationModel.pageSize, searchQuery)

        if (response.status) {
          setRows(
            response.data.map((item, index) => ({
              no: index + 1 + paginationModel.page * paginationModel.pageSize,
              ...item
            }))
          )
          setTotalRows(response.pagination.total)
        }

        setOpenDialog(false)
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
      text: 'Apakah anda yakin ingin menghapus user ini!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        const res = await deleteUser(id)

        if (res.status) {
          await Swal.fire({
            title: 'Berhasil!',
            text: res.message,
            icon: 'success',
            showConfirmButton: false
          })
        }

        const response = await dataUsers(paginationModel.page + 1, paginationModel.pageSize, searchQuery)

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
          nama: '',
          nip: '',
          password: '',
          is_active: '',
          unit_id: '',
          divisi_id: '',
          departemen_id: '',
          jabatan_id: ''
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

  const handleCreate = async () => {
    let dataRequest = {
      nama: formData.nama,
      nip: formData.nip,
      password: formData.password,
      is_active: formData.is_active,
      unit_id: formData.unit_id,
      divisi_id: formData.divisi_id,
      departemen_id: formData.departemen_id,
      jabatan_id: formData.jabatan_id,
      roles: formData.roles
    }

    setLoading(true)

    try {
      const res = await createUser(dataRequest)

      if (res.status) {
        setOpenDialog(false)
        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })

        const response = await dataUsers(paginationModel.page + 1, paginationModel.pageSize, searchQuery)

        if (response.status) {
          setRows(
            response.data.map((item, index) => ({
              no: index + 1 + paginationModel.page * paginationModel.pageSize,
              ...item
            }))
          )
          setTotalRows(response.pagination.total)
        }

        setOpenDialog(false)
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

  const [permissions, setPermissions] = useState([])

  const defaultSelected = permissions.filter(p => p.checked)

  const [selectedPermissions, setSelectedPermissions] = useState(defaultSelected)

  const handleUnit = value => {
    let id = value ? value.id : ''

    setFormData(prev => ({ ...prev, unit_id: id }))
  }

  const handleDivisi = value => {
    let id = value ? value.id : ''

    setFormData(prev => ({ ...prev, divisi_id: id }))
  }

  const handleDepartemen = value => {
    let id = value ? value.id : ''

    setFormData(prev => ({ ...prev, departemen_id: id }))
  }

  const handleJabatan = value => {
    let id = value ? value.id : ''

    setFormData(prev => ({ ...prev, jabatan_id: id }))
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        aria-labelledby='responsive-dialog-title'
        open={openDialog}
        onClose={() => {
          setFormData({
            id: '',
            nama: '',
            nip: '',
            password: '',
            is_active: '',
            unit_id: '',
            divisi_id: '',
            departemen_id: '',
            jabatan_id: '',
            roles: []
          })
          setIsEdit(false)
          setOpenDialog(false)
        }}
        aria-describedby='dialog-description'
      >
        <DialogTitle>Form User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label='Nama'
            variant='outlined'
            margin='normal'
            value={formData.nama}
            onChange={e => setFormData({ ...formData, nama: e.target.value })}
          />
          <TextField
            fullWidth
            label='NIP'
            variant='outlined'
            margin='normal'
            value={formData.nip}
            onChange={e => setFormData({ ...formData, nip: e.target.value })}
          />
          <TextField
            fullWidth
            label='Password'
            variant='outlined'
            margin='normal'
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
          />
          {isEdit && <small className='small text-sm text-warning'>*Kosongkan jika tidak ingin merubah password</small>}
          <FormControl fullWidth margin='normal'>
            <UnitSelect value={formData.unit_id} onSelect={handleUnit} />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <DivisiSelect value={formData.divisi_id} unitId={formData.unit_id} onSelect={handleDivisi} />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <DepartemenSelect
              value={formData.departemen_id}
              divisiId={formData.divisi_id}
              onSelect={handleDepartemen}
            />
          </FormControl>
          <FormControl fullWidth margin='normal'>
            <JabatanSelect value={formData.jabatan_id} onSelect={handleJabatan} />
          </FormControl>
          <CustomTextField
            select
            fullWidth
            defaultValue=''
            label='Status User'
            value={formData.is_active}
            slotProps={{
              select: {
                displayEmpty: true,
                multiple: false
              }
            }}
            onChange={e => setFormData({ ...formData, is_active: e.target.value })}
          >
            <MenuItem value=''>
              <em>Pilih Status</em>
            </MenuItem>
            <MenuItem value={1}>Aktif</MenuItem>
            <MenuItem value={0}>Tidak Aktif</MenuItem>
          </CustomTextField>
          <FormControl fullWidth margin='normal'>
            <InputLabel id='file-dukung-label'>Role</InputLabel>
            <Select
              sx={{ mt: 3 }}
              multiple
              fullWidth
              value={formData.roles}
              label='Role'
              onChange={e => setFormData({ ...formData, roles: e.target.value })}
            >
              <MenuItem value=''>
                <em>Pilih Role</em>
              </MenuItem>
              <MenuItem value={1}>Admin</MenuItem>
              <MenuItem value={2}>Supervisor</MenuItem>
              <MenuItem value={3}>PIC</MenuItem>
              <MenuItem value={4}>Penanggung Jawab</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            sx={{ mt: 3 }}
            onClick={() => {
              setOpenDialog(false)
              setIsEdit(false)
            }}
          >
            Batal
          </Button>
          {isEdit ? (
            <Box>
              <Button
                type='submit'
                variant='contained'
                color='warning'
                loading={loading}
                sx={{ mt: 2 }}
                onClick={handleUpdate}
              >
                Update
              </Button>
            </Box>
          ) : (
            <Box>
              <Button
                type='submit'
                variant='contained'
                color='primary'
                loading={loading}
                sx={{ mt: 2 }}
                onClick={handleCreate}
              >
                Simpan
              </Button>
            </Box>
          )}
        </DialogActions>
      </Dialog>
      <Typography variant='h3' gutterBottom>
        Users
      </Typography>

      <Grid container spacing={2} sx={{ mt: 5 }}>
        {/* <Grid size={{ sm: 12, md: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant='h6'>Tambah User</Typography>
              <Typography variant='body2' color='textSecondary'>
                Inputkan data pengguna kedalam aplikasi untuk mengakses aplikasi.
              </Typography>
              <Button variant='contained' startIcon={<Add />} sx={{ mt: 2 }} onClick={() => setOpenDialog(true)}>
                Tambah
              </Button>
            </CardContent>
          </Card>
        </Grid> */}
        {/* <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ width: '100%' }}>
            <CardContent>
              <Typography variant='h6'>Filter Data Users</Typography>
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
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={12}>
          <Card>
            <CardContent>
              {/* DataGrid */}
              <Box sx={{ width: '100%' }}>
                <Button variant='contained' startIcon={<Add />} sx={{ mb: 3 }} onClick={() => setOpenDialog(true)}>
                  Tambah
                </Button>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  loading={loading}
                  paginationMode='server'
                  columnVisibilityModel={{ id: false }}
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
                  pageSizeOptions={[10, 20, 50]}
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
