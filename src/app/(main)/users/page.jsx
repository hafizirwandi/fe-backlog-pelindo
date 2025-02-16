'use client'
import React, { useEffect, useState } from 'react'

import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  CardContent,
  Card,
  CardHeader
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid' // Import SweetAlert2

import CustomIconButton from '@core/components/mui/IconButton'

const units = ['IT', 'HR', 'Finance']
const divisions = ['Development', 'Operations', 'Support']
const positions = ['Manager', 'Staff', 'Intern']
const statuses = ['Active', 'Inactive']
const roles = ['Group Role 1', 'Group Role 2']

const columns = [
  {
    field: 'name',
    headerName: 'Name'
  },
  {
    field: 'nip',
    headerName: 'NIP'
  },
  {
    field: 'unit',
    headerName: 'Unit'
  },
  {
    field: 'division',
    headerName: 'Division'
  },
  {
    field: 'position',
    headerName: 'Position'
  },
  {
    field: 'username',
    headerName: 'Username'
  },
  {
    field: 'role',
    headerName: 'Role'
  },
  {
    field: 'status',
    headerName: 'Status'
  },

  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: params => (
      <Stack direction='row' spacing={1}>
        <CustomIconButton color='secondary' variant='text' size='small' onClick={() => params.row.onEdit(params.row)}>
          <i className='tabler-pencil' />
        </CustomIconButton>
        <CustomIconButton
          color='secondary'
          variant='text'
          size='small'
          onClick={() => params.row.onDelete(params.row.id)}
        >
          <i className='tabler-trash' />
        </CustomIconButton>
      </Stack>
    )
  }
]

const CustomToolbar = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 16px',

        borderBottom: '1px solid #ddd'
      }}
    >
      {/* Title Section */}
      <Typography variant='h6' component='div' sx={{ fontWeight: 'bold' }}>
        Users
      </Typography>

      {/* Quick Filter Section */}
      <Stack direction='row' alignItems='center' spacing={1}>
        <GridToolbarQuickFilter placeholder='Search...' />
      </Stack>
    </Box>
  )
}

export default function DataGridDemo() {
  const [rows, setRows] = useState([]) // State untuk menyimpan data rows
  const [loading, setLoading] = useState(true) // State untuk loading indicator
  const [formData, setFormData] = useState({ id: '', firstName: '', lastName: '', age: '' }) // State untuk form
  const [isEdit, setIsEdit] = useState(false) // State untuk mengetahui apakah sedang edit
  const [selectedRoles, setSelectedRoles] = useState([])

  useEffect(() => {
    // Fetch data dari JSON Server
    axios
      .get('http://localhost:3001/users') // Endpoint JSON Server
      .then(response => {
        setRows(
          response.data.map(row => ({
            ...row,
            onEdit: handleEdit, // Tambahkan fungsi edit
            onDelete: handleDelete // Tambahkan fungsi delete
          }))
        )
        setLoading(false) // Matikan loading
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setLoading(false) // Matikan loading meskipun error
      })
  }, [])

  const handleAdd = () => {
    if (!formData.firstName || !formData.lastName || !formData.age) return

    const newRow = { ...formData, id: uuidv4() }

    axios
      .post('http://localhost:3001/users', newRow)
      .then(response => {
        setRows(prev => [
          ...prev,
          {
            ...response.data,
            onEdit: handleEdit, // Tambahkan fungsi edit
            onDelete: handleDelete // Tambahkan fungsi delete
          }
        ])
        setFormData({ id: '', firstName: '', lastName: '', age: '' }) // Reset form

        // Tampilkan SweetAlert2 setelah berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data has been added successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      })
      .catch(error => {
        console.error('Error adding data:', error)

        // Tampilkan SweetAlert2 jika terjadi error
        Swal.fire({
          title: 'Error!',
          text: 'Failed to add data.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        })
      })
  }

  const handleEdit = row => {
    setFormData(row)
    setIsEdit(true)
  }

  const handleUpdate = () => {
    axios
      .put(`http://localhost:3001/users/${formData.id}`, formData) // Pastikan ID valid
      .then(() => {
        setRows(prev =>
          prev.map(row => (row.id === formData.id ? { ...formData, onEdit: handleEdit, onDelete: handleDelete } : row))
        )
        setFormData({ id: '', firstName: '', lastName: '', age: '' }) // Reset form
        setIsEdit(false)

        // SweetAlert2 sukses
        Swal.fire({
          title: 'Updated!',
          text: 'The data has been updated successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
      })
      .catch(error => {
        console.error('Error updating data:', error)

        // SweetAlert2 error
        Swal.fire({
          title: 'Error!',
          text: 'Failed to update data.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        })
      })
  }

  // Fungsi Delete dengan SweetAlert2
  const handleDelete = id => {
    // Tanyakan konfirmasi sebelum delete
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this data!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(result => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:3001/users/${id}`) // Pastikan ID valid
          .then(() => {
            setRows(prev => prev.filter(row => row.id !== id)) // Hapus row dari state

            // SweetAlert2 sukses delete
            Swal.fire({
              title: 'Deleted!',
              text: 'The data has been deleted.',
              icon: 'success',
              confirmButtonText: 'OK'
            })
          })
          .catch(error => {
            console.error('Error deleting data:', error)

            // SweetAlert2 error delete
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete data.',
              icon: 'error',
              confirmButtonText: 'Try Again'
            })
          })
      }
    })
  }

  return (
    <>
      <Typography variant='h3' gutterBottom>
        Users
      </Typography>

      <Card>
        <CardContent>
          <Grid container spacing={2}>
            <Grid size={3}>
              <TextField label='Name' fullWidth required margin='normal' />
              <TextField label='NIP' fullWidth required margin='normal' />
              <Button sx={{ mt: 2 }} type='submit' variant='contained' color='primary' fullWidth disabled={loading}>
                {loading ? 'Submitting...' : 'Tambah'}
              </Button>
            </Grid>
            <Grid size={3}>
              <TextField label='Password' fullWidth required margin='normal' />

              <FormControl fullWidth margin='normal'>
                <InputLabel>Unit</InputLabel>
                <Select label='Unit'>
                  {units.map(unit => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Division</InputLabel>
                <Select label='Division'>
                  {divisions.map(division => (
                    <MenuItem key={division} value={division}>
                      {division}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin='normal'>
                <InputLabel>Role</InputLabel>
                <Select
                  label='Role'
                  multiple
                  value={selectedRoles} // Gunakan state untuk menyimpan nilai terpilih
                  onChange={event => setSelectedRoles(event.target.value)} // Perbarui state saat pilihan berubah
                  renderValue={selected => selected.join(', ')} // Menampilkan pilihan dalam bentuk teks
                >
                  {roles.map(role => (
                    <MenuItem key={role} value={role}>
                      <Checkbox checked={selectedRoles.indexOf(role) > -1} /> {/* Tambahkan Checkbox */}
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={3}>
              <FormControl fullWidth margin='normal'>
                <InputLabel>Position</InputLabel>
                <Select label='Position'>
                  {positions.map(position => (
                    <MenuItem key={position} value={position}>
                      {position}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin='normal'>
                <InputLabel>Status</InputLabel>
                <Select label='Status'>
                  {statuses.map(status => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid size={12}>
          <Card>
            <CardContent>
              {/* DataGrid */}
              <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  loading={loading}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5
                      }
                    },
                    filter: {
                      filterModel: {
                        items: []
                      }
                    }
                  }}
                  pageSizeOptions={[10]}
                  disableRowSelectionOnClick
                  slots={{ toolbar: CustomToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true
                    }
                  }}
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
