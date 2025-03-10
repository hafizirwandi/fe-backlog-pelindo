'use client'
import React, { use, useCallback, useEffect, useState } from 'react'

import { notFound, useParams, useRouter } from 'next/navigation'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  CardContent,
  Card,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Collapse,
  TableContainer,
  useMediaQuery,
  useTheme,
  CardActions,
  InputAdornment,
  CardHeader,
  Paper
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Grid from '@mui/material/Grid2'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import Swal from 'sweetalert2'

import { Check, Send } from '@mui/icons-material'

import { detailsLha, findLha, rejectLha, sendLhaPic, sendLhaSpv } from '@/utils/lha'
import { useAuth } from '@/context/AuthContext'
import QuillEditor from '@/components/QuillEditor'
import CustomTextField from '@/@core/components/mui/TextField'

function Row({ row }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell sx={{ width: 40 }}>
          {row.tindakLanjut && (
            <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell sx={{ width: 400 }}>
          <Box dangerouslySetInnerHTML={{ __html: row.deskripsi ?? '-' }} />
        </TableCell>
        <TableCell>{row.batas_tanggal}</TableCell>
        <TableCell>
          <Chip
            label={row.status_name}
            variant='outlined'
            color={row.status_name === 'Selesai' ? 'success' : 'warning'}
            size='small'
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout='auto' unmountOnExit></Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function DetailLha() {
  const router = useRouter()
  const theme = useTheme()
  const [openDialog, setOpenDialog] = useState(false)
  const [openDialogTolak, setOpenDialogTolak] = useState(false)
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [loading, setLoading] = useState(false)

  const { user, setUser } = useAuth()

  const [formData, setFormData] = useState({
    lha_id: '',
    keterangan: ''
  })

  const [dataLha, setDataLha] = useState({
    id: '',
    judul: '',
    nomor: '',
    tanggal: new Date().toISOString().split('T')[0],
    periode: '',
    deskripsi: '',
    last_stage: '',
    stage_name: '',
    status: '',
    status_name: '',
    temuan: []
  })

  const id = useParams()

  const Lha = useCallback(() => {
    if (!id) return

    detailsLha(id.id).then(res => {
      if (res.status) {
        const data = res.data

        setDataLha({
          id: data.id,
          judul: data.judul ?? '-',
          nomor: data.no_lha ?? '-',
          tanggal: data.tanggal ?? new Date().toISOString().split('T')[0],
          periode: data.periode ?? '-',
          deskripsi: data.deskripsi ?? '-',
          stage_name: data.stage_name ?? '-',
          status_name: data.status_name ?? '-',
          temuan: data.temuan,
          last_stage: data.last_stage,
          stage: data.stage,
          status: data.status
        })
      } else {
        router.replace('/not-found')
      }
    })
  }, [id, router])

  useEffect(() => {
    Lha()
  }, [Lha])

  const handleTeruskan = async () => {
    const sendLha = {
      lha_id: dataLha.id,
      keterangan: formData.keterangan
    }

    setLoading(true)

    try {
      let res = null

      console.log('dataLha', dataLha)
      console.log('role', user?.role?.includes('supervisor'))
      console.log('permissions', user?.permissions?.includes('update status_lha'))

      if (
        dataLha.last_stage == 1 &&
        user?.role?.includes('admin') &&
        user?.permissions?.includes('update status_lha')
      ) {
        res = await sendLhaSpv(sendLha)
      } else if (
        dataLha.last_stage == 2 &&
        user?.role?.includes('supervisor') &&
        user?.permissions?.includes('update status_lha')
      ) {
        res = await sendLhaPic(sendLha)
      }

      if (res.status) {
        setOpenDialog(false)

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          backdrop: false
        })

        detailsLha(dataLha.id).then(res => {
          if (res.status) {
            const data = res.data

            setDataLha({
              id: data.id,
              judul: data.judul ?? '-',
              nomor: data.no_lha ?? '-',
              tanggal: data.tanggal ?? new Date().toISOString().split('T')[0],
              periode: data.periode ?? '-',
              deskripsi: data.deskripsi ?? '-',
              stage_name: data.stage_name ?? '-',
              status_name: data.status_name ?? '-',
              temuan: data.temuan,
              last_stage: data.last_stage,
              stage: data.stage,
              status: data.status
            })
          } else {
            router.replace('/not-found')
          }
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

  const handleTolak = async () => {
    const sendLha = {
      lha_id: dataLha.id,
      last_stage: dataLha.last_stage,
      keterangan: formData.keterangan
    }

    setLoading(true)

    try {
      let res = await rejectLha(sendLha)

      if (res.status) {
        setOpenDialogTolak(false)

        await Swal.fire({
          title: 'Berhasil!',
          text: res.message,
          icon: 'success',
          showConfirmButton: false,
          timer: 1000,
          backdrop: false
        })

        detailsLha(dataLha.id).then(res => {
          if (res.status) {
            const data = res.data

            setDataLha({
              id: data.id,
              judul: data.judul ?? '-',
              nomor: data.no_lha ?? '-',
              tanggal: data.tanggal ?? new Date().toISOString().split('T')[0],
              periode: data.periode ?? '-',
              deskripsi: data.deskripsi ?? '-',
              stage_name: data.stage_name ?? '-',
              status_name: data.status_name ?? '-',
              temuan: data.temuan,
              last_stage: data.last_stage,
              stage: data.stage,
              status: data.status
            })
          } else {
            router.replace('/not-found')
          }
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

  const roleId = user?.roleAndPermissions?.[0]?.id

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 5, mb: 5 }}>
        <Grid size={12}>
          <Card>
            <CardActions>
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h5'>Detail LHA</Typography>
                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                  {user?.permissions?.includes('update status_lha') && dataLha?.last_stage == roleId && (
                    <Button
                      variant='contained'
                      color='primary'
                      endIcon={dataLha?.status == 0 ? <Send /> : <Check />}
                      onClick={() => setOpenDialog(true)}
                    >
                      {dataLha?.status == 0 ? 'Kirim' : 'Terima'}
                    </Button>
                  )}
                  {user?.permissions?.includes('update status_lha') &&
                    dataLha?.last_stage == roleId &&
                    dataLha?.status != 0 && (
                      <Button variant='contained' color='error' onClick={() => setOpenDialogTolak(true)}>
                        Tolak
                      </Button>
                    )}
                </Box>
              </Grid>
            </CardActions>

            <CardContent>
              <TableContainer component={Paper} sx={{ p: 2, borderRadius: 2, boxShadow: 3 }}>
                <Table size='small'>
                  <TableBody>
                    {[
                      { label: 'No. LHA', value: dataLha.nomor },
                      { label: 'Judul', value: dataLha.judul },
                      { label: 'Tanggal', value: dataLha.tanggal },
                      { label: 'Periode', value: dataLha.periode },
                      {
                        label: 'Posisi Sekarang',
                        value: <Chip label={dataLha.stage_name} variant='outlined' color='primary' size='small' />
                      },
                      {
                        label: 'Status',
                        value: <Chip label={dataLha.status_name} variant='outlined' color='success' size='small' />
                      },
                      {
                        label: 'Deskripsi',
                        value: <Box dangerouslySetInnerHTML={{ __html: dataLha.deskripsi }} />
                      },
                      dataLha?.stage?.keterangan && {
                        label: 'Keterangan',
                        value: <Box dangerouslySetInnerHTML={{ __html: dataLha.stage.keterangan }} />
                      }
                    ]
                      .filter(Boolean)
                      .map((row, index) => (
                        <TableRow key={index}>
                          <TableCell sx={{ fontWeight: 'bold', width: 200 }}>{row.label}</TableCell>
                          <TableCell sx={{ width: 10, fontWeight: 'bold', color: 'primary.main' }}>:</TableCell>
                          <TableCell>{row.value}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={2}></Grid>
      </Grid>
      {Object.entries(dataLha.temuan).map(([key, item]) => (
        <Card key={key} sx={{ mb: 2 }}>
          <CardHeader title={item.nama_divisi} />

          <CardContent>
            <Grid container spacing={2}>
              <Grid size={12}>
                {item.data.map((row, index) => (
                  <Accordion
                    key={index}
                    sx={{
                      boxShadow: 'none',
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      borderRadius: 2,
                      overflow: 'hidden'
                    }}
                  >
                    <AccordionSummary
                      sx={{
                        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
                        padding: 0, // Remove extra padding
                        paddingX: 2
                      }}
                      aria-controls={`panel-content-${index}`}
                      id={`panel-header-${index}`}
                    >
                      <Typography component='span'>{row.judul}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.1)' }}>
                              <TableCell></TableCell>
                              <TableCell>Rekomendasi</TableCell>
                              <TableCell>Due Date</TableCell>
                              <TableCell>Status</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {row.rekomendasi && row.rekomendasi.length > 0 ? (
                              row.rekomendasi.map((rekomendasi, index) => <Row key={index} row={rekomendasi} />)
                            ) : (
                              <TableRow>
                                <TableCell colSpan={4} align='center'>
                                  Tidak ada data
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                    {/* <AccordionActions>
                    <Button variant='contained' color='warning'>
                      Ubah
                    </Button>
                    <Button variant='contained' color='error'>
                      Hapus
                    </Button>
                  </AccordionActions> */}
                  </Accordion>
                ))}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      <Grid>
        <Dialog
          fullScreen={fullScreen}
          aria-labelledby='responsive-dialog-title'
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-describedby='dialog-description'
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogContent>
            <Typography variant='h6' sx={{ my: 2 }}>
              And Yakin ingin meneruskan Laporan Hasil Audit ini?
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
            {/* <Typography variant='body2' sx={{ mt: 2 }}>
              Keterangan
            </Typography>
            <Box>
              <QuillEditor
                value={formData.keterangan}
                onChange={content => setFormData(prev => ({ ...prev, keterangan: content }))}
              />
            </Box> */}
          </DialogContent>
          <DialogActions>
            <Button variant='contained' color='secondary' onClick={() => setOpenDialog(false)}>
              Close
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              onClick={handleTeruskan}
              disabled={loading}
              loading={loading}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          aria-labelledby='responsive-dialog-title'
          open={openDialogTolak}
          onClose={() => setOpenDialogTolak(false)}
          aria-describedby='dialog-description'
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogContent>
            <Typography variant='h6' sx={{ my: 2 }}>
              And Yakin ingin menolak LHA ini?
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
            {/* <Typography variant='body2' sx={{ mt: 2 }}>
              Keterangan
            </Typography>
            <Box>
              <QuillEditor
                value={formData.keterangan}
                onChange={content => setFormData(prev => ({ ...prev, keterangan: content }))}
              />
            </Box> */}
          </DialogContent>
          <DialogActions>
            <Button variant='contained' color='secondary' onClick={() => setOpenDialogTolak(false)}>
              Close
            </Button>
            <Button
              type='submit'
              variant='contained'
              color='primary'
              onClick={handleTolak}
              disabled={loading}
              loading={loading}
            >
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </>
  )
}
