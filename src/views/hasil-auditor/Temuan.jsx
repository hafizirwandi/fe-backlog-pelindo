'use client'
import React, { use, useCallback, useEffect, useState } from 'react'

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
  InputAdornment,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import Swal from 'sweetalert2'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import { Edit, Delete, Visibility as VisibilityIcon, PlaylistAdd, OpenInNew, Visibility } from '@mui/icons-material'

import { DataGrid, gridClasses } from '@mui/x-data-grid'

import { findRekomendasi } from '@/utils/rekomendasi'
import { useAuth } from '@/context/AuthContext'
import FileUploader from '@/components/InputFiles'
import { dataFilesByLha, dataFilesByLhaSpi, deleteFile, uploadFiles } from '@/utils/files'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  createTindaklanjut,
  dataTindaklanjut,
  deleteTindaklanjut,
  findTindaklanjut,
  updateTindaklanjut
} from '@/utils/tindaklanjut'
import { closingTemuan, dataTemuanHasilAuditor, findTemuan, inputHasilAuditor } from '@/utils/temuan'
import { findLha } from '@/utils/lha'

dayjs.locale('id')

const statusColor = {
  0: 'secondary',
  1: 'primary',
  2: 'success',
  3: 'error'
}

export default function Temuan() {
  const { user } = useAuth()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [loading, setLoading] = useState(false)
  const [rowsFiles, setRowsFiles] = useState([])
  const params = useParams()
  const router = useRouter()
  const [loadingHasil, setLoadingHasil] = useState(false)
  const [loadingClosing, setLoadingClosing] = useState(false)

  const [openDialogFiles, setOpenDialogFiles] = useState(false)
  const [openDialogHasil, setOpenDialogHasil] = useState(false)
  const [openDialogClosing, setOpenDialogClosing] = useState(false)
  const [dataLha, setDataLha] = useState(null)

  const [rowsTemuan, setRowsTemuan] = useState()

  const [formHasil, setFormHasil] = useState({
    temuan_id: '',
    keterangan: '',
    files: []
  })

  const [formClosing, setFormClosing] = useState({
    temuan_id: '',
    keterangan: '',
    file: ''
  })

  const [formFilesData, setFormFilesData] = useState({
    lha_id: '',
    nama: '',
    file: ''
  })

  const [isTemuan, setIsTemuan] = useState(null)

  const [temuanId, setTemuanId] = useState(null)

  const fetchDetailData = useCallback(async () => {
    if (!params) return

    try {
      const idLha = params.id

      setLoading(true)
      const response = await findLha(idLha)

      if (response.status) {
        setDataLha(response.data)
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
  }, [params])

  const fetchFilesData = async lha_id => {
    if (!lha_id) return

    try {
      const response = await dataFilesByLhaSpi(lha_id)

      if (response.status) {
        const responseData = response.data.map((item, index) => ({
          ...item,
          no: index + 1
        }))

        return responseData.filter((item, index, self) => index === self.findIndex(t => t.id === item.id))
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

  const fetchTemuanData = async lha_id => {
    if (!lha_id) return

    try {
      const response = await dataTemuanHasilAuditor(lha_id)

      if (response.status) {
        const responseData = response.data.map((item, index) => ({
          ...item,
          no: index + 1
        }))

        return responseData.filter((item, index, self) => index === self.findIndex(t => t.id === item.id))
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
    if (!dataLha?.id) fetchDetailData()

    if (dataLha?.id) {
      fetchFilesData(dataLha?.id).then(data => {
        setRowsFiles(data)
      })
    }
  }, [fetchDetailData, dataLha?.id])

  useEffect(() => {
    if (dataLha?.id && rowsFiles?.length > 0) {
      fetchTemuanData(dataLha?.id).then(data => {
        setRowsTemuan(data)
      })

      setIsTemuan(true)
    }
  }, [dataLha?.id, rowsFiles])

  if (!dataLha) {
    return null
  }

  const columns = [
    { field: 'id', headerName: 'ID' },
    {
      field: 'no',
      headerName: 'No',
      width: 50,
      headerAlign: 'center',
      align: 'center'
    },
    { field: 'nama', headerName: 'Nama Dokumen', flex: 1 },
    {
      field: 'url_file',
      headerName: 'File',
      width: 150,
      renderCell: params => (
        <Button
          variant='contained'
          color='primary'
          size='small'
          endIcon={<OpenInNew />}
          onClick={() => window.open(params.row.url_file, '_blank', 'noopener,noreferrer')}
        >
          Lihat File
        </Button>
      )
    },
    {
      field: 'actions',
      headerName: 'Aksi',
      width: 100,
      headerAlign: 'center',
      align: 'center',
      renderCell: params => (
        <Box>
          <Tooltip title='Hapus File' arrow>
            <IconButton
              size='small'
              color='error'
              onClick={() => handleDeleteFile(params.row.id)}
              sx={{ width: 24, height: 24 }}
            >
              <Delete fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>
      )
    }
  ]

  const handleDeleteFile = async id => {
    setLoading(true)

    const result = await Swal.fire({
      title: 'Konfirmasi?',
      text: `Apakah anda yakin ingin menghapus file ini!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
      try {
        const res = await deleteFile(id)

        if (!res.status) {
          throw new Error(res.message)
        }

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false
        })

        await fetchFilesData(dataLha?.lha_id).then(data => {
          setRowsFiles(data)
        })

        setFormFilesData({
          lha_id: '',
          nama: '',
          file: '',
          direktori: ''
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

  const handleFileSelect = file => {
    setFormFilesData(prev => ({ ...prev, file }))
  }

  const handleUpload = async () => {
    if (!formFilesData.file) {
      alert('Pilih file terlebih dahulu!')

      return
    }

    setLoading(true)
    const formData = new FormData()

    formData.append('lha_id', dataLha.id)
    formData.append('nama', formFilesData.nama)
    formData.append('file', formFilesData.file)
    formData.append('is_spi', true)

    console.log(formData)

    try {
      const response = await uploadFiles(formData)

      if (response.status) {
        Swal.fire({
          title: 'Berhasil!',
          text: response.message || 'File berhasil diupload',
          icon: 'success'
        })

        await fetchFilesData(dataLha.id).then(data => {
          setRowsFiles(data)
        })

        setFormFilesData({
          nama: '',
          file: ''
        })
        setOpenDialogFiles(false)
      }
    } catch (error) {
      console.error('Upload gagal:', error)
      Swal.fire({
        title: 'Gagal!',
        text: error.message || 'Terjadi kesalahan',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitHasil = async () => {
    try {
      const result = await Swal.fire({
        title: 'Apakah anda yakin ingin menyimpan hasil ini?',
        text: `Setelah berhasil anda akan dialihkan ke halaman rekomendasi untuk menginputkan rekomendasi terbaru.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Kirim!',
        cancelButtonText: 'Batal'
      })

      if (result.isConfirmed) {
        const res = await inputHasilAuditor(formHasil)

        if (res.status) {
          await Swal.fire({
            title: 'Berhasil!',
            text: res.message,
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          router.replace(`/temuan/${formHasil.temuan_id}/rekomendasi`)
          setOpenDialogHasil(false)
        }
      }
    } catch (err) {
      await Swal.fire({
        title: 'Gagal!',
        text: err.message || 'Terjadi kesalahan',
        icon: 'error'
      })
    }
  }

  const handleSubmitClosing = async () => {
    try {
      const result = await Swal.fire({
        title: 'Apakah anda yakin ingin?',
        text: `Temuan yang di closing tidak dapat diubah atau dibuka kembali.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Ya, Kirim!',
        cancelButtonText: 'Batal'
      })

      if (result.isConfirmed) {
        const res = await closingTemuan(formClosing)

        if (res.status) {
          await Swal.fire({
            title: 'Berhasil!',
            text: res.message,
            icon: 'success',
            showConfirmButton: false,
            timer: 1000
          })
          router.replace(`/hasil-auditor/${params.id}/temuan`)

          setOpenDialogClosing(false)
        }
      }
    } catch (err) {
      await Swal.fire({
        title: 'Gagal!',
        text: err.message || 'Terjadi kesalahan',
        icon: 'error'
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title='Detail LHA'
          action={
            <>
              <Button variant='contained' color='secondary' href={`/hasil-auditor`} sx={{ mx: 2 }}>
                Kembali
              </Button>
              <Button variant='contained' color='primary' href={`/lha/${dataLha.id}/detail`}>
                Lihat Detail LHA
              </Button>
            </>
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
                {dataLha.judul ?? '-'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Nomor
              </Typography>
              <Typography variant='body1' gutterBottom>
                {dataLha.nomor ?? '-'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Uraian
              </Typography>
              <Box sx={{ mt: 1 }}>
                <p style={{ whiteSpace: 'pre-line' }}>{dataLha?.deskripsi ?? '-'}</p>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box sx={{ height: 'auto', minHeight: 400 }}>
                <Typography variant='h6' gutterBottom>
                  Daftar File LHA
                </Typography>
                <Button variant='contained' color='primary' onClick={() => setOpenDialogFiles(true)}>
                  Tambah File
                </Button>
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ my: 2 }} />
                </Box>
                <DataGrid
                  loading={loading}
                  columnVisibilityModel={{ id: false }}
                  rows={rowsFiles}
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
            <Grid2 size={{ xs: 12 }}>
              <Dialog
                fullScreen={fullScreen}
                aria-labelledby='responsive-dialog-title'
                open={openDialogFiles}
                onClose={() => {
                  setFormFilesData({
                    nama: '',
                    file: ''
                  })
                  setOpenDialogFiles(false)
                }}
                aria-describedby='dialog-description'
                maxWidth={'sm'}
                fullWidth={true}
              >
                <DialogTitle>Form Management File</DialogTitle>
                <DialogContent>
                  <TextField
                    fullWidth
                    label='Nama Dokumen'
                    variant='outlined'
                    margin='normal'
                    value={formFilesData.nama}
                    onChange={e => setFormFilesData({ ...formFilesData, nama: e.target.value })}
                  />
                  <FileUploader onFileSelect={handleFileSelect} />
                </DialogContent>
                <DialogActions>
                  <Button
                    variant='contained'
                    color='secondary'
                    onClick={() => {
                      setFormFilesData({
                        nama: '',
                        file: ''
                      })
                      setOpenDialogFiles(false)
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    type='submit'
                    variant='contained'
                    color='primary'
                    onClick={handleUpload}
                    disabled={loading}
                    loading={loading}
                  >
                    {loading ? 'Uploading...' : 'Upload'}
                  </Button>
                </DialogActions>
              </Dialog>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>
      {isTemuan && (
        <Card sx={{ mt: 4 }}>
          <CardHeader title='List Temuan' />
          <CardContent>
            <Box sx={{ height: 'auto', minHeight: 400 }}>
              <DataGrid
                loading={loading}
                columnVisibilityModel={{ id: false }}
                rows={rowsTemuan}
                columns={[
                  { field: 'id', headerName: 'ID', hide: true },
                  { field: 'no', headerName: 'No', width: 10 },
                  { field: 'judul', headerName: 'Judul', width: 200 },
                  {
                    field: 'rekomendasi',
                    headerName: 'Rekomendasi',
                    headerAlign: 'center',
                    flex: 1,
                    renderCell: params => (
                      <>
                        <ul style={{ margin: 0, padding: 0 }}>
                          {params.row.rekomendasi.map((item, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                              <span>
                                {index + 1}. {item?.deskripsi}
                              </span>
                              <Chip variant='outlined' label={item.status_name} />
                            </li>
                          ))}
                        </ul>
                      </>
                    )
                  },
                  {
                    field: 'aksi',
                    headerName: 'Aksi',
                    headerAlign: 'center',
                    width: 200,
                    align: 'center',
                    renderCell: params => {
                      if (!params.row.closing) {
                        return (
                          <>
                            <Button
                              size='small'
                              color='warning'
                              onClick={() => {
                                setOpenDialogHasil(true)
                                setFormHasil(prev => ({ ...prev, temuan_id: params.row.id }))
                              }}
                              fullWidth
                              variant='contained'
                            >
                              Hasil
                            </Button>

                            <Button
                              size='small'
                              color='info'
                              onClick={() => {
                                setOpenDialogClosing(true)
                                setFormClosing(prev => ({ ...prev, temuan_id: params.row.id }))
                              }}
                              fullWidth
                              variant='contained'
                              sx={{ my: 1 }}
                            >
                              Closing
                            </Button>
                          </>
                        )
                      }

                      return null
                    }
                  }
                ]}
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
          </CardContent>
        </Card>
      )}

      <Dialog
        fullScreen={fullScreen}
        aria-labelledby='responsive-dialog-title'
        open={openDialogHasil}
        onClose={() => {
          setFormHasil({
            temuan_id: '',
            keterangan: '',
            files: []
          })
          setOpenDialogHasil(false)
        }}
        aria-describedby='dialog-description'
        maxWidth={'sm'}
        fullWidth={true}
      >
        <DialogTitle>Form Hasil SPI</DialogTitle>
        <DialogContent>
          <CustomTextField
            fullWidth
            rows={4}
            multiline
            label='Keterangan'
            placeholder='Masukkan keterangan...'
            onChange={e => setFormHasil({ ...formHasil, keterangan: e.target.value })}
            value={formHasil.keterangan}
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
          <FormControl fullWidth margin='normal'>
            <InputLabel id='file-dukung-label'>File Dukung</InputLabel>
            <Select
              labelId='file-dukung-label'
              multiple
              value={formHasil.files}
              onChange={e => setFormHasil({ ...formHasil, files: e.target.value })}
              label='File Dukung'
            >
              {rowsFiles?.map(file => (
                <MenuItem key={file.id} value={file.id}>
                  {file.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              setFormHasil({
                temuan_id: '',
                keterangan: '',
                files: []
              })
              setOpenDialogHasil(false)
            }}
          >
            Close
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='success'
            onClick={() => {
              handleSubmitHasil()
            }}
            disabled={loadingHasil}
            loading={loadingHasil}
          >
            {loadingHasil ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Closing Temuan */}
      <Dialog
        fullScreen={fullScreen}
        aria-labelledby='responsive-dialog-title'
        open={openDialogClosing}
        onClose={() => {
          setFormClosing({
            temuan_id: '',
            keterangan: '',
            file: ''
          })
          setOpenDialogClosing(false)
        }}
        aria-describedby='dialog-description'
        maxWidth={'sm'}
        fullWidth={true}
      >
        <DialogTitle>Form Closing Temuan</DialogTitle>
        <DialogContent>
          <CustomTextField
            fullWidth
            rows={4}
            multiline
            label='Keterangan'
            placeholder='Masukkan keterangan...'
            onChange={e => setFormClosing({ ...formClosing, keterangan: e.target.value })}
            value={formClosing.keterangan}
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
          <FormControl fullWidth margin='normal'>
            <InputLabel id='file-dukung-label'>Berita Acara</InputLabel>
            <Select
              labelId='file-dukung-label'
              value={formClosing.file}
              onChange={e => setFormClosing({ ...formClosing, file: e.target.value })}
              label='File Dukung'
            >
              {rowsFiles?.map(file => (
                <MenuItem key={file.id} value={file.id}>
                  {file.nama}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            variant='contained'
            color='secondary'
            onClick={() => {
              setFormClosing({
                temuan_id: '',
                keterangan: '',
                file: ''
              })
              setOpenDialogClosing(false)
            }}
          >
            Close
          </Button>
          <Button
            type='submit'
            variant='contained'
            color='success'
            onClick={() => {
              handleSubmitClosing()
            }}
            disabled={loadingClosing}
            loading={loadingClosing}
          >
            {loadingClosing ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
