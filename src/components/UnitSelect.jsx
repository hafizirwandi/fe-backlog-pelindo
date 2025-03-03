import * as React from 'react'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

import { dataUnit } from '@/utils/unit'

export default function UnitSelect({ onSelect }) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedValue, setSelectedValue] = React.useState(null)

  const fetchData = async keyword => {
    setLoading(true)

    try {
      const response = await dataUnit(1, 100, keyword)

      if (response.data) {
        setOptions(response.data)
      }
    } catch (error) {
      console.error('Error fetching unit:', error)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (open && inputValue) {
        fetchData(inputValue)
      }
    }, 500) // Debounce 500ms

    return () => clearTimeout(timeoutId)
  }, [open, inputValue])

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      isOptionEqualToValue={(option, value) => option.nama === value.nama}
      getOptionLabel={option => `${option.nama}`}
      options={options}
      loading={loading}
      onChange={(_, newValue) => {
        setSelectedValue(newValue)

        if (onSelect) {
          onSelect(newValue)
        }
      }}
      renderInput={params => (
        <TextField
          {...params}
          label='Pilih Unit'
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
