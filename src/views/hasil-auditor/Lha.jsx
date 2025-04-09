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

import { createLha, dataLha, dataLhaSpi, deleteLha, findLha, updateLha } from '@/utils/lha'
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

    dataLhaSpi(paginationModel.page + 1, paginationModel.pageSize, searchQuery)
      .then(response => {
        if (response.status) {
          let data = response.data.map((item, index) => ({
            no: index + 1 + paginationModel.page * paginationModel.pageSize,
            ...item
          }))

          setRows(data)
          setTotalRows(response.pagination?.total)
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
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 150,
      renderCell: params => (
        <>
          <Tooltip title='Hasil SPI' arrow>
            <IconButton
              size='small'
              color='secondary'
              sx={{ width: 24, height: 24 }}
              onClick={() => handleDetail(params.row.id)}
            >
              <VisibilityIcon fontSize='small' />
            </IconButton>
          </Tooltip>
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

  const handleDetail = id => {
    router.push(`/hasil-auditor/${id}/temuan`)
  }

  return (
    <>
      <Typography variant='h4' gutterBottom>
        LHA (Laporan Hasil Audit)
      </Typography>

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
