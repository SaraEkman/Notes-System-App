import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'
import { INote } from '../models/INote'
import { Notes } from '../services/Notes'
import { Button } from '../styles/Button'

interface IPropsEditNote {
  note: INote
  ShowEditer: () => void
}

export const EditNote = (props: IPropsEditNote) => {
  const editorRef = useRef<any>()
  const handleClick = () => {
    if (editorRef.current) {
      let date = new Date().toLocaleString()
      console.log(editorRef.current.getContent())
      let updatedNote: INote = {
        id: props.note.id,
        content: editorRef.current.getContent(),
        created_at: props.note.created_at,
        created_by: props.note.created_by,
        updated_at: date,
        updated_by: JSON.parse(localStorage.getItem('userId') || '0'),
        deleted: props.note.deleted,
      }
      console.log(updatedNote)
      let notes = new Notes()
      notes.updateNote(updatedNote)
      props.ShowEditer()
    }
  }

  return (
    <div>
      <div className='Editor'>
      <h1>Edit Note</h1>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={props.note.content}
        init={{
          height: 500,
          menubar: false,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        }}
        />
        </div>
      <div className="Style_div">
        <Button onClick={handleClick}>Spara</Button>
        </div>
    </div>
  )
}
