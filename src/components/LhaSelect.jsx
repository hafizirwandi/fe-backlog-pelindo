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

        console.log('set options')

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
      console.log('fetch data')
    }

    loadData()
  }, [value])

  React.useEffect(() => {
    if (!value || options.length === 0) return

    const foundOption = options.find(option => option.id == value) || null

    console.log('set selected value', value, foundOption)

    setSelectedValue(foundOption)
  }, [value, options])

  return (
    <Autocomplete
      disabled={disabled}
      open={open}
      value={selectedValue}
      onOpen={async () => {
        setOpen(true)

        if (options.length === 0) {
          await fetchData('') // Memanggil fetchData saat dropdown dibuka
        }
      }}
      onClose={() => setOpen(false)}
      onInputChange={(_, newInputValue) => setInputValue(newInputValue)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={option => `${option.judul}`}
      options={options}
      loading={loading}
      onChange={async (_, newValue) => {
        setSelectedValue(newValue)

        if (newValue === null) {
          // Jika tombol "X" ditekan, fetch ulang data
          await fetchData('')
        }

        if (onSelect) {
          onSelect(newValue)
        }
      }}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.judul}
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
