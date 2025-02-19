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
  Card,
  CardContent,
  CardHeader,
  Stack,
  IconButton
} from '@mui/material'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import Grid from '@mui/material/Grid2'

import CustomIconButton from '@core/components/mui/IconButton'

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

  const dateNow = new Date().toISOString().split('T')[0]
  const [forms, setForms] = useState([{ id: 1, title: '', due_date: dateNow }])

  // Fungsi untuk menambahkan form baru
  const handleAddForm = () => {
    setForms([...forms, { id: forms.length + 1, title: '', due_date: dateNow }])
  }

  // Hapus form berdasarkan ID
  const handleRemoveForm = id => {
    if (forms.length > 1) {
      setForms(forms.filter(form => form.id !== id))
    }
  }

  // Fungsi untuk mengupdate nilai form tertentu berdasarkan ID
  const handleChange = (id, field, value) => {
    setForms(forms.map(form => (form.id === id ? { ...form, [field]: value } : form)))
  }

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={4}>
          <Card>
            <CardHeader title='Form Temuan' />
            <CardContent>
              <FormControl fullWidth margin='normal'>
                <InputLabel>LHA</InputLabel>
                <Select
                  label='LHA'
                  value={formData.division}
                  onChange={e => setFormData({ ...formData, division: e.target.value })}
                >
                  <MenuItem value='822/LHA/2023'>822/LHA/2023</MenuItem>
                </Select>
              </FormControl>

              <TextField fullWidth label='Title' variant='outlined' margin='normal' />
              <FormControl fullWidth margin='normal'>
                <InputLabel>Unit</InputLabel>
                <Select
                  label='Unit'
                  value={formData.unit}
                  onChange={e => setFormData({ ...formData, unit: e.target.value })}
                >
                  {unit.map(unit => (
                    <MenuItem key={unit.name} value={unit.name}>
                      {unit.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Division</InputLabel>
                <Select
                  label='Division'
                  value={formData.division}
                  onChange={e => setFormData({ ...formData, division: e.target.value })}
                >
                  {division.map(division => (
                    <MenuItem key={division.name} value={division.name}>
                      {division.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Departemen</InputLabel>
                <Select
                  label='Departemen'
                  value={formData.division}
                  onChange={e => setFormData({ ...formData, division: e.target.value })}
                >
                  {division.map(division => (
                    <MenuItem key={division.name} value={division.name}>
                      {division.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField fullWidth label='Title' variant='outlined' margin='normal' multiline rows={4} />
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
        <Grid size={8}>
          <Card>
            <CardHeader title='Rekomendasi' />
            <CardContent>
              <Button variant='contained' color='primary' onClick={handleAddForm} sx={{ mb: 5 }}>
                Tambah
              </Button>

              {forms.map((form, index) => (
                <Stack key={form.id} direction='row' spacing={2} mb={5}>
                  <TextField
                    fullWidth
                    label='Title'
                    value={form.title}
                    onChange={e => handleChange(form.id, 'title', e.target.value)}
                  />
                  <TextField
                    fullWidth
                    label='Due Date'
                    type='date'
                    value={form.due_date}
                    onChange={e => handleChange(form.id, 'due_date', e.target.value)}
                  />

                  <CustomIconButton
                    color='error'
                    variant='contained'
                    onClick={() => handleRemoveForm(form.id)}
                    disabled={forms.length === 1}
                  >
                    <i className='tabler-x' style={{ fontSize: '24px' }} />
                  </CustomIconButton>
                </Stack>
              ))}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
