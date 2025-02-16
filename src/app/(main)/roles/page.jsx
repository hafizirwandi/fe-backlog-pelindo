'use client'
import React, { useEffect, useState } from 'react'

import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Grid2
} from '@mui/material'

import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid' // Import SweetAlert2
import { CCardTitle } from '@coreui/react-pro'

import CustomIconButton from '@core/components/mui/IconButton'

const columns = [
  {
    field: 'name',
    headerName: 'Role',
    width: 300
  },

  {
    field: 'actions',
    headerName: 'Actions',
    width: 200,

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
        <CustomIconButton
          color='secondary'
          variant='text'
          size='small'
          onClick={() => params.row.onEnterPermission(params.row.id)}
        >
          <i className='tabler-eye' />
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
        Roles
      </Typography>

      {/* Quick Filter Section */}
      <Stack direction='row' alignItems='center' spacing={1}>
        <GridToolbarQuickFilter placeholder='Cari...' />
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
      .get('http://localhost:3001/roles') // Endpoint JSON Server
      .then(response => {
        setRows(
          response.data.map(row => ({
            ...row,
            onEnterPermission: handleEnterPermission,
            onEdit: handleEdit, // Tambahkan fungsi edit
            onDelete: handleDelete
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
      .post('http://localhost:3001/roles', newRow)
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

  const handleEnterPermission = id => {
    router.push('/permissions/')
  }

  const handleUpdate = () => {
    axios
      .put(`http://localhost:3001/roles/${formData.id}`, formData) // Pastikan ID valid
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
          .delete(`http://localhost:3001/roles/${id}`) // Pastikan ID valid
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

  const [searchTerm, setSearchTerm] = useState('')

  const [permissions, setPermissions] = useState([
    { id: 'user-list', label: 'User List', checked: true },
    { id: 'user-edit', label: 'User Edit', checked: true },
    { id: 'user-delete', label: 'User Delete', checked: false },
    { id: 'user-create', label: 'User Create', checked: false },
    { id: 'post-list', label: 'Post List', checked: true },
    { id: 'post-edit', label: 'Post Edit', checked: false },
    { id: 'post-delete', label: 'Post Delete', checked: false },
    { id: 'post-create', label: 'Post Create', checked: true },
    { id: 'comment-list', label: 'Comment List', checked: true },
    { id: 'comment-edit', label: 'Comment Edit', checked: false },
    { id: 'comment-delete', label: 'Comment Delete', checked: false },
    { id: 'comment-create', label: 'Comment Create', checked: true },
    { id: 'category-list', label: 'Category List', checked: true },
    { id: 'category-edit', label: 'Category Edit', checked: false },
    { id: 'category-delete', label: 'Category Delete', checked: false },
    { id: 'category-create', label: 'Category Create', checked: true },
    { id: 'tag-list', label: 'Tag List', checked: true },
    { id: 'tag-edit', label: 'Tag Edit', checked: false },
    { id: 'tag-delete', label: 'Tag Delete', checked: false },
    { id: 'tag-create', label: 'Tag Create', checked: true },
    { id: 'role-list', label: 'Role List', checked: true },
    { id: 'role-edit', label: 'Role Edit', checked: false },
    { id: 'role-delete', label: 'Role Delete', checked: false },
    { id: 'role-create', label: 'Role Create', checked: true },
    { id: 'permission-list', label: 'Permission List', checked: true },
    { id: 'permission-edit', label: 'Permission Edit', checked: false },
    { id: 'permission-delete', label: 'Permission Delete', checked: false },
    { id: 'permission-create', label: 'Permission Create', checked: true },
    { id: 'report-view', label: 'Report View', checked: true },
    { id: 'report-export', label: 'Report Export', checked: false },
    { id: 'settings-view', label: 'Settings View', checked: true },
    { id: 'settings-update', label: 'Settings Update', checked: false },
    { id: 'user-activate', label: 'User Activate', checked: true },
    { id: 'user-deactivate', label: 'User Deactivate', checked: false }
  ])

  const handleChange = id => {
    setPermissions(prev => prev.map(perm => (perm.id === id ? { ...perm, checked: !perm.checked } : perm)))
  }

  const handleSearch = e => {
    setSearchTerm(e.target.value)
  }

  // Filter permission berdasarkan search term
  const filteredPermissions = permissions.filter(perm => perm.label.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <>
      <Typography variant='h3'>Role</Typography>
      <Card>
        <CardContent>
          <Grid2 container spacing={2}>
            <Grid2 size={6}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <TextField
                  label='Nama Role'
                  size='small'
                  fullWidth
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />

                {isEdit ? (
                  <Button variant='contained' color='primary' size='small' onClick={handleUpdate}>
                    Ubah
                  </Button>
                ) : (
                  <Button variant='contained' color='primary' size='small' onClick={handleAdd}>
                    Tambah
                  </Button>
                )}
              </Box>
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
                  slots={{ toolbar: CustomToolbar }}
                  slotProps={{
                    toolbar: {
                      showQuickFilter: true
                    }
                  }}
                />
              </Box>
            </Grid2>
          </Grid2>
        </CardContent>
      </Card>

      <Card sx={{ mt: 5 }}>
        <CardHeader title='Pilih Fitur'></CardHeader>
        <CardContent>
          <TextField
            label='Cari Fitur'
            size='small'
            fullWidth
            sx={{ mb: 3 }}
            value={searchTerm}
            onChange={handleSearch}
          />
          <form method='post'>
            <FormGroup sx={{ my: 2 }}>
              <Grid2 container spacing={2} id='list-permission'>
                {filteredPermissions.map(perm => (
                  <Grid2 size={3} key={perm.id}>
                    <FormControlLabel
                      control={
                        <Checkbox checked={perm.checked} onChange={() => handleChange(perm.id)} color='primary' />
                      }
                      label={perm.label}
                    />
                  </Grid2>
                ))}
              </Grid2>
            </FormGroup>
          </form>
        </CardContent>
        <CardActions className='card-actions-dense'>
          <Button variant='contained' color='primary' size='small'>
            Button
          </Button>
        </CardActions>
      </Card>
    </>
  )
}
