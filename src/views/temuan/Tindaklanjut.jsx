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
import { dataFilesByLha, deleteFile, uploadFiles } from '@/utils/files'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  createTindaklanjut,
  dataTindaklanjut,
  deleteTindaklanjut,
  findTindaklanjut,
  updateTindaklanjut
} from '@/utils/tindaklanjut'

dayjs.locale('id')

const statusColor = {
  0: 'secondary',
  1: 'primary',
  2: 'success',
  3: 'error'
}

export default function Tindaklanjut() {
  const { user } = useAuth()
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [detailData, setDetailData] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rowsFiles, setRows] = useState([])
  const [rowsTindaklanjut, setRowsTindaklanjut] = useState([])
  const params = useParams()
  const router = useRouter()
  const [isTindaklanjut, setIsTindaklanjut] = useState(false)

  const [openTindaklanjutDialog, setOpenTindaklanjutDialog] = useState(false)
  const [isEditTindaklanjut, setIsEditTindaklanjut] = useState(false)

  const [formTindaklanjut, setFormTindakLanjut] = useState({
    id: '',
    rekomendasi_id: '',
    deskripsi: '',
    tanggal: '',
    file_dukung: []
  })

  const [formFilesData, setFormFilesData] = useState({
    lha_id: '',
    nama: '',
    file: ''
  })

  const fetchDetailData = useCallback(async () => {
    if (!params) return

    try {
      const idRekomendasi = params.idRekomendasi

      setLoading(true)
      const response = await findRekomendasi(idRekomendasi)

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
  }, [params])

  const fetchFilesData = async lha_id => {
    if (!lha_id) return

    try {
      const response = await dataFilesByLha(lha_id)

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

  const fetchTindakLanjutData = async rekomendasi_id => {
    if (!rekomendasi_id) return

    try {
      const response = await dataTindaklanjut(rekomendasi_id)

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
    if (!detailData?.lha_id) fetchDetailData()

    if (detailData?.lha_id) {
      fetchFilesData(detailData?.lha_id).then(data => {
        setRows(data)
      })
    }
  }, [fetchDetailData, detailData?.lha_id])

  useEffect(() => {
    if (detailData?.id && rowsFiles.length > 0) {
      fetchTindakLanjutData(detailData.id).then(data => {
        setRowsTindaklanjut(data)
        setIsTindaklanjut(true)
      })
    }
  }, [detailData?.id, rowsFiles])

  if (!detailData) {
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

        await fetchFilesData(detailData.lha_id).then(data => {
          setRows(data)
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

    formData.append('lha_id', detailData.lha_id)
    formData.append('nama', formFilesData.nama)
    formData.append('file', formFilesData.file)

    console.log(formData)

    try {
      const response = await uploadFiles(formData)

      if (response.status) {
        Swal.fire({
          title: 'Berhasil!',
          text: response.message || 'File berhasil diupload',
          icon: 'success'
        })

        await fetchFilesData(detailData.lha_id).then(data => {
          setRows(data)
        })

        setFormFilesData({
          nama: '',
          file: ''
        })
        setIsEdit(false)
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

  const handleCreateTindakLanjut = async () => {
    const dataTindaklanjut = {
      rekomendasi_id: detailData.id,
      deskripsi: formTindaklanjut.deskripsi,
      tanggal: formTindaklanjut.tanggal,
      file_dukung: formTindaklanjut.file_dukung
    }

    setLoading(true)

    try {
      const res = await createTindaklanjut(dataTindaklanjut)

      if (res.status) {
        setOpenTindaklanjutDialog(false)

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          backdrop: false
        })

        fetchTindakLanjutData(detailData.id).then(data => setRowsTindaklanjut(data))

        setFormTindakLanjut({
          id: '',
          rekomendasi_id: detailData.id,
          tanggal: '',
          deskripsi: '',
          file_dukung: []
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

  const handleEditTindaklanjut = async id => {
    findTindaklanjut(id).then(res => {
      if (res.status) {
        const data = res.data
        const idFiles = data.file.map(item => item.id)

        console.log(idFiles)

        setFormTindakLanjut({
          id: data.id,
          rekomendasi_id: data.rekomendasi_id,
          deskripsi: data.deskripsi,
          tanggal: data.tanggal,
          file_dukung: idFiles
        })

        setOpenTindaklanjutDialog(true)
        setIsEditTindaklanjut(true)
      } else {
        Swal.fire({
          title: 'Gagal!',
          text: res.message || 'Terjadi kesalahan',
          icon: 'error'
        })
      }
    })
  }

  const handleUpdateTindaklanjut = async () => {
    const dataTindaklanjut = {
      id: formTindaklanjut.id,
      rekomendasi_id: detailData.id,
      deskripsi: formTindaklanjut.deskripsi,
      tanggal: formTindaklanjut.tanggal,
      file_dukung: formTindaklanjut.file_dukung
    }

    setLoading(true)

    try {
      const res = await updateTindaklanjut(formTindaklanjut.id, dataTindaklanjut)

      if (res.status) {
        setOpenTindaklanjutDialog(false)

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          backdrop: false
        })

        fetchTindakLanjutData(detailData.id).then(data => setRowsTindaklanjut(data))

        setFormTindakLanjut({
          id: '',
          rekomendasi_id: detailData.id,
          tanggal: '',
          deskripsi: '',
          file_dukung: []
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

  const handleDeleteTindaklanjut = async id => {
    setLoading(true)

    const result = await Swal.fire({
      title: 'Konfirmasi?',
      text: `Apakah anda yakin ingin menghapus Tindaklanjut ini!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    })

    if (result.isConfirmed) {
      try {
        const res = await deleteTindaklanjut(id)

        if (!res.status) {
          throw new Error(res.message)
        }

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false
        })

        fetchTindakLanjutData(detailData.id).then(data => setRowsTindaklanjut(data))

        setFormTindakLanjut({
          id: '',
          rekomendasi_id: '',
          deskripsi: '',
          tanggal: '',
          file_dukung: []
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
      <Card>
        <CardHeader
          title='Detail Rekomendasi Temuan'
          action={
            <>
              <Button variant='contained' color='secondary' href={`/temuan/${params.id}/rekomendasi`} sx={{ mx: 2 }}>
                Kembali
              </Button>
              <Button variant='contained' color='primary' href={`/lha/${detailData.lha_id}/detail`}>
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
                {detailData.lha_judul}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Nomor Rekomendasi
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.nomor}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Uraian Rekomendasi
              </Typography>
              <Box sx={{ mt: 1 }}>
                <p style={{ whiteSpace: 'pre-line' }}>{detailData.deskripsi}</p>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Batas Tanggal
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.batas_tanggal ?? '-'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Tanggal Selesai
              </Typography>
              <Typography variant='body1' gutterBottom>
                {detailData.tanggal_selesai ?? '-'}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant='h6' gutterBottom>
                Status
              </Typography>
              <Chip
                label={detailData.status_name ?? '-'}
                variant='outlined'
                color={statusColor[detailData.status_name]}
                size='small'
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 7 }}>
              <Box sx={{ height: 'auto', minHeight: 400 }}>
                <Typography variant='h6' gutterBottom>
                  Daftar File LHA
                </Typography>
                <Button variant='contained' color='primary' onClick={() => setIsEdit(true)}>
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
                open={isEdit}
                onClose={() => {
                  setFormFilesData({
                    nama: '',
                    file: ''
                  })
                  setIsEdit(false)
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
                      setIsEdit(false)
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
      {isTindaklanjut && (
        <Card sx={{ mt: 4 }}>
          <CardHeader
            title='Tindak Lanjut'
            action={
              <Button variant='contained' color='primary' onClick={() => setOpenTindaklanjutDialog(true)}>
                Tambah Tindak Lanjut
              </Button>
            }
          />
          <CardContent>
            <Box sx={{ height: 'auto', minHeight: 400 }}>
              <DataGrid
                loading={loading}
                columnVisibilityModel={{ id: false }}
                rows={rowsTindaklanjut}
                columns={[
                  { field: 'id', headerName: 'ID', hide: true },
                  { field: 'no', headerName: 'No', width: 10 },
                  { field: 'deskripsi', headerName: 'Deskripsi', width: 250 },
                  { field: 'tanggal', headerName: 'Tanggal' },
                  {
                    field: 'files',
                    headerName: 'File Dukung',
                    headerAlign: 'center',
                    flex: 1,
                    renderCell: params => (
                      <>
                        <ul style={{ margin: 0, padding: 0 }}>
                          {params.row.files.map((item, index) => (
                            <li key={index} style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                              <span>
                                {index + 1}. {item.nama}
                              </span>
                              <Button
                                size='small'
                                color='primary'
                                variant='contained'
                                sx={{ mt: 1 }}
                                onClick={() => window.open(item.url ?? '#', '_blank', 'noopener,noreferrer')}
                                endIcon={<OpenInNew />}
                              >
                                Lihat File
                              </Button>
                            </li>
                          ))}
                        </ul>
                      </>
                    )
                  },
                  {
                    field: 'aksi',
                    headerName: 'Aksi',
                    width: 100,
                    headerAlign: 'center',
                    align: 'center',
                    renderCell: params => (
                      <>
                        {/* {user?.permissions?.includes('update tindaklanjut') && detailData.status === '0' && ( */}
                        <Tooltip title='Edit Tindak Lanjut' arrow>
                          <IconButton
                            size='small'
                            color='warning'
                            onClick={() => handleEditTindaklanjut(params.row.id)}
                            sx={{ width: 24, height: 24 }}
                          >
                            <Edit fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        {/* )} */}
                        {/* {user?.permissions?.includes('delete tindaklanjut') && detailData.status === '0' && ( */}
                        <Tooltip title='Hapus Tindak Lanjut' arrow>
                          <IconButton
                            size='small'
                            color='error'
                            onClick={() => handleDeleteTindaklanjut(params.row.id)}
                            sx={{ width: 24, height: 24 }}
                          >
                            <Delete fontSize='small' />
                          </IconButton>
                        </Tooltip>
                        {/* )} */}
                      </>
                    )
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
        open={openTindaklanjutDialog}
        onClose={() => {
          setFormTindakLanjut({
            id: '',
            rekomendasi_id: '',
            deskripsi: '',
            tanggal: '',
            file_dukung: []
          })
          setOpenTindaklanjutDialog(false)
        }}
        aria-describedby='dialog-description'
        maxWidth={'sm'}
        fullWidth={true}
      >
        <DialogTitle>Form Tindak Lanjut</DialogTitle>
        <DialogContent>
          <CustomTextField
            fullWidth
            rows={4}
            multiline
            label='Deskripsi'
            placeholder='Masukkan deskripsi...'
            onChange={e => setFormTindakLanjut({ ...formTindaklanjut, deskripsi: e.target.value })}
            value={formTindaklanjut.deskripsi}
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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label='Tanggal'
              value={formTindaklanjut.tanggal ? dayjs(formTindaklanjut.tanggal) : null}
              onChange={date =>
                setFormTindakLanjut({
                  ...formTindaklanjut,
                  tanggal: date ? dayjs(date).format('YYYY-MM-DD') : ''
                })
              }
              slotProps={{ textField: { fullWidth: true } }} //
              sx={{ width: '100%', mt: 3 }}
            />
          </LocalizationProvider>
          <FormControl fullWidth margin='normal'>
            <InputLabel id='file-dukung-label'>File Dukung</InputLabel>
            <Select
              labelId='file-dukung-label'
              multiple
              value={formTindaklanjut.file_dukung}
              onChange={e => setFormTindakLanjut({ ...formTindaklanjut, file_dukung: e.target.value })}
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
              setFormTindakLanjut({
                id: '',
                rekomendasi_id: '',
                deskripsi: '',
                tanggal: '',
                file_dukung: []
              })
              setOpenTindaklanjutDialog(false)
              setIsEditTindaklanjut(false)
            }}
          >
            Close
          </Button>
          {isEditTindaklanjut ? (
            <Button
              type='submit'
              variant='contained'
              color='warning'
              onClick={handleUpdateTindaklanjut}
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Menyimpan...' : 'Ubah'}
            </Button>
          ) : (
            <Button
              type='submit'
              variant='contained'
              color='primary'
              onClick={handleCreateTindakLanjut}
              disabled={loading}
              loading={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}
