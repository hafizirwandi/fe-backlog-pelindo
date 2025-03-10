import * as React from 'react'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

import { dataUnit } from '@/utils/unit'

export default function UnitSelect({ value, onSelect }) {
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
        const uniqueOptions = response.data.filter(
          (item, index, self) => index === self.findIndex(t => t.id === item.id)
        )

        setOptions(uniqueOptions)
      } else {
        setOptions([])
      }
    } catch (error) {
      console.error('Error fetching unit:', error)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (options.length === 0) {
        fetchData(inputValue)
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [inputValue, options])

  // React.useEffect(() => {
  //   setSelectedValue(null)

  //   const loadData = async () => {
  //     if (!value) return
  //     await fetchData('')
  //   }

  //   loadData()
  // }, [value])

  React.useEffect(() => {
    if (!value || options.length === 0) return

    const foundOption = options.find(option => option.id === value) || null

    setSelectedValue(foundOption)
  }, [value, options])

  return (
    <Autocomplete
      open={open}
      value={selectedValue}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
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
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.nama}
        </li>
      )}
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
