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
  MenuItem
} from '@mui/material'
import { Checklist, AssignmentTurnedIn, BugReport, ReportProblem, Info } from '@mui/icons-material'

import { dashboardSummary, logStage } from '@/utils/statistik'
import LhaSelect from '@/components/LhaSelect'

const activityLogs = [
  { message: 'Menambahkan temuan baru', user: 'Budi', timestamp: '2025-04-08 10:32' },
  { message: 'Memperbarui status temuan #124', user: 'Siti', timestamp: '2025-04-08 09:21' },
  { message: 'Menghapus rekomendasi yang duplikat', user: 'Joko', timestamp: '2025-04-07 17:45' }
]

export default function AuditDashboard() {
  const [stats, setStats] = useState([])
  const [progress, setProgress] = useState(0)
  const [activity, setActivity] = useState([])

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

  const [selectedLHA, setSelectedLHA] = useState('')

  const handleLha = value => {
    let id = value ? value.id : null

    setSelectedLHA(id)

    fetchData(id)
    fetchDataActivity(id)
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
