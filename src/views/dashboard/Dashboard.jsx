'use client'

import React, { useEffect, useState } from 'react'

import {
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  LinearProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardActions,
  CardContent,
  Button
} from '@mui/material'
import {
  Checklist,
  AssignmentTurnedIn,
  BugReport,
  ReportProblem,
  Info,
  Print,
  SignalCellularNullOutlined
} from '@mui/icons-material'

import { DataGrid } from '@mui/x-data-grid'
import Swal from 'sweetalert2'

import { dashboardSummary, logStage } from '@/utils/statistik'
import LhaSelect from '@/components/LhaSelect'
import { detailsLha } from '@/utils/lha'
import { generateMonitoringPdf } from '@/utils/temuan'

const activityLogs = [
  { message: 'Menambahkan temuan baru', user: 'Budi', timestamp: '2025-04-08 10:32' },
  { message: 'Memperbarui status temuan #124', user: 'Siti', timestamp: '2025-04-08 09:21' },
  { message: 'Menghapus rekomendasi yang duplikat', user: 'Joko', timestamp: '2025-04-07 17:45' }
]

export default function AuditDashboard() {
  const [stats, setStats] = useState([])
  const [progress, setProgress] = useState(0)
  const [activity, setActivity] = useState([])
  const [summaryLHA, setSummaryLHA] = useState([])
  const [loading, setLoading] = useState(false)
  const [lhaId, setLhaId] = useState(null)

  const fetchData = async lha_id => {
    let data = []

    if (lha_id) {
      data = await dashboardSummary(lha_id)
    } else {
      data = await dashboardSummary()
    }

    if (data.status) {
      const dataStats = data.data

      setStats([
        { icon: <Checklist />, label: 'Total LHA', value: dataStats.total_lha, color: '#42a5f5' },
        { icon: <AssignmentTurnedIn />, label: 'Temuan Selesai', value: dataStats.temuan_selesai, color: '#66bb6a' },
        { icon: <BugReport />, label: 'Temuan Aktif', value: dataStats.temuan_aktif, color: '#ef5350' },
        {
          icon: <ReportProblem />,
          label: 'Menunggu Auditor',
          value: dataStats.temuan_selesai_internal,
          color: '#ffa726'
        }
      ])
      let progressVal = 0

      if (dataStats.total_temuan !== 0) {
        progressVal = (dataStats.temuan_selesai / dataStats.total_temuan) * 100
      }

      setProgress(progressVal)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchDataActivity = async lha_id => {
    let data = []

    if (lha_id) {
      data = await logStage(lha_id)
    } else {
      data = await logStage()
    }

    if (data.status) {
      const dataActivity = data.data

      setActivity(dataActivity)
    }
  }

  useEffect(() => {
    fetchDataActivity()
  }, [])

  const columns = [
    { field: 'nama_divisi', headerName: 'BIDANG', flex: 1 },
    { field: 'jumlah_temuan', headerName: 'JUMLAH TEMUAN', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'jumlah_rekomendasi', headerName: 'JUMLAH REKOMENDASI', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'sesuai', headerName: 'SESUAI', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'bs', headerName: 'BELUM SESUAI (BS)', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'bd', headerName: 'BELUM DITINDAKLANJUTI (BD)', flex: 1, align: 'center', headerAlign: 'center' },
    { field: 'tptd', headerName: 'TPTD', flex: 1, align: 'center', headerAlign: 'center' }
  ]

  const fetchSummaryLHA = async lha_id => {
    if (lha_id === null) {
      setSummaryLHA([])

      return
    }

    let data = await detailsLha(lha_id)

    if (data.status) {
      const result = []

      Object.values(data.data.temuan).forEach((temuanDivisi, index) => {
        let jumlahTemuan = temuanDivisi.data.length
        let jumlahRekomendasi = 0
        let sesuai = 0
        let bs = 0
        let bd = 0
        let tptd = 0

        temuanDivisi.data.forEach(temuan => {
          temuan.rekomendasi.forEach(rekom => {
            jumlahRekomendasi++

            switch (parseInt(rekom.status)) {
              case 2:
                sesuai++
                break
              case 1:
                bs++
                break
              case 0:
                bd++
                break
              case 3:
                tptd++
                break
            }
          })
        })

        result.push({
          id: index + 1,
          nama_divisi: temuanDivisi.nama_divisi.toUpperCase(),
          jumlah_temuan: jumlahTemuan,
          jumlah_rekomendasi: jumlahRekomendasi,
          sesuai,
          bs,
          bd,
          tptd
        })
      })

      setSummaryLHA(result)
    }
  }

  const [selectedLHA, setSelectedLHA] = useState('')

  const handleLha = value => {
    let id = value ? value.id : null

    setLhaId(id)

    setSelectedLHA(id)

    fetchData(id)
    fetchDataActivity(id)
    fetchSummaryLHA(id)
  }

  const handleCetakMonitoring = async () => {
    setLoading(true)

    try {
      const blob = await generateMonitoringPdf(lhaId)

      const pdfUrl = window.URL.createObjectURL(blob)

      window.open(pdfUrl, '_blank')
    } catch (error) {
      Swal.fire({
        title: 'Gagal!',
        text: error || 'Terjadi kesalahan',
        icon: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box p={4}>
      <Typography variant='h4' gutterBottom fontWeight='bold'>
        Dashboard
      </Typography>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <LhaSelect value={selectedLHA} onSelect={handleLha} />
      </FormControl>

      <Grid container spacing={3} mb={4}>
        {stats?.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={6}
              sx={{
                p: 3,
                borderRadius: 4,
                background: stat.color,
                color: 'white',
                boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-6px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }
              }}
            >
              <Avatar sx={{ bgcolor: 'white', color: stat.color, width: 60, height: 60 }}>{stat.icon}</Avatar>
              <Box>
                <Typography variant='h5' fontWeight='bold' color='white'>
                  {stat.value}
                </Typography>
                <Typography variant='subtitle1' sx={{ opacity: 0.9 }}>
                  {stat.label}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardActions>
              <Grid container alignItems='center'>
                <Grid item xs={6}>
                  <Typography variant='h5'>Monitoring LHA</Typography>
                </Grid>
                <Grid item xs={6} display='flex' justifyContent='flex-end'>
                  {summaryLHA.length !== 0 && (
                    <Button variant='contained' color='info' endIcon={<Print />} onClick={handleCetakMonitoring}>
                      Cetak Monitoring
                    </Button>
                  )}
                </Grid>
              </Grid>
            </CardActions>
            <CardContent>
              <DataGrid
                rows={summaryLHA}
                columns={columns}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                sx={{
                  '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#87CEEB',
                    fontWeight: 'bold'
                  },
                  '& .MuiDataGrid-cell': {
                    textAlign: 'center'
                  }
                }}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4, backgroundColor: '#f0f4ff' }}>
            <Typography variant='h6' gutterBottom fontWeight='medium'>
              Progress Temuan
            </Typography>
            <Typography variant='body2' gutterBottom>
              {Math.round(progress)}% temuan telah diselesaikan dari total
            </Typography>
            <LinearProgress
              variant='determinate'
              value={progress}
              sx={{
                height: 12,
                borderRadius: 6,
                backgroundColor: '#dbeafe',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: '#3b82f6'
                }
              }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 4 }}>
            <Typography variant='h6' gutterBottom fontWeight='medium'>
              Aktivitas Terkini
            </Typography>
            <Divider sx={{ my: 1 }} />
            <List>
              {activity.map((log, idx) => (
                <React.Fragment key={idx}>
                  <ListItem
                    alignItems='flex-start'
                    sx={{
                      transition: 'all 0.2s',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        transform: 'scale(1.01)',
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#42a5f5' }}>
                        <Info />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Typography fontWeight='bold' variant='subtitle1'>
                          {log.temuan.judul + ' : ' + log.action_name}
                        </Typography>
                      }
                      secondary={
                        <Typography variant='body2' color='text.secondary'>
                          Oleh <strong>{log.user}</strong> pada {log.created_at}
                        </Typography>
                      }
                    />
                  </ListItem>
                  {idx < activity.length - 1 && <Divider variant='inset' component='li' />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
