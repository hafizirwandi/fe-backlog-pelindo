import { Card, CardContent, Typography, Breadcrumbs, Link } from '@mui/material'

export default function Page() {
  return (
    <>
      {/* <Breadcrumbs aria-label='breadcrumb'>
        <Link underline='hover' color='inherit' href='/'>
          Home
        </Link>
        <Link underline='hover' color='inherit' href='/material-ui/getting-started/installation/'>
          Core
        </Link>
        <Typography sx={{ color: 'text.primary' }}>Breadcrumbs</Typography>
      </Breadcrumbs> */}

      <Typography variant='h4' gutterBottom>
        Dashboard
      </Typography>
      <Card>
        <CardContent></CardContent>
      </Card>
    </>
  )
}
