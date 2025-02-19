'use client'
import React, { useEffect, useState } from 'react'

import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import axios from 'axios'

import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'

import {
  Box,
  Button,
  Typography,
  Table,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  TableHead,
  TableBody,
  Stack,
  Card,
  CardContent,
  CardActions
} from '@mui/material'
import Grid from '@mui/material/Grid2'

const columns = [
  {
    field: 'title',
    headerName: 'Title',
    width: 150,
    editable: true
  },

  {
    field: 'due_date',
    headerName: 'Due date',
    width: 150,
    editable: true
  },
  {
    field: 'status',
    headerName: 'Status',
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

export default function PageDetail() {
  const [rows, setRows] = useState([]) // State untuk menyimpan data rows
  const [loading, setLoading] = useState(true) // State untuk loading indicator
  const [formData, setFormData] = useState({ id: '', title: '', due_date: '', status: '' }) // State untuk form
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    // Fetch data dari JSON Server
    axios
      .get('http://localhost:3001/recomendations') // Endpoint JSON Server
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
    if (!formData.title) return

    const newRow = { ...formData, id: uuidv4() }

    axios
      .post('http://localhost:3001/recomendations', newRow)
      .then(response => {
        setRows(prev => [
          ...prev,
          {
            ...response.data,
            onEdit: handleEdit, // Tambahkan fungsi edit
            onDelete: handleDelete // Tambahkan fungsi delete
          }
        ])
        setFormData({ id: '', title: '', due_date: '', status: '' }) // Reset form

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
    console.log(row)
    setIsEdit(true)
  }

  const handleUpdate = () => {
    axios
      .put(`http://localhost:3001/recomendations/${formData.id}`, formData) // Pastikan ID valid
      .then(() => {
        setRows(prev =>
          prev.map(row => (row.id === formData.id ? { ...formData, onEdit: handleEdit, onDelete: handleDelete } : row))
        )
        setFormData({ id: '', title: '', due_date: '', status: '' }) // Reset form
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
          .delete(`http://localhost:3001/recomendations/${id}`) // Pastikan ID valid
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

  const dateNow = new Date().toISOString().split('T')[0]

  return (
    <>
      <Typography variant='h3' gutterBottom>
        Findings Detail
      </Typography>

      <Grid container spacing={2}>
        <Grid size={10}>
          <Card>
            <CardContent>
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: '100px' }}>Title</td>
                    <td style={{ width: '20px' }}>:</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                  <tr>
                    <td>Unit</td>
                    <td>:</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                  <tr>
                    <td>Division</td>
                    <td>:</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                  <tr>
                    <td>Summary</td>
                    <td>:</td>
                    <td>Lorem Ipsum</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={2}>
          <Card
            sx={{
              mt: 4,
              p: 3,
              boxShadow: 3,
              borderRadius: 1,
              bgcolor: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: 2
            }}
          >
            <Button variant='contained'>Send To SV</Button>
            <Button variant='contained' color='error'>
              Reject
            </Button>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid size={8}>
          <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 1, bgcolor: 'white' }}>
            <h3>Recomendations</h3>
            <br />
            {/* Form */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label='Title'
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                fullWidth
                label='Due Date'
                type='date'
                value={formData.due_date || dateNow}
                onChange={e => setFormData({ ...formData, due_date: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value })}
                  label='Status'
                >
                  <MenuItem value='finish'>Finish</MenuItem>
                  <MenuItem value='not finish'>Not Finish</MenuItem>
                </Select>
              </FormControl>

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
                slotProps={{
                  toolbar: {
                    showQuickFilter: true
                  }
                }}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
