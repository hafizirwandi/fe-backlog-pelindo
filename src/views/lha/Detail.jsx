'use client'
import React, { use, useCallback, useEffect, useRef, useState } from 'react'

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
  Tooltip,
  List,
  ListItem,
  ListItemText
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Grid from '@mui/material/Grid2'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import Swal from 'sweetalert2'

import { Check, Clear, OpenInNew, Print, Send, Visibility, X } from '@mui/icons-material'
import { Timeline, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab'
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem'

import { detailsLha, findLha, rejectLha, sendLhaAuditor, sendLhaPic, sendLhaPj, sendLhaSpv } from '@/utils/lha'
import { useAuth } from '@/context/AuthContext'
import CustomTextField from '@/@core/components/mui/TextField'
import {
  acceptTemuan,
  closingTemuan,
  generateMonitoringPdf,
  generateTemuanPdf,
  inputHasilAuditor,
  logTemuan,
  rejectTemuan,
  selesaiClosingTemuan,
  selesaiInternalTemuan,
  sendTemuanPic,
  submitTemuan,
  tolakSelesaiInternalTemuan
} from '@/utils/temuan'

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
                          <ul style={{ margin: 0, padding: 0 }}>
                            {tindaklanjut.files.map((item, index) => (
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
  const [listLogTemuan, setListLogTemuan] = useState(null)
  const [openDialogLog, setOpenDialogLog] = useState(false)
  const [selesaiInternal, setSelesaiInternal] = useState(false)
  const [selesaiClosing, setSelesaiClosing] = useState(false)
  const [expanded, setExpanded] = useState(null)
  const [labelKonfirmasi, setLabelKonfirmasi] = useState(null)
  const [labelTolak, setLabelTolak] = useState(null)

  const params = useParams()
  const lhaId = params.id

  const handleExpanded = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : null)
  }

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

  const dialogRef = useRef(null)

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
        router.replace('/lha')
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
        res = await submitTemuan(sendLha)

        // res = await acceptTemuan(sendLha)
      }

      if (user?.permissions?.includes('update status-lha-penanggungjawab')) {
        res = await acceptTemuan(sendLha)
      }

      if (selesaiClosing) {
        res = await selesaiClosingTemuan(sendLha)
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

        setExpanded(null)
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

      if (selesaiClosing) {
        res = await inputHasilAuditor(sendLha)
      }

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
      setExpanded(null)
    }
  }

  const roleId = user?.roleAndPermissions?.[0]?.id

  const checkId = idToCheck => {
    return user?.roleAndPermissions?.some(role => role.id === idToCheck)
  }

  const capitalizeFirstLetter = text => {
    return text

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
    setTemuanId(null)
  }

  const handleSelesaiInternal = async () => {
    const sendLha = {
      temuan_id: temuanId,
      keterangan: formData.keterangan
    }

    setLoading(true)

    try {
      let res = await selesaiInternalTemuan(sendLha)

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
          temuan_id: '',
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
      setExpanded(null)
    }
  }

  const handleTolakInternal = async () => {
    const sendLha = {
      temuan_id: temuanId,
      keterangan: formData.keterangan
    }

    setLoading(true)

    try {
      let res = await tolakSelesaiInternalTemuan(sendLha)

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
          temuan_id: '',
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
      setExpanded(null)
    }
  }

  const handleCetakMonitoring = async () => {
    setLoading(true)

    try {
      const blob = await generateMonitoringPdf(lhaId)

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

                  {dataLha?.last_stage == 2 && (
                    <Button
                      variant='contained'
                      color='info'
                      endIcon={<Print />}
                      onClick={() => handleCetakMonitoring()}
                    >
                      Cetak Monitoring
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
                        label: 'Status',
                        value: <Chip label={dataLha.status_name} variant='outlined' color='success' size='small' />
                      },
                      {
                        label: 'Deskripsi',
                        value: <Box dangerouslySetInnerHTML={{ __html: dataLha.deskripsi }} />
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
                    expanded={expanded === `panel-${index}-${item.divisi_id}`}
                    onChange={handleExpanded(`panel-${index}-${item.divisi_id}`)}
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

                          if (row.stage.action === 'submit') {
                            color = 'warning'
                          }

                          if (row.stage.action === 'draf') {
                            color = 'secondary'
                          }

                          return (
                            <Chip label={capitalizeFirstLetter(row.stage.action_name)} color={color} size='small' />
                          )
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
                                  },
                                  row?.closing == 1 && {
                                    label: 'Berita Acara',
                                    value: (
                                      <>
                                        <ul style={{ margin: 0, padding: 0 }}>
                                          {row.temuanHasFiles.map((item, index) => (
                                            <li
                                              key={index}
                                              style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}
                                            >
                                              <span>
                                                {index + 1}. {item.nama}
                                              </span>
                                              <Button
                                                size='small'
                                                color='primary'
                                                variant='contained'
                                                sx={{ mt: 1 }}
                                                onClick={() =>
                                                  window.open(item.url ?? '#', '_blank', 'noopener,noreferrer')
                                                }
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
                                    label: 'Log',
                                    value: (
                                      <>
                                        <Button
                                          variant='outlined'
                                          color='secondary'
                                          size='small'
                                          onClick={() => {
                                            setTemuanId(prev => {
                                              const newId = row.id

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
                                        <TimelineLogDialog
                                          open={openDialogLog}
                                          onClose={() => setOpenDialogLog(false)}
                                          logs={listLogTemuan}
                                        />
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
                              <>
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
                              </>
                            )}

                          {row.last_stage > 1 && row.last_stage !== 3 && checkId(row.last_stage) && (
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
                                Approve
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
                                Reject
                              </Button>
                            </>
                          )}

                          {row.last_stage == 1 && row.stage.action == 'ditolak' && checkId(row.last_stage) && (
                            <>
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
                              <Button
                                variant='contained'
                                fullWidth
                                color='warning'
                                onClick={() => {
                                  router.push(`/temuan/${row.id}/rekomendasi`, '_blank')
                                }}
                                sx={{ my: 1 }}
                              >
                                Perbaiki
                              </Button>
                            </>
                          )}

                          {row.last_stage >= 5 && row.status >= 1 && (
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
                              sx={{ my: 1 }}
                            >
                              {loading ? 'Mencetak...' : 'Cetak'}
                            </Button>
                          )}

                          {row.last_stage === 5 &&
                            row.status == 1 &&
                            user?.permissions.includes('update selesai-internal') && (
                              <>
                                <Button
                                  variant='contained'
                                  fullWidth
                                  color='success'
                                  endIcon={<Check />}
                                  onClick={() => {
                                    setOpenDialog(true)
                                    setTemuanId(row.id)
                                    setSelesaiInternal(true)
                                  }}
                                >
                                  Selesai Internal
                                </Button>
                                <Button
                                  variant='contained'
                                  fullWidth
                                  color='error'
                                  endIcon={<Clear />}
                                  onClick={() => {
                                    setOpenDialogTolak(true)
                                    setTemuanId(row.id)
                                    setSelesaiInternal(true)
                                  }}
                                  sx={{ my: 1 }}
                                >
                                  Tolak
                                </Button>
                              </>
                            )}

                          {row.last_stage === 5 &&
                            row.closing == 1 &&
                            user?.permissions.includes('update selesai-internal') && (
                              <>
                                <Button
                                  variant='contained'
                                  fullWidth
                                  color='success'
                                  endIcon={<Check />}
                                  onClick={() => {
                                    setOpenDialog(true)
                                    setTemuanId(row.id)
                                    setSelesaiClosing(true)
                                    setLabelKonfirmasi('Anda yakin ingin menyetujui closing temuan ini?')
                                  }}
                                >
                                  Closing Temuan
                                </Button>
                                <Button
                                  variant='contained'
                                  fullWidth
                                  color='error'
                                  endIcon={<Clear />}
                                  onClick={() => {
                                    setOpenDialogTolak(true)
                                    setTemuanId(row.id)
                                    setSelesaiClosing(true)
                                    setLabelTolak('Anda yakin ingin menolak closing temuan ini?')
                                  }}
                                  sx={{ my: 1 }}
                                >
                                  Tolak
                                </Button>
                              </>
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
          aria-labelledby='konfirmasi-dialog'
          open={openDialog}
          onClose={() => {
            setFormData({
              lha_id: '',
              keterangan: ''
            })
            setOpenDialog(false)
            setTemuanId(null)
            setLabelKonfirmasi(null)
          }}
          aria-describedby='dialog-konfirmasi-description'
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogContent>
            <Typography variant='h6' sx={{ my: 2 }}>
              {labelKonfirmasi ?? 'Anda yakin ingin meneruskan temuan ini?'}
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
            <Button variant='contained' color='secondary' onClick={() => setOpenDialog(false)}>
              Close
            </Button>
            {selesaiInternal ? (
              <Button
                type='submit'
                variant='contained'
                color='primary'
                onClick={handleSelesaiInternal}
                disabled={loading}
                loading={loading}
              >
                Submit
              </Button>
            ) : (
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
            )}
          </DialogActions>
        </Dialog>

        <Dialog
          fullScreen={fullScreen}
          aria-labelledby='dialog-tolak'
          open={openDialogTolak}
          onClose={() => {
            setFormData({
              lha_id: '',
              keterangan: ''
            })
            setOpenDialog(false)
            setTemuanId(null)
            setLabelTolak(null)
          }}
          aria-describedby='dialog-tolak-description'
          fullWidth={true}
          maxWidth={'sm'}
        >
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogContent>
            <Typography variant='h6' sx={{ my: 2 }}>
              {labelTolak ?? 'Anda yakin ingin menolak temuan ini?'}
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
            <Button variant='contained' color='secondary' onClick={() => setOpenDialogTolak(false)}>
              Close
            </Button>
            {selesaiInternal ? (
              <Button
                type='submit'
                variant='contained'
                color='primary'
                onClick={handleTolakInternal}
                disabled={loading}
                loading={loading}
              >
                Submit
              </Button>
            ) : (
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
            )}
          </DialogActions>
        </Dialog>
      </Grid>
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
                      {log.action_name}
                    </Typography>
                    <Typography variant='body2' color='textSecondary'>
                      {new Date(log.created_at).toLocaleString()}
                    </Typography>
                    <Typography variant='body2' color='textPrimary'>
                      {log.keterangan}
                    </Typography>
                    <Typography variant='body2' color='textSecondary' fontStyle='italic'>
                      User: {log.user}
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
