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
  Tooltip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import EditIcon from '@mui/icons-material/Edit'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import Grid from '@mui/material/Grid2'

export default function Findings() {
  const router = useRouter()
  const [formData, setFormData] = useState({ id: '', name: '', unit: '', division: '' }) // State untuk form
  const [unit, setUnit] = useState([])
  const [division, setDivision] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:3001/units')
      .then(response => setUnit(response.data))
      .catch(error => console.error('Error fetching unit:', error))
  }, [])

  useEffect(() => {
    axios
      .get('http://localhost:3001/divisions')
      .then(response => setDivision(response.data))
      .catch(error => console.error('Error fetching unit:', error))
  }, [])

  const onSubmit = data => {
    console.log('Form Data:', data)
    alert('Form submitted successfully!')
  }

  return (
    <>
      <Typography variant='h4' gutterBottom>
        LHA (Laporan Hasil Audit)
      </Typography>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Card>
            <CardHeader title='Form LHA' />
            <CardContent>
              <Stack direction='row' spacing={1}>
                <TextField fullWidth label='Nomor' variant='outlined' margin='normal' />
                <TextField
                  fullWidth
                  label='Tanggal'
                  type='date'
                  variant='outlined'
                  margin='normal'
                  value='2025-09-01'
                />
                <TextField fullWidth label='Periode Audit' type='year' variant='outlined' margin='normal' />
              </Stack>
              <TextField fullWidth label='Summary' variant='outlined' margin='normal' multiline rows={4} />
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
                sx={{ mt: 2 }}
                onClick={() => router.push('/findings/detail')}
              >
                Submit
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ mt: 5 }}>
        <Grid size={12}>
          <Card>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No. </TableCell>
                    <TableCell>No. LHA </TableCell>
                    <TableCell>Judul</TableCell>
                    <TableCell>Periode</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>State/Posisi LHA</TableCell>
                    <TableCell>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell>xxx/yyy/zz</TableCell>
                    <TableCell>LHA A</TableCell>
                    <TableCell>2024</TableCell>

                    <TableCell>
                      <Chip label='SPV. Operator' variant='outlined' color='primary' size='small' />
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={1}>
                        <Tooltip title='Detail'>
                          <IconButton color='secondary' size='small'>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Edit'>
                          <IconButton color='secondary' size='small'>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Hapus'>
                          <IconButton color='secondary' size='small'>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2</TableCell>
                    <TableCell>xxx/yyy/zz</TableCell>
                    <TableCell>LHA A</TableCell>
                    <TableCell>2024</TableCell>

                    <TableCell>
                      <Chip label='PIC' variant='outlined' color='primary' size='small' />
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={1}>
                        <Tooltip title='Detail'>
                          <IconButton color='secondary' size='small'>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Edit'>
                          <IconButton color='secondary' size='small'>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Hapus'>
                          <IconButton color='secondary' size='small'>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3</TableCell>
                    <TableCell>xxx/yyy/zz</TableCell>
                    <TableCell>LHA A</TableCell>
                    <TableCell>2024</TableCell>

                    <TableCell>
                      <Chip label='PJ' variant='outlined' color='primary' size='small' />
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={1}>
                        <Tooltip title='Detail'>
                          <IconButton color='secondary' size='small'>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Edit'>
                          <IconButton color='secondary' size='small'>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Hapus'>
                          <IconButton color='secondary' size='small'>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>4</TableCell>
                    <TableCell>xxx/yyy/zz</TableCell>
                    <TableCell>LHA A</TableCell>
                    <TableCell>2024</TableCell>

                    <TableCell>
                      <Chip label='Operator' variant='outlined' color='primary' size='small' />
                    </TableCell>
                    <TableCell>
                      <Stack direction='row' spacing={1}>
                        <Tooltip title='Detail'>
                          <IconButton color='secondary' size='small'>
                            <VisibilityIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Edit'>
                          <IconButton color='secondary' size='small'>
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title='Hapus'>
                          <IconButton color='secondary' size='small'>
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
