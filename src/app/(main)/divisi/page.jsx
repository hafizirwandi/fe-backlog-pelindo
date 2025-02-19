'use client'
import React, { useEffect, useState } from 'react'

import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CardContent,
  Card
} from '@mui/material'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid' // Import SweetAlert2

const columns = [
  {
    field: 'name',
    headerName: 'Division name',
    width: 150,
    editable: true
  },

  {
    field: 'unit',
    headerName: 'Unit',
    width: 150,
    editable: true
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: params => (
      <Stack direction='row' spacing={1}>
        <Button variant='contained' color='primary' size='small' onClick={() => params.row.onEdit(params.row)}>
          Edit
        </Button>
        <Button variant='contained' color='error' size='small' onClick={() => params.row.onDelete(params.row.id)}>
          Delete
        </Button>
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
        Divisi
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
  const [formData, setFormData] = useState({ id: '', name: '', unit: '' }) // State untuk form
  const [isEdit, setIsEdit] = useState(false) // State untuk mengetahui apakah sedang edit
  const [unit, setUnit] = useState([])

  useEffect(() => {
    // Fetch data dari JSON Server
    axios
      .get('http://localhost:3001/divisions') // Endpoint JSON Server
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

  useEffect(() => {
    axios
      .get('http://localhost:3001/units')
      .then(response => setUnit(response.data))
      .catch(error => console.error('Error fetching unit:', error))
  }, [])

  const handleAdd = () => {
    if (!formData.name || !formData.unit) return

    const newRow = { ...formData, id: uuidv4() }

    axios
      .post('http://localhost:3001/divisions', newRow)
      .then(response => {
        setRows(prev => [
          ...prev,
          {
            ...response.data,
            onEdit: handleEdit, // Tambahkan fungsi edit
            onDelete: handleDelete // Tambahkan fungsi delete
          }
        ])
        setFormData({ id: '', name: '', unit: '' }) // Reset form

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
      .put(`http://localhost:3001/divisions/${formData.id}`, formData) // Pastikan ID valid
      .then(() => {
        setRows(prev =>
          prev.map(row => (row.id === formData.id ? { ...formData, onEdit: handleEdit, onDelete: handleDelete } : row))
        )
        setFormData({ id: '', name: '', unit: '' }) // Reset form
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
          .delete(`http://localhost:3001/divisions/${id}`) // Pastikan ID valid
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
      <Typography variant='h3'>Divisi</Typography>
      <Card>
        <CardContent>
          {/* Form */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth size='small'>
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
            <TextField
              fullWidth
              size='small'
              label='Nama'
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />

            {isEdit ? (
              <Button size='small' variant='contained' color='primary' onClick={handleUpdate}>
                Update
              </Button>
            ) : (
              <Button size='small' variant='contained' color='primary' onClick={handleAdd}>
                Add
              </Button>
            )}
          </Box>

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
    </>
  )
}
