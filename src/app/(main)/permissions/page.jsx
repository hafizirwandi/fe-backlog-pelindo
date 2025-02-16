import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from '@mui/material'

export default function Page() {
  return (
    <>
      <Typography variant='h3'>Permission For Role : Role 1 </Typography>
      <Box sx={{ mt: 4, p: 3, boxShadow: 3, borderRadius: 1, bgcolor: 'white' }}>
        <FormGroup>
          <FormControlLabel control={<Checkbox defaultChecked />} label='Can Do Modul 1' />
          <FormControlLabel control={<Checkbox />} label='Can Do Modul 2' />
          <FormControlLabel control={<Checkbox />} label='Can Do Modul 3' />
          <FormControlLabel control={<Checkbox />} label='Can Do Modul 4' />
          <FormControlLabel control={<Checkbox />} label='Can Do Modul 5' />
        </FormGroup>
      </Box>
    </>
  )
}
