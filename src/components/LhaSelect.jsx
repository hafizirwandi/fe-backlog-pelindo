import * as React from 'react'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

import { dataLha } from '@/utils/lha'

export default function LhaSelect({ value, onSelect, disabled }) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedValue, setSelectedValue] = React.useState(null)

  const fetchData = async keyword => {
    setLoading(true)

    try {
      const response = await dataLha(1, 100, keyword)

      if (response.data) {
        const uniqueOptions = response.data.filter(
          (item, index, self) => index === self.findIndex(t => t.id === item.id)
        )

        setOptions(uniqueOptions)
      }
    } catch (error) {
      console.error('Error fetching lha:', error)
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

  React.useEffect(() => {
    const loadData = async () => {
      if (!value) return
      await fetchData('')
    }

    loadData()
  }, [value])

  React.useEffect(() => {
    if (!value || options.length === 0) return // Pastikan ada value dan options tidak kosong

    const foundOption = options.find(option => option.id === value) || null

    setSelectedValue(foundOption)
  }, [value, options])

  return (
    <Autocomplete
      disabled={disabled}
      open={open}
      value={selectedValue}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => `${option.no_lha} - ${option.judul}`}
      options={options}
      loading={loading}
      onChange={(_, newValue) => {
        setSelectedValue(newValue)

        if (onSelect) {
          onSelect(newValue)
        }
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.no_lha} - {option.judul}
        </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label='Pilih LHA'
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
