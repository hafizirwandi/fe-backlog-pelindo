import * as React from 'react'

import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'

import { dataDepartemenByDivisi } from '@/utils/departemen'

export default function DepartemenSelect({ value, divisiId, onSelect }) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState([])
  const [loading, setLoading] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')
  const [selectedValue, setSelectedValue] = React.useState(null)

  const fetchData = async divisiId => {
    setLoading(true)

    try {
      const response = await dataDepartemenByDivisi(1, 100, '', divisiId)

      if (response.data) {
        const uniqueOptions = response.data.filter(
          (item, index, self) => index === self.findIndex(t => t.id === item.id)
        )

        setOptions(uniqueOptions)
      }
    } catch (error) {
      console.error('Error fetching departemen:', error)
    }

    setLoading(false)
  }

  React.useEffect(() => {
    if (divisiId) {
      fetchData(divisiId)
    } else {
      setOptions([])
      setSelectedValue(null)
    }
  }, [divisiId])

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
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {option.nama}
        </li>
      )}
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
