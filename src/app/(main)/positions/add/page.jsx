'use client'

// React Imports
import { useState } from 'react'

// Next Imports
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import InputAdornment from '@mui/material/InputAdornment'

// Components Imports
import CustomTextField from '@core/components/mui/TextField'

export default function Page() {
  // States
  const [isPasswordShown, setIsPasswordShown] = useState(false)
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false)
  const handleClickShowPassword = () => setIsPasswordShown(show => !show)
  const handleClickShowConfirmPassword = () => setIsConfirmPasswordShown(show => !show)

  return (
    <>
      <Breadcrumbs aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='/'>
          Home
        </Link>
        <Link underline='hover' color='inherit' href='/users'>
          Users
        </Link>
        <Typography sx={{ color: 'text.primary' }}>Add</Typography>
      </Breadcrumbs>

      <Grid container spacing={2}>
        <Grid size={{ xs: 6 }}>
          <Card sx={{ padding: 2 }}>
            <CardHeader title='Basic' />
            <CardContent>
              <form onSubmit={e => e.preventDefault()}>
                <Grid container spacing={6}>
                  <Grid size={{ xs: 12 }}>
                    <CustomTextField fullWidth label='Name' placeholder='Enter Text' />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <CustomTextField fullWidth label='Name' placeholder='Enter Text' />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <div className='flex items-center justify-between flex-wrap gap-5'>
                      <Button variant='contained' type='submit'>
                        Get Started!
                      </Button>
                    </div>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}
