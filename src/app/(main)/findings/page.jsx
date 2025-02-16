'use client'
import React, { useEffect, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Box, Container, Typography, TextField, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
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
          <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 1, bgcolor: 'white' }}>
            <Typography variant='h5' gutterBottom>
              Findings Form
            </Typography>

            <TextField fullWidth label='Title' variant='outlined' margin='normal' />
            <FormControl fullWidth margin='normal'>
              <InputLabel>Unit</InputLabel>
              <Select value={formData.unit} onChange={e => setFormData({ ...formData, unit: e.target.value })}>
                {unit.map(unit => (
                  <MenuItem key={unit.name} value={unit.name}>
                    {unit.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin='normal'>
              <InputLabel>Division</InputLabel>
              <Select value={formData.division} onChange={e => setFormData({ ...formData, division: e.target.value })}>
                {division.map(division => (
                  <MenuItem key={division.name} value={division.name}>
                    {division.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

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
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
