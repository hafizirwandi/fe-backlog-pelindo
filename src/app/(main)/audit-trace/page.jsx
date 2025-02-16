'use client'
import React, { useEffect, useState } from 'react'

import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material'
import { DataGrid, GridToolbarQuickFilter } from '@mui/x-data-grid'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid' // Import SweetAlert2

const columns = [
  {
    field: 'action',
    headerName: 'Action',
    width: 150
  },
  {
    field: 'modul',
    headerName: 'Modul',
    width: 150
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 150
  },
  {
    field: 'time',
    headerName: 'Time',
    width: 150
  },
  {
    field: 'actions',
    headerName: 'Actions',
    width: 150,
    renderCell: params => (
      <Stack direction='row' spacing={1}>
        <Button variant='contained' color='primary' size='small' onClick={() => params.row.onView(params.row)}>
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
        Audit Trace
      </Typography>

      {/* Quick Filter Section */}
      <Stack direction='row' alignItems='center' spacing={1}>
        <GridToolbarQuickFilter
          placeholder='Search...'

          // sx={{
          //   '& input': {
          //     padding: '6px 8px',
          //     fontSize: '14px',
          //     borderRadius: '4px',
          //     backgroundColor: 'white',
          //     border: '1px solid #ccc'
          //   }
          // }}
        />
      </Stack>
    </Box>
  )
}

export default function DataGridDemo() {
  const [rows, setRows] = useState([]) // State untuk menyimpan data rows
  const [loading, setLoading] = useState(true) // State untuk loading indicator
  // State untuk modal
  const [open, setOpen] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)

  useEffect(() => {
    // Fetch data dari JSON Server
    axios
      .get('http://localhost:3001/audit-trace') // Endpoint JSON Server
      .then(response => {
        setRows(
          response.data.map(row => ({
            ...row,
            onView: handleView
          }))
        )
        setLoading(false) // Matikan loading
      })
      .catch(error => {
        console.error('Error fetching data:', error)
        setLoading(false) // Matikan loading meskipun error
      })
  }, [])

  const handleView = row => {
    setSelectedRow(row)
    setOpen(true)
  }

  return (
    <>
      <Typography variant='h3'>Audit Trace</Typography>
      <Box sx={{ width: '100%', mt: 4, p: 3, boxShadow: 3, borderRadius: 1, bgcolor: 'white' }}>
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
            slots={{ toolbar: CustomToolbar }}
            slotProps={{
              toolbar: {
                showQuickFilter: true
              }
            }}
          />
        </Box>
      </Box>
      {/* Dialog untuk menampilkan detail */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='sm' fullWidth>
        <DialogTitle>Audit Trace Detail</DialogTitle>
        <DialogContent dividers>
          {selectedRow && (
            <Box>
              <Typography>
                <strong>Action:</strong> {selectedRow.action}
              </Typography>
              <Typography>
                <strong>Modul:</strong> {selectedRow.modul}
              </Typography>
              <Typography>
                <strong>Name:</strong> {selectedRow.name}
              </Typography>
              <Typography>
                <strong>Time:</strong> {selectedRow.time}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
