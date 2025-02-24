import React, { useState } from 'react'

import ReactQuill from 'react-quill-new'
import 'react-quill/dist/quill.snow.css'
import './../assets/quillStyles.css'

export default function QuillEditor({ value, onChange }) {
  //   const [value, setValue] = useState('')

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

  return <ReactQuill theme='snow' value={value} onChange={onChange} modules={modules} />
}
