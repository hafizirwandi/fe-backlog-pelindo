'use client'
import React, { useEffect, useState } from 'react'

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
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import Grid from '@mui/material/Grid2'

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

function Row({ row }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <TableRow>
        <TableCell sx={{ width: 40 }}>
          <IconButton aria-label='expand row' size='small' onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell sx={{ width: 400 }}>{row.deskripsi}</TableCell>
        <TableCell>{row.dueDate}</TableCell>
        <TableCell>
          <Chip
            label={row.status}
            variant='outlined'
            color={row.status === 'Selesai' ? 'success' : 'warning'}
            size='small'
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} style={{ paddingBottom: 0, paddingTop: 0 }}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant='h6' gutterBottom component='div'>
                History
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Tindak Lanjut</TableCell>
                    <TableCell>File Pendukung</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry
                    </TableCell>
                    <TableCell>
                      <Button variant='outlined' size='small' color='primary'>
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry
                    </TableCell>
                    <TableCell>
                      <Button variant='outlined' size='small' color='primary'>
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                      the industry
                    </TableCell>
                    <TableCell>
                      <Button variant='outlined' size='small' color='primary'>
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default function Findings() {
  const router = useRouter()
  const [formData, setFormData] = useState({ id: '', name: '', unit: '', division: '' }) // State untuk form
  const [unit, setUnit] = useState([])
  const [division, setDivision] = useState([])
  const [open, setOpen] = useState(false)

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

  return (
    <>
      <Typography variant='h4' gutterBottom>
        Detail LHA (Laporan Hasil Audit)
      </Typography>

      <Grid container spacing={2} sx={{ mt: 5, mb: 5 }}>
        <Grid size={10}>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell sx={{ width: 200 }}>No. LHA</TableCell>
                <TableCell sx={{ width: 10 }}>:</TableCell>
                <TableCell>xxx/yy./zzzz</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Judul</TableCell>
                <TableCell>:</TableCell>
                <TableCell>LHA 1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Periode</TableCell>
                <TableCell>:</TableCell>
                <TableCell>2024</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Stage Terakhir</TableCell>
                <TableCell>:</TableCell>
                <TableCell>
                  <Chip label='PJ' variant='outlined' color='primary' size='small' />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Status</TableCell>
                <TableCell>:</TableCell>
                <TableCell>
                  <Chip label='Selesai' variant='outlined' color='success' size='small' />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
        <Grid size={2}></Grid>
      </Grid>
      <Divider>TEMUAN</Divider>
      <Grid container spacing={2} sx={{ mt: 5 }}>
        <Grid size={12}>
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
              <Typography component='span'>Temuan 1</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Deskripsi</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <Row key={index} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
            <AccordionActions>
              <Button variant='contained' color='warning'>
                Ubah
              </Button>
              <Button variant='contained' color='error'>
                Hapus
              </Button>
            </AccordionActions>
          </Accordion>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='panel1-content' id='panel1-header'>
              <Typography component='span'>Temuan 2</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Deskripsi</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row, index) => (
                      <Row key={index} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
            <AccordionActions>
              <Button variant='contained' color='warning'>
                Ubah
              </Button>
              <Button variant='contained' color='error'>
                Hapus
              </Button>
            </AccordionActions>
          </Accordion>
        </Grid>
      </Grid>
    </>
  )
}
