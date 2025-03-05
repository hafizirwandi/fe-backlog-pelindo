'use client'
import React, { use, useCallback, useEffect, useState } from 'react'

import { notFound, useParams, useRouter } from 'next/navigation'

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
  TableContainer
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Grid from '@mui/material/Grid2'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

import { detailsLha, findLha } from '@/utils/lha'
import { useAuth } from '@/context/AuthContext'

function Row({ row }) {
  const { user, setUser } = useAuth()
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
  const [formData, setFormData] = useState({ id: '', name: '', unit: '', division: '' }) // State untuk form
  const [unit, setUnit] = useState([])
  const [division, setDivision] = useState([])
  const [open, setOpen] = useState(false)

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

  const data = [
    {
      deskripsi: 'Lorem Ipsum is simply dummy text of the printing industry.',
      dueDate: '20 Jan 2024',
      status: 'Selesai',
      tindakLanjut: ['Review dokumen', 'Revisi laporan', 'Finalisasi data']
    },
    {
      deskripsi: 'Another example description goes here.',
      dueDate: '25 Jan 2024',
      status: 'Dalam Proses',
      tindakLanjut: ['Diskusi dengan tim', 'Analisis lebih lanjut']
    }
  ]

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
          temuan: data.temuan
        })
      } else {
        router.replace('/not-found')
      }
    })
  }, [id, router])

  useEffect(() => {
    Lha()
  }, [Lha])

  return (
    <>
      <Typography variant='h4' gutterBottom>
        Detail LHA (Laporan Hasil Audit)
      </Typography>

      <Grid container spacing={2} sx={{ mt: 5, mb: 5 }}>
        <Grid size={12} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant='h6'>Detail LHA</Typography>
          <Button variant='contained' color='primary' onClick={() => console.log('Tombol diklik!')}>
            Teruskan
          </Button>
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
    </>
  )
}
