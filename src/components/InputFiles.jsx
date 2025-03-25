// React Imports
import { useState } from 'react'

// MUI Imports
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useDropzone } from 'react-dropzone'

const FileUploader = ({ onFileSelect }) => {
  // States
  const [files, setFiles] = useState([])

  // Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    accept: {
      // 'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf']
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })))

      const file = acceptedFiles[0]

      onFileSelect(file)
    }
  })

  const filePreview = files.map(file => {
    if (file.type.startsWith('image/')) {
      return (
        <img
          key={file.name}
          alt={file.name}
          className='single-file-image'
          src={file.preview}
          style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px' }}
        />
      )
    } else if (file.type === 'application/pdf') {
      return (
        <div key={file.name} style={{ marginTop: '10px', textAlign: 'center' }}>
          <Avatar variant='rounded' sx={{ bgcolor: 'red', width: 50, height: 50 }}>
            📄
          </Avatar>
          <Typography variant='body2'>{file.name}</Typography>
        </div>
      )
    } else {
      return null
    }
  })

  return (
    <Box
      {...getRootProps({ className: 'dropzone' })}
      {...(files.length && { sx: { height: 450 } })}
      sx={{
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '16px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border-color 0.3s',
        '&:hover': { borderColor: '#1976d2' }
      }}
    >
      <input {...getInputProps()} />
      {files.length ? (
        filePreview
      ) : (
        <div className='flex items-center flex-col'>
          <Avatar variant='rounded' className='bs-12 is-12 mbe-9'>
            <i className='tabler-upload' />
          </Avatar>
          <Typography variant='h4' className='mbe-2.5'>
            Drop files here or click to upload.
          </Typography>
          <Typography>Drop files here or click browse through your machine</Typography>
        </div>
      )}
    </Box>
  )
}

export default FileUploader
