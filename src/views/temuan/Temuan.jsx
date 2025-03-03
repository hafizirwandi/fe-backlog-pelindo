'use client'
import React, { useCallback, useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
  Stack,
  IconButton,
  TableRow,
  Table,
  TableHead,
  TableCell,
  TableBody,
  Chip,
  useMediaQuery,
  Pagination,
  PaginationItem
} from '@mui/material'
import Swal from 'sweetalert2'
import Grid from '@mui/material/Grid2'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { DataGrid, gridPageCountSelector, GridPagination, useGridApiContext, useGridSelector } from '@mui/x-data-grid'
import { Delete, Edit } from '@mui/icons-material'
import { useDebouncedCallback } from '@coreui/react-pro'

import CustomIconButton from '@core/components/mui/IconButton'
import { dataLha } from '@/utils/lha'
import LHASelect from '@/components/LhaSelect'
import { createTemuan, dataTemuan, dataTemuanByLha, deleteTemuan, findTemuan, updateTemuan } from '@/utils/temuan'
import UnitSelect from '@/components/UnitSelect'
import QuillEditor from '@/components/QuillEditor'
import DivisiSelect from '@/components/DivisiSelect'
import DepartemenSelect from '@/components/DepartemenSelect'

const CustomToolbar = ({ searchQuery, setSearchQuery }) => {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  const debouncedSearch = useDebouncedCallback(value => {
    setSearchQuery(value)
  }, 500)

  useEffect(() => {
    debouncedSearch(localSearch)
  }, [localSearch, debouncedSearch])

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid #ddd' }}>
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

const statusColor = {
  0: 'secondary',
  1: 'primary',
  2: 'success'
}

export default function Findings() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    id: '',
    lha_id: '',
    unit: '',
    divisi: '',
    departemen: '',
    nomor: '',
    judul: '',
    deskripsi: ''
  })

  const [isEdit, setIsEdit] = useState(false)
  const [isSelected, setIsSelected] = useState(false)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalRows, setTotalRows] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10
  })

  const isMobile = useMediaQuery('(max-width:600px)')
  const isTablet = useMediaQuery('(max-width:960px)')
  const pageSize = isMobile ? 5 : isTablet ? 10 : 20

  const fetchData = useCallback(
    lha_id => {
      setLoading(true)

      if (lha_id) {
        dataTemuanByLha(paginationModel.page + 1, paginationModel.pageSize, searchQuery, lha_id)
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
      } else {
        dataTemuan(paginationModel.page + 1, paginationModel.pageSize, searchQuery)
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
      }
    },
    [paginationModel.page, paginationModel.pageSize, searchQuery]
  )

  const CustomPagination = () => {
    const apiRef = useGridApiContext()
    const pageCount = useGridSelector(apiRef, gridPageCountSelector)
    const page = apiRef.current.state.pagination.paginationModel.page
    const pageSize = apiRef.current.state.pagination.paginationModel.pageSize

    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <GridPagination
          sx={{
            flexGrow: 0,
            '& .MuiTablePagination-displayedRows': { display: 'none' },
            '& .MuiTablePagination-actions': { display: 'none' }
          }}
        />
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

  useEffect(() => {
    fetchData(formData.lha_id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData])

  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    { field: 'no', headerName: 'No', width: 70 },
    { field: 'nomor', headerName: 'No. Temuan', flex: 1 },
    { field: 'judul', headerName: 'Judul', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
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
      renderCell: params => (
        <>
          <IconButton
            size='small'
            color='secondary'
            sx={{ width: 24, height: 24 }}
            onClick={() => handleDetail(params.row.id)}
          >
            <VisibilityIcon fontSize='small' />
          </IconButton>
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
            onClick={() => handleDeleteTemuan(params.row.id)}
            sx={{ width: 24, height: 24 }}
          >
            <Delete fontSize='small' />
          </IconButton>
        </>
      )
    }
  ]

  const handleLha = value => {
    setIsSelected(true)
    let id = value ? value.id : ''

    setFormData(prev => ({ ...prev, lha_id: id }))

    if (id === '') {
      setFormData({
        id: '',
        unit: '',
        divisi: '',
        departemen: '',
        nomor: '',
        judul: '',
        deskripsi: ''
      })
    }

    fetchData(id)
  }

  const handleUnit = value => {
    let id = value ? value.id : ''

    setFormData(prev => ({ ...prev, unit: id }))
  }

  const handleDivisi = value => {
    let id = value ? value.id : ''

    setFormData(prev => ({ ...prev, divisi: id }))
  }

  const handleDepartemen = value => {
    let id = value ? value.id : ''

    setFormData(prev => ({ ...prev, departemen: id }))
  }

  const handleCreateTemuan = async () => {
    const dataTemuan = {
      lha_id: formData.lha_id,
      unit_id: formData.unit,
      divisi_id: formData.divisi,
      departemen_id: formData.departemen,
      nomor: formData.nomor,
      judul: formData.judul,
      deskripsi: formData.deskripsi
    }

    setLoading(true)

    try {
      const res = await createTemuan(dataTemuan)

      if (res.status) {
        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })

        fetchData(formData.lha_id)

        setFormData({
          id: '',
          lha_id: formData.lha_id,
          unit: '',
          divisi: '',
          departemen: '',
          nomor: '',
          judul: '',
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

  const handleEdit = async id => {
    findTemuan(id).then(response => {
      if (response.status) {
        const data = response.data

        setFormData({
          id: data.id,
          lha_id: data.lha_id,
          unit: data.unit_id,
          divisi: data.divisi_id,
          departemen: data.departemen_id,
          nomor: data.nomor,
          judul: data.judul,
          deskripsi: data.deskripsi
        })
        fetchData(data.lha_id)

        setIsEdit(true)
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: response.message || 'Terjadi kesalahan',
          icon: 'error'
        })
      }
    })
  }

  const handleUpdateTemuan = async () => {
    const dataTemuan = {
      id: formData.id,
      lha_id: formData.lha_id,
      unit_id: formData.unit,
      divisi_id: formData.divisi,
      departemen_id: formData.departemen,
      nomor: formData.nomor,
      judul: formData.judul,
      deskripsi: formData.deskripsi
    }

    setLoading(true)

    try {
      const res = await updateTemuan(formData.id, dataTemuan)

      if (res.status) {
        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000
        })

        fetchData(formData.lha_id)

        setFormData({
          id: '',
          lha_id: formData.lha_id,
          unit: '',
          divisi: '',
          departemen: '',
          nomor: '',
          judul: '',
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

  const handleDeleteTemuan = async id => {
    setLoading(true)

    const result = await Swal.fire({
      title: 'Konfirmasi?',
      text: `Apakah anda yakin ingin menghapus Temuan ini!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
      try {
        const res = await deleteTemuan(id)

        if (res.status) {
          await Swal.fire({
            title: 'Berhasil!',
            text: res.message,
            icon: 'success',
            showConfirmButton: false
          })
        }

        fetchData(formData.lha_id)

        setFormData({
          id: '',
          lha_id: formData.lha_id,
          unit: '',
          divisi: '',
          departemen: '',
          nomor: '',
          judul: '',
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

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Temuan' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth margin='normal'>
                    <LHASelect value={formData.lha_id} onSelect={handleLha} />
                  </FormControl>
                  <TextField
                    fullWidth
                    label='Nomor'
                    variant='outlined'
                    margin='normal'
                    value={formData.nomor}
                    onChange={e => setFormData({ ...formData, nomor: e.target.value })}
                  />
                  <TextField
                    fullWidth
                    label='Judul'
                    variant='outlined'
                    margin='normal'
                    value={formData.judul}
                    onChange={e => setFormData({ ...formData, judul: e.target.value })}
                  />
                  <FormControl fullWidth margin='normal'>
                    <UnitSelect value={formData.unit} onSelect={handleUnit} />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <DivisiSelect value={formData.divisi} unitId={formData.unit} onSelect={handleDivisi} />
                  </FormControl>
                  <FormControl fullWidth margin='normal'>
                    <DepartemenSelect
                      value={formData.departemen}
                      divisiId={formData.divisi}
                      onSelect={handleDepartemen}
                    />
                  </FormControl>
                  <Typography variant='body2' sx={{ mt: 2 }}>
                    Deskripsi
                  </Typography>
                  <Box>
                    <QuillEditor
                      value={formData.deskripsi}
                      onChange={content => setFormData(prev => ({ ...prev, deskripsi: content }))}
                    />
                  </Box>
                  {isEdit ? (
                    <Box>
                      <Button
                        type='submit'
                        variant='contained'
                        color='warning'
                        fullWidth
                        sx={{ mt: 2 }}
                        onClick={handleUpdateTemuan}
                      >
                        Update
                      </Button>
                      <Button
                        variant='contained'
                        color='secondary'
                        fullWidth
                        sx={{ mt: 3 }}
                        onClick={() => {
                          setFormData({
                            id: '',
                            lha_id: formData.lha_id,
                            unit: '',
                            divisi: '',
                            departemen: '',
                            nomor: '',
                            judul: '',
                            deskripsi: ''
                          })
                          setIsEdit(false)
                        }}
                      >
                        Batal
                      </Button>
                    </Box>
                  ) : (
                    <Button
                      type='submit'
                      variant='contained'
                      color='primary'
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={handleCreateTemuan}
                    >
                      Submit
                    </Button>
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 8 }}>
                  <Box sx={{ height: 'auto', minHeight: 400 }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      columnVisibilityModel={{ id: false }}
                      loading={loading}
                      paginationMode='server'
                      rowCount={totalRows}
                      pagination
                      paginationModel={paginationModel}
                      onPaginationModelChange={newModel => setPaginationModel(newModel)}
                      pageSizeOptions={[5, 10, 20, 50]}
                      pageSize={pageSize}
                      slots={{
                        toolbar: () => <CustomToolbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />,
                        pagination: CustomPagination
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        {/* <Grid size={{ xs: 12 }}>
                  <Card>
                  <CardHeader title='Rekomendasi' />
                  <CardContent>

                  </CardContent>
                  </Card>
                </Grid> */}
      </Grid>
    </>
  )
}
