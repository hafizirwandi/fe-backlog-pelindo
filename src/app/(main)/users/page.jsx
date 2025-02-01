'use client'
import React, { useEffect, useState } from 'react'

import { Box, Button, Chip, Stack, TextField, Typography } from '@mui/material'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid' // Import SweetAlert2

const columns = [
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
    editable: true
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
    editable: true
  },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
    editable: true
  },
  {
    field: 'badge',
    headerName: 'Badge',
    width: 160,
    renderCell: params => {
      const age = params.row?.age

      if (age !== undefined && age !== null) {
        return age > 44 ? <Chip label='Primary' color='primary' /> : <Chip label='Default' color='default' />
      }

      return <Chip label='No Data' color='default' />
    }
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
        backgroundColor: '#f5f5f5',
        borderBottom: '1px solid #ddd'
      }}
    >
      {/* Title Section */}
      <Typography variant='h6' component='div' sx={{ fontWeight: 'bold', color: '#333' }}>
        Users
      </Typography>

      {/* Quick Filter Section */}
      <Stack direction='row' alignItems='center' spacing={1}>
        <GridToolbarQuickFilter
          placeholder='Search...'
          sx={{
            '& input': {
              padding: '6px 8px',
              fontSize: '14px',
              borderRadius: '4px',
              backgroundColor: 'white',
              border: '1px solid #ccc'
            }
          }}
        />
      </Stack>
    </Box>
  )
}

export default function DataGridDemo() {
  const [rows, setRows] = useState([]) // State untuk menyimpan data rows
  const [loading, setLoading] = useState(true) // State untuk loading indicator
  const [formData, setFormData] = useState({ id: '', firstName: '', lastName: '', age: '' }) // State untuk form
  const [isEdit, setIsEdit] = useState(false) // State untuk mengetahui apakah sedang edit

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
    <Box sx={{ width: '100%' }}>
      {/* Form */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label='First Name'
          value={formData.firstName}
          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
        />
        <TextField
          label='Last Name'
          value={formData.lastName}
          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
        />
        <TextField
          label='Age'
          type='number'
          value={formData.age}
          onChange={e => setFormData({ ...formData, age: e.target.value })}
        />
        {isEdit ? (
          <Button variant='contained' color='primary' onClick={handleUpdate}>
            Update
          </Button>
        ) : (
          <Button variant='contained' color='primary' onClick={handleAdd}>
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
    </Box>
  )
}
