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
  Paper,
  Tooltip
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Grid from '@mui/material/Grid2'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import Swal from 'sweetalert2'

import { Check, Clear, Print, Send, Visibility, X } from '@mui/icons-material'

import { detailsLha, findLha, rejectLha, sendLhaAuditor, sendLhaPic, sendLhaPj, sendLhaSpv } from '@/utils/lha'
import { useAuth } from '@/context/AuthContext'
import QuillEditor from '@/components/QuillEditor'
import CustomTextField from '@/@core/components/mui/TextField'
import { acceptTemuan, generateTemuanPdf, rejectTemuan, sendTemuanPic, submitTemuan } from '@/utils/temuan'

function Row({ row }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell sx={{ width: 40 }}>
          {row.tindaklanjut.length > 0 && (
            <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          )}
        </TableCell>
        <TableCell sx={{ maxWidth: 300 }}>
          <p style={{ whiteSpace: 'pre-line' }}>{row.deskripsi ?? '-'}</p>
        </TableCell>
        <TableCell align='center'>{row.batas_tanggal}</TableCell>
        <TableCell align='center'>{row.tanggal_selesai}</TableCell>
        <TableCell align='center'>
          <Chip
            label={row.status_name}
            variant='outlined'
            color={row.status_name === 'Selesai' ? 'success' : 'warning'}
            size='small'
          />
        </TableCell>
      </TableRow>
      {row.tindaklanjut.length > 0 && (
        <TableRow sx={{ paddingX: 5 }}>
          <TableCell colSpan={5} style={{ paddingBottom: 0, paddingTop: 0 }}>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <Box sx={{ margin: 2 }}>
                <Table size='small' aria-label='purchases'>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography sx={{ fontWeight: 'bold' }}>Tindak Lanjut</Typography>
                      </TableCell>
                      <TableCell align='center'>
                        <Typography sx={{ fontWeight: 'bold' }}>File Pendukung</Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.tindaklanjut.map((tindaklanjut, index) => (
                      <TableRow key={index}>
                        <TableCell>{tindaklanjut.deskripsi}</TableCell>
                        <TableCell align='center'>
                          {tindaklanjut.files.map((file, indexFIle) => (
                            <Tooltip key={indexFIle} title={file.nama} arrow>
                              <IconButton
                                size='small'
                                color='primary'
                                onClick={() => window.open(file.url ?? '#', '_blank', 'noopener,noreferrer')}
                                sx={{ width: 24, height: 24, ml: 1 }}
                              >
                                <Visibility fontSize='small' />
                              </IconButton>
                            </Tooltip>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
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
  const [temuanId, setTemuanId] = useState(null)

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
    temuan_last_stage: '',
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
          temuan_last_stage: data.temuan_last_stage,
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
    let sendLha = {
      lha_id: dataLha.id,
      keterangan: formData.keterangan
    }

    if (temuanId) {
      sendLha = {
        temuan_id: temuanId,
        keterangan: formData.keterangan
      }
    }

    setLoading(true)

    try {
      let res = null

      if (user?.permissions?.includes('update status-lha-admin') && !temuanId) {
        res = await sendLhaSpv(sendLha)
      }

      if (user?.permissions?.includes('update status-lha-admin') && temuanId) {
        res = await submitTemuan(sendLha)
      }

      if (user?.permissions?.includes('update status-lha-spv')) {
        res = await sendTemuanPic(sendLha)
      }

      if (user?.permissions?.includes('update status-lha-pic')) {
        res = await acceptTemuan(sendLha)
      }

      if (user?.permissions?.includes('update status-lha-penanggungjawab')) {
        res = await acceptTemuan(sendLha)
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

        setFormData({
          lha_id: '',
          keterangan: ''
        })
        setTemuanId(null)

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
              temuan_last_stage: data.temuan_last_stage,
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
    let sendLha = {
      temuan_id: dataLha.id,
      last_stage: dataLha.last_stage,
      keterangan: formData.keterangan
    }

    if (temuanId) {
      sendLha = {
        temuan_id: temuanId,
        keterangan: formData.keterangan
      }
    }

    setLoading(true)

    try {
      let res = await rejectTemuan(sendLha)

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

        setFormData({
          lha_id: '',
          keterangan: ''
        })
        setTemuanId(null)

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
              temuan_last_stage: data.temuan_last_stage,
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

  const checkId = idToCheck => {
    return user?.roleAndPermissions?.some(role => role.id === idToCheck)
  }

  const capitalizeFirstLetter = text => {
    return text.charAt(0).toUpperCase() + text.slice(1)
  }

  const handleCetakTemuan = async idTemuan => {
    setLoading(true)

    try {
      const blob = await generateTemuanPdf(idTemuan)

      const pdfUrl = window.URL.createObjectURL(blob)

      window.open(pdfUrl, '_blank')
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: error || 'Terjadi kesalahan',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 5, mb: 5 }}>
        <Grid size={12}>
          <Card>
            <CardActions>
              <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='h5'>Detail LHA</Typography>
                <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
                  {user?.permissions?.includes('update status-lha-admin') && dataLha?.last_stage == roleId && (
                    <Button
                      variant='contained'
                      color='primary'
                      endIcon={dataLha?.status == 0 ? <Send /> : <Check />}
                      onClick={() => setOpenDialog(true)}
                    >
                      Kirim
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

                      // {
                      //   label: 'Posisi Sekarang',
                      //   value: <Chip label={dataLha.stage_name} variant='outlined' color='primary' size='small' />
                      // },
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
                        paddingX: 5
                      }}
                      aria-controls={`panel-content-${index}`}
                      id={`panel-header-${index}`}
                    >
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}
                      >
                        <Typography component='span'>{row.judul}</Typography>
                        {(() => {
                          let color = 'success'

                          if (row.stage.action === 'ditolak') {
                            color = 'error'
                          }

                          return <Chip label={capitalizeFirstLetter(row.stage.action)} color={color} size='small' />
                        })()}
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={5}>
                        <Grid size={{ sm: 12, md: 10 }}>
                          <TableContainer>
                            <Table size='small'>
                              <TableBody>
                                {[
                                  { label: 'No. Temuan', value: row.nomor },
                                  { label: 'Judul', value: row.judul },
                                  {
                                    label: 'Status',
                                    value: (
                                      <Chip label={row.status_name} variant='outlined' color='success' size='small' />
                                    )
                                  },
                                  {
                                    label: 'Posisi Sekarang',
                                    value: (
                                      <Chip label={row.stage_name} variant='outlined' color='primary' size='small' />
                                    )
                                  },
                                  {
                                    label: 'Deskripsi',
                                    value: <Box dangerouslySetInnerHTML={{ __html: row.deskripsi }} />
                                  },
                                  row?.stage?.keterangan && {
                                    label: `Keterangan ${row.stage.action}`,
                                    value: (
                                      <>
                                        <Typography variant='p' gutterBottom style={{ whiteSpace: 'pre-line' }}>
                                          {row.stage.keterangan}
                                        </Typography>
                                      </>
                                    )
                                  }
                                ]
                                  .filter(Boolean)
                                  .map((row, index) => (
                                    <TableRow key={index}>
                                      <TableCell sx={{ fontWeight: 'bold', width: 200 }}>{row.label}</TableCell>
                                      <TableCell sx={{ width: 10, fontWeight: 'bold', color: 'primary.main' }}>
                                        :
                                      </TableCell>
                                      <TableCell>{row.value}</TableCell>
                                    </TableRow>
                                  ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </Grid>
                        <Grid size={{ sm: 12, md: 2 }}>
                          {row.last_stage == 3 &&
                            checkId(row.last_stage) &&
                            user.permissions.includes('create tindaklanjut') && (
                              <Button
                                variant='contained'
                                fullWidth
                                color='warning'
                                onClick={() => {
                                  router.push(`/temuan/${row.id}/rekomendasi`)
                                }}
                                sx={{ my: 1 }}
                              >
                                Tindaklanjut
                              </Button>
                            )}

                          {row.last_stage > 1 && checkId(row.last_stage) && (
                            <>
                              <Button
                                variant='contained'
                                fullWidth
                                color='primary'
                                endIcon={<Check />}
                                onClick={() => {
                                  setOpenDialog(true)
                                  setTemuanId(row.id)
                                }}
                                sx={{ my: 1 }}
                              >
                                Terima
                              </Button>
                              <Button
                                fullWidth
                                variant='contained'
                                color='error'
                                endIcon={<Clear />}
                                onClick={() => {
                                  setOpenDialogTolak(true)
                                  setTemuanId(row.id)
                                }}
                              >
                                Tolak
                              </Button>
                            </>
                          )}

                          {row.last_stage == 1 && row.stage.action == 'ditolak' && (
                            <Button
                              variant='contained'
                              fullWidth
                              color='primary'
                              endIcon={<Send />}
                              onClick={() => {
                                setOpenDialog(true)
                                setTemuanId(row.id)
                              }}
                            >
                              Kirim
                            </Button>
                          )}

                          {row.status >= 2 && (
                            <Button
                              variant='contained'
                              fullWidth
                              color='secondary'
                              endIcon={<Print />}
                              onClick={() => {
                                setLoading(true)
                                setTemuanId(prev => {
                                  const newId = row.id

                                  setTimeout(() => {
                                    handleCetakTemuan(newId)
                                  }, 1000)

                                  return newId
                                })
                              }}
                              disabled={loading}
                            >
                              {loading ? 'Mencetak...' : 'Cetak'}
                            </Button>
                          )}
                        </Grid>
                      </Grid>
                      <Typography variant='h5' gutterBottom sx={{ mt: 5 }}>
                        List Rekomendasi
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ borderBottom: '2px solid rgba(0, 0, 0, 0.1)' }}>
                              <TableCell></TableCell>
                              <TableCell>
                                <Typography sx={{ fontWeight: 'bold' }}>Rekomendasi</Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography sx={{ fontWeight: 'bold' }}>Batas Tanggal</Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography sx={{ fontWeight: 'bold' }}>Tanggal Selesai</Typography>
                              </TableCell>
                              <TableCell align='center'>
                                <Typography sx={{ fontWeight: 'bold' }}>Status</Typography>
                              </TableCell>
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
          onClose={() => {
            setFormData({
              lha_id: '',
              keterangan: ''
            })
            setOpenDialog(false)
            setTemuanId(null)
          }}
          aria-describedby='dialog-description'
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogContent>
            <Typography variant='h6' sx={{ my: 2 }}>
              Anda yakin ingin meneruskan temuan ini?
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
          onClose={() => {
            setFormData({
              lha_id: '',
              keterangan: ''
            })
            setOpenDialog(false)
            setTemuanId(null)
          }}
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
