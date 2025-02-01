import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Button,
  Chip,
  Grid
} from '@mui/material'

export default function Page() {
  const rows = [
    {
      id: 1,
      name: 'Group Role 1'
    },
    {
      id: 2,
      name: 'Group Role 3'
    },
    {
      id: 3,
      name: 'Group Role 3'
    }
  ]

  return (
    <Grid container spacing={2}>
      {/* Column 1 */}
      <Grid item xs={12} md={6}>
        <TableContainer component={Paper}>
          <Table>
            {/* Header */}
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            {/* Body */}
            <TableBody>
              {rows.map(row => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    <Stack direction='row' spacing={1}>
                      <Button variant='contained' color='primary' size='small'>
                        Edit
                      </Button>
                      <Button variant='contained' color='error' size='small'>
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
