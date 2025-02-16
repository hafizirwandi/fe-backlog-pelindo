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
  Card
} from '@mui/material'
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
      <Grid container spacing={2}>
        <Grid size={6}>
          <Card>
            <CardContent>
              <Typography variant='h5' gutterBottom>
                LHA (Laporan Hasil Audit)
              </Typography>

              <TextField fullWidth label='Nomor' variant='outlined' margin='normal' />
              <TextField fullWidth label='Tanggal' type='date' variant='outlined' margin='normal' value='2025-09-01' />
              <TextField fullWidth label='Periode Audit' type='year' variant='outlined' margin='normal' />

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
    </>
  )
}
