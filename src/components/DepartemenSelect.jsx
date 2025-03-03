import * as React from 'react'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

import { dataDepartemenByDivisi } from '@/utils/departemen'

export default function DepartemenSelect({ divisiId, onSelect }) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  const fetchData = async (keyword, divisiId) => {
    setLoading(true)

    try {
      const response = await dataDepartemenByDivisi(1, 100, keyword, divisiId)

      if (response.data) {
        setOptions(response.data)
      }
    } catch (error) {
      console.error('Error fetching departemen:', error)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    if (open) {
      if (divisiId) {
        fetchData(inputValue, divisiId)
      }
    } else {
      setOptions([])
    }
  }, [open, inputValue, divisiId])

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => option.nama}
      onChange={(_, newValue) => {
        setSelectedValue(newValue)

        if (onSelect) {
          onSelect(newValue)
        }
      }}
      options={options}
      loading={loading}
      renderInput={params => (
        <TextField
          {...params}
          label='Pilih Departemen'
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color='inherit' size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}
