'use client'
import React, { use, useCallback, useEffect, useState } from 'react'

import { notFound, useParams, useRouter } from 'next/navigation'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Container,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardContent,
  Card,
  Stack,
  CardHeader,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Tooltip,
  Breadcrumbs,
  Link,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Divider,
  List,
  ListItem,
  ListItemText,
  Collapse,
  Paper,
  TableContainer,
  useMediaQuery,
  useTheme
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Grid from '@mui/material/Grid2'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import Swal from 'sweetalert2'

import { detailsLha, findLha, sendLhaPic, sendLhaSpv } from '@/utils/lha'
import { useAuth } from '@/context/AuthContext'
import QuillEditor from '@/components/QuillEditor'

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
          stage: data.stage
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
              temuan: data.temuan
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
      <Typography variant='h4' gutterBottom>
        Detail LHA (Laporan Hasil Audit)
      </Typography>

      <Grid container spacing={2} sx={{ mt: 5, mb: 5 }}>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6'>Detail LHA</Typography>
          {user?.permissions?.includes('update status_lha') && dataLha?.last_stage == roleId && (
            <Button variant='contained' color='primary' onClick={() => setOpenDialog(true)}>
              Teruskan
            </Button>
          )}
        </Grid>
        <Grid size={12}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: 200 }}>No. LHA</TableCell>
                <TableCell sx={{ width: 10 }}>:</TableCell>
                <TableCell>{dataLha.nomor}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Judul</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{dataLha.judul}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Tanggal</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{dataLha.tanggal}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Periode</TableCell>
                <TableCell>:</TableCell>
                <TableCell>{dataLha.periode}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stage Terakhir</TableCell>
                <TableCell>:</TableCell>
                <TableCell>
                  <Chip label={dataLha.stage_name} variant='outlined' color='primary' size='small' />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>:</TableCell>
                <TableCell>
                  <Chip label={dataLha.status_name} variant='outlined' color='success' size='small' />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Deskripsi</TableCell>
                <TableCell>:</TableCell>
                <TableCell>
                  <Box dangerouslySetInnerHTML={{ __html: dataLha.deskripsi }} />
                </TableCell>
              </TableRow>
              {dataLha?.stage?.keterangan && (
                <TableRow>
                  <TableCell>Keterangan</TableCell>
                  <TableCell>:</TableCell>
                  <TableCell>
                    <Box dangerouslySetInnerHTML={{ __html: dataLha.stage.keterangan }} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Grid>
        <Grid size={2}></Grid>
      </Grid>
      {Object.entries(dataLha.temuan).map(([key, item]) => (
        <Box key={key}>
          <Divider textAlign='left' sx={{ my: 5 }}>
            {item.nama_divisi}
          </Divider>
          <Grid container spacing={2}>
            <Grid size={12}>
              {item.data.map((row, index) => (
                <Accordion key={index}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls={`panel-${index}-content`}
                    id={`panel-${index}-header`}
                  >
                    <Typography component='span'>{row.judul}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Rekomendasi</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {row.rekomendasi.map((rekomendasi, index) => (
                            <Row key={index} row={rekomendasi} />
                          ))}
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
        </Box>
      ))}
      <Grid>
        <Dialog
          fullScreen={fullScreen}
          aria-labelledby='responsive-dialog-title'
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          aria-describedby='dialog-description'
        >
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogContent>
            <Typography variant='h6' sx={{ mt: 2 }}>
              And Yakin ingin meneruskan LHA ini?
            </Typography>
            <Typography variant='body2' sx={{ mt: 2 }}>
              Keterangan
            </Typography>
            <Box>
              <QuillEditor
                value={formData.keterangan}
                onChange={content => setFormData(prev => ({ ...prev, keterangan: content }))}
              />
            </Box>
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
      </Grid>
    </>
  )
}
