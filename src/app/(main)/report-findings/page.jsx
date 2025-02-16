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
  Select,
  InputLabel,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Badge,
  Card,
  CardContent
} from '@mui/material'

import Grid from '@mui/material/Grid2'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid' // Import SweetAlert2

const columns = [
  {
    field: 'unit',
    headerName: 'Unit',
    width: 150,
    editable: true
  },

  {
    field: 'division',
    headerName: 'Division',
    width: 150,
    editable: true
  },
  {
    field: 'number_of_finding',
    headerName: 'Count Findings',
    width: 150,
    editable: true
  },
  {
    field: 'number_of_recomendation',
    headerName: 'Count Recomendations',
    width: 150,
    editable: true
  },
  {
    field: 'number_of_status_finish',
    headerName: 'Finish',
    width: 150,
    editable: true
  },

  {
    field: 'number_of_status_notfinish',
    headerName: 'Not Finish',
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
          View
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
        Units
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
  const [formData, setFormData] = useState({ id: '', name: '' }) // State untuk form
  const [isEdit, setIsEdit] = useState(false) // State untuk mengetahui apakah sedang edit

  useEffect(() => {
    // Fetch data dari JSON Server
    axios
      .get('http://localhost:3001/report-findings') // Endpoint JSON Server
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
    if (!formData.name) return

    const newRow = { ...formData, id: uuidv4() }

    axios
      .post('http://localhost:3001/units', newRow)
      .then(response => {
        setRows(prev => [
          ...prev,
          {
            ...response.data,
            onEdit: handleEdit, // Tambahkan fungsi edit
            onDelete: handleDelete // Tambahkan fungsi delete
          }
        ])
        setFormData({ id: '', name: '' }) // Reset form

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
      .put(`http://localhost:3001/units/${formData.id}`, formData) // Pastikan ID valid
      .then(() => {
        setRows(prev =>
          prev.map(row => (row.id === formData.id ? { ...formData, onEdit: handleEdit, onDelete: handleDelete } : row))
        )
        setFormData({ id: '', name: '' }) // Reset form
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
          .delete(`http://localhost:3001/units/${id}`) // Pastikan ID valid
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
      <Typography variant='h3'>Report Findings</Typography>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select label='Unit'>
                <MenuItem value='Unit A'>Unit A</MenuItem>
                <MenuItem value='Unit B'>Unit B</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Division</InputLabel>
              <Select label='Division'>
                <MenuItem value='Division A'>Division A</MenuItem>
                <MenuItem value='Division B'>Division B</MenuItem>
              </Select>
            </FormControl>

            <Button variant='contained' color='primary'>
              Search
            </Button>
          </Box>

          {/* DataGrid */}
          <Box>
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
            />
          </Box>
        </CardContent>
      </Card>
      <Box sx={{ width: '100%', mt: 4, p: 3, boxShadow: 3, borderRadius: 1, bgcolor: 'white' }}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Findings</TableCell>
                  <TableCell>Recomendations</TableCell>
                  <TableCell>Duedate</TableCell>
                  <TableCell>Result</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell rowSpan={2}>1.</TableCell>
                  <TableCell rowSpan={2}>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </TableCell>
                  <TableCell>
                    1920/xxx/xxxx <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </TableCell>
                  <TableCell>21 April 2019</TableCell>
                  <TableCell>
                    YYYY.MM.DD <br />
                    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </TableCell>
                  <TableCell>
                    <Chip label='Finish' color='primary' />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    1920/xxx/xxxx <br />
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                  </TableCell>
                  <TableCell>21 April 2019</TableCell>
                  <TableCell>
                    YYYY.MM.DD <br />
                    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                    <br />
                    <br />
                    YYYY.MM.DD <br />
                    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
                  </TableCell>
                  <TableCell>
                    <Chip label='Finish' color='primary' />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
