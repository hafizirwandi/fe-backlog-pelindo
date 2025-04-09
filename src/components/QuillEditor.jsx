import React from 'react'

import dynamic from 'next/dynamic'
import './../assets/quillStyles.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function QuillEditor({ value, onChange }) {
  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ align: [] }],
      ['bold', 'italic', 'underline', 'strike'], // Text styling
      [{ color: [] }, { background: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['link', 'image', 'video'],
      [{ list: 'ordered' }, { list: 'bullet' }], // Lists
      [{ script: 'sub' }, { script: 'super' }],
      ['clean']
    ]
  }

  return <ReactQuill value={value} onChange={onChange} modules={modules} />
}
