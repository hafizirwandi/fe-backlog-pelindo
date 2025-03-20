'use client'
import React, { useCallback, useEffect, useState } from 'react'

import { useRouter, useSearchParams } from 'next/navigation'

import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Chip,
  useMediaQuery,
  Pagination,
  PaginationItem,
  Dialog,
  DialogContent,
  DialogTitle,
  useTheme,
  Divider,
  InputAdornment,
  DialogActions
} from '@mui/material'
import Swal from 'sweetalert2'
import Grid from '@mui/material/Grid2'
import {
  DataGrid,
  gridPageCountSelector,
  GridPagination,
  useGridApiContext,
  useGridSelector,
  gridClasses
} from '@mui/x-data-grid'

import { Timeline, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab'
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'

import { History } from '@mui/icons-material'
import { useDebouncedCallback } from '@coreui/react-pro'

import {
  dataTemuan,
  dataTemuanByLha,
  dataTemuanHasilAuditor,
  findTemuan,
  logTemuan,
  terimaAuditorTemuan,
  tolakAuditorTemuan
} from '@/utils/temuan'
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
  const theme = useTheme()

  const { user } = useAuth()
  const searchParams = useSearchParams()
  const paramLha = searchParams.get('lha')
  const [listLogTemuan, setListLogTemuan] = useState(null)
  const [openDialogLog, setOpenDialogLog] = useState(false)
  const [temuanId, setTemuanId] = useState(null)

  const router = useRouter()

  const [formData, setFormData] = useState({
    keterangan: '',
    temuan_id: ''
  })

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

  const [detailTemuan, setDetailTemuan] = useState([])
  const [detailDialog, setDetailDialog] = useState(false)

  const [hasilAuditorDialog, setHasilAuditorDialog] = useState(false)

  const fetchData = useCallback(() => {
    setLoading(true)

    dataTemuanHasilAuditor(paginationModel.page + 1, paginationModel.pageSize, searchQuery)
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
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchData])

  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    { field: 'no', headerName: 'No', width: 50 },
    { field: 'nomor', headerName: 'No. Temuan', width: 100 },
    { field: 'judul', headerName: 'Judul', flex: 1 },
    { field: 'divisi', headerName: 'Divisi', flex: 1 },
    {
      field: 'last_tage',
      headerName: 'Posisi Saat Ini',
      width: 150,
      renderCell: params => (
        <Chip label={params.row.stage_name ?? '-'} variant='outlined' color='primary' size='small' />
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 100,
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
      renderCell: params => (
        <Stack spacing={1}>
          <Button
            fullWidth
            size='small'
            color='primary'
            variant='contained'
            onClick={() => {
              setHasilAuditorDialog(true)
              setTemuanId(params.row.id)
            }}
          >
            Hasil Auditor
          </Button>
          <Button fullWidth size='small' color='info' variant='contained' onClick={() => handleDetail(params.row.id)}>
            Detail
          </Button>
          <Button
            fullWidth
            size='small'
            color='secondary'
            variant='contained'
            endIcon={<History />}
            onClick={() => {
              setTemuanId(prev => {
                const newId = params.row.id

                setTimeout(() => {
                  handleLogTemuan(newId)
                }, 1000)

                return newId
              })
              setLoading(true)
            }}
            disabled={loading}
          >
            {loading ? 'Memuat...' : 'Log Temuan'}
          </Button>
        </Stack>
      )
    }
  ]

  const handleDetail = async id => {
    const response = await findTemuan(id)

    if (response.status) {
      setDetailTemuan(response.data)
      setDetailDialog(true)

      return
    }

    Swal.fire({
      title: 'Gagal!',
      text: response.message || 'Terjadi kesalahan!',
      icon: 'error'
    })
  }

  const handleLogTemuan = async id => {
    if (!id) {
      Swal.fire({
        title: 'Gagal!',
        text: 'ID Temuan belum di set.',
        icon: 'error'
      })
    }

    const data = await logTemuan(id)

    if (data.status && data.data.length > 0) {
      setListLogTemuan(data.data)
      setOpenDialogLog(true)
    } else {
      Swal.fire({
        title: 'Gagal!',
        text: 'Gagal mengambil data.',
        icon: 'error'
      })
    }

    setLoading(false)
  }

  const handleSelesaiTemuan = async () => {
    const sendLha = {
      temuan_id: temuanId,
      keterangan: formData.keterangan
    }

    setLoading(true)

    try {
      let res = await terimaAuditorTemuan(sendLha)

      if (res.status) {
        setHasilAuditorDialog(false)

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          backdrop: false
        })

        setFormData({
          temuan_id: '',
          keterangan: ''
        })
        fetchData()
        setTemuanId(null)
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

  const handleTolakTemuan = async () => {
    const sendLha = {
      temuan_id: temuanId,
      keterangan: formData.keterangan
    }

    setLoading(true)

    try {
      let res = await tolakAuditorTemuan(sendLha)

      if (res.status) {
        setHasilAuditorDialog(false)

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          backdrop: false
        })

        setFormData({
          temuan_id: '',
          keterangan: ''
        })
        fetchData()
        setTemuanId(null)
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

  return (
    <>
      <Dialog
        aria-labelledby='detail-temuan'
        open={detailDialog}
        onClose={() => {
          setDetailTemuan([])
          setDetailDialog(false)
        }}
        aria-describedby='detail-temuan'
        maxWidth={'sm'}
        fullWidth={true}
      >
        <DialogTitle>Detail Temuan</DialogTitle>
        <DialogContent>
          <Typography variant='h6' gutterBottom>
            LHA
          </Typography>
          <Typography variant='body1' gutterBottom>
            {detailTemuan.lha}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant='h6' gutterBottom>
            Nomor
          </Typography>
          <Typography variant='body1' gutterBottom>
            {detailTemuan.nomor}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant='h6' gutterBottom>
            Judul
          </Typography>
          <Typography variant='body1' gutterBottom>
            {detailTemuan.judul}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant='h6' gutterBottom>
            Deskripsi
          </Typography>
          <Typography variant='body1' gutterBottom style={{ whiteSpace: 'pre-line' }}>
            {detailTemuan.deskripsi}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant='h6' gutterBottom>
            Unit
          </Typography>
          <Typography variant='body1' gutterBottom>
            {detailTemuan.unit}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant='h6' gutterBottom>
            Divisi
          </Typography>
          <Typography variant='body1' gutterBottom>
            {detailTemuan.divisi}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant='h6' gutterBottom>
            Departemen
          </Typography>
          <Typography variant='body1' gutterBottom>
            {detailTemuan.departemen}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant='h6' gutterBottom>
            Status
          </Typography>
          <Chip label={detailTemuan.status_name} variant='outlined' size='small' color='primary' />
        </DialogContent>
      </Dialog>
      <TimelineLogDialog open={openDialogLog} onClose={() => setOpenDialogLog(false)} logs={listLogTemuan} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardHeader title='Hasil Auditor' />
            <CardContent>
              <Grid container spacing={5}>
                <Grid size={12}>
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
                      pageSizeOptions={[5, 10, 20, 50, 100]}
                      pageSize={pageSize}
                      getRowHeight={() => 'auto'}
                      sx={{
                        [`& .${gridClasses.cell}`]: {
                          py: 3
                        }
                      }}
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
      </Grid>

      <Dialog
        aria-labelledby='dialog-hasil-auditor'
        open={hasilAuditorDialog}
        onClose={() => {
          setFormData({
            keterangan: '',
            temuan_id: ''
          })
        }}
        aria-describedby='dialog-hasil-auditor-description'
        fullWidth={true}
        maxWidth={'sm'}
      >
        <DialogTitle>Konfirmasi</DialogTitle>
        <DialogContent>
          <Typography variant='h6' sx={{ my: 2 }}>
            Masukkan keterangan auditor untuk temuan ini?
          </Typography>
          <CustomTextField
            fullWidth
            rows={4}
            multiline
            label='Keterangan'
            placeholder='Masukkan keterangan...'
            onChange={e => setFormData({ ...formData, keterangan: e.target.value })}
            value={formData.keterangan}
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
        </DialogContent>
        <DialogActions>
          <Button variant='contained' color='secondary' onClick={() => setHasilAuditorDialog(false)}>
            Close
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='error'
            onClick={handleTolakTemuan}
            disabled={loading}
            loading={loading}
          >
            Ditolak
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='success'
            onClick={handleSelesaiTemuan}
            disabled={loading}
            loading={loading}
          >
            Selesai
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const getColor = action => {
  switch (action) {
    case 'submit':
      return 'warning'
    case 'diterima':
      return 'success'
    case 'ditolak':
      return 'error'
    case 'draf':
      return 'secondary'
    default:
      return 'primary'
  }
}

const TimelineLogDialog = ({ open, onClose, logs }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
      <DialogTitle>Log Temuan</DialogTitle>
      <DialogContent>
        {logs?.length > 0 ? (
          <Box sx={{ pl: 2 }}>
            <Timeline
              sx={{
                [`& .${timelineItemClasses.root}:before`]: {
                  flex: 0,
                  padding: 0
                }
              }}
            >
              {logs.map((log, index) => (
                <TimelineItem key={index}>
                  <TimelineSeparator>
                    <TimelineDot color={getColor(log.action)} />
                    {index !== logs.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <Typography variant='body1' fontWeight='bold'>
                      {log.stage_before ?? log.nama}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      {new Date(log.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant='body2' color='textPrimary'>
                      {log.keterangan}
                    </Typography>
                    <Typography variant='body2' color='textSecondary' fontStyle='italic'>
                      Action: {log.action}
                    </Typography>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </Box>
        ) : (
          <p>Tidak ada log tersedia.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
