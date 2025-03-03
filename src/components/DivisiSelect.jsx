import * as React from 'react'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

import { dataDivisiByUnit } from '@/utils/divisi'

export default function DivisiSelect({ value, unitId, onSelect }) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedValue, setSelectedValue] = React.useState(null)

  const fetchData = async (keyword, unitId) => {
    setLoading(true)

    try {
      const response = await dataDivisiByUnit(1, 100, keyword, unitId)

      if (response.data) {
        const uniqueOptions = response.data.filter(
          (item, index, self) => index === self.findIndex(t => t.id === item.id)
        )

        setOptions(uniqueOptions)
      }
    } catch (error) {
      console.error('Error fetching divisi:', error)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    if (open && unitId) {
      fetchData(inputValue, unitId)
    } else if (unitId) {
      fetchData(inputValue, unitId)
    } else {
      setOptions([])
      setSelectedValue(null)
    }
  }, [open, inputValue, unitId])

  React.useEffect(() => {
    if (!value && !unitId) {
      setSelectedValue(null)

      return
    }

    const loadData = async () => {
      await fetchData('', unitId)
    }

    loadData()
  }, [value, unitId])

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
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.nama}
        </li>
      )}
      renderInput={params => (
        <TextField
          {...params}
          label='Pilih Divisi'
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
