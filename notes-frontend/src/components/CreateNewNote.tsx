import { useEffect, useState, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { INote } from '../models/INote'
import { CreateNote } from '../models/CreateNote'
import { Notes } from '../services/Notes'
import { EditNote } from './EditNote'
import { IAllNotesWithUsers } from '../models/IAllNotesWithUsers'
import { Div } from '../styles/Div'
import { Button } from '../styles/Button'

export const CreateNewNote = () => {
  const parse = require('html-react-parser');
  const [notes, setNotes] = useState<INote[]>([])
  const [showMessage, setShowMessage] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showAllNotes, setShowAllNotes] = useState(false)
  const [allNotesWithUsers, setAllNotesWithUsers] = useState<
    IAllNotesWithUsers[]
  >([])
  const [createdBy, setCreatedBy] = useState<any>()
  const [editNote, setEditNote] = useState<INote>({
    id: 0,
    content: '',
    created_at: '',
    created_by: 0,
    updated_at: '',
    updated_by: 0,
    deleted: 0,
  })
  const editorRef = useRef<any>()
  const [createNewNoteItem, setCreateNewNoteItem] = useState('Create new note')

  useEffect(() => {
    let notes = new Notes()
    let userId: number = JSON.parse(localStorage.getItem('userId') || '0')
    if (userId === 23) {
      notes.getNotesWithUsers().then((res) => {
        setAllNotesWithUsers(res)
        console.log(res)
        setShowAllNotes(true)
      })
    } else {
      notes.getFindNotes(userId).then((response) => {
        if (response === 'No notes found') {
          setShowMessage(true)
        } else {
          setNotes(response)
          setShowMessage(false)
        }
      })
      notes.getCreatedBy(userId).then(setCreatedBy)
    }
  }, [])

  const handleClick = () => {
    if (editorRef.current) {
      let date = new Date().toLocaleString()
      console.log(date)
      console.log(editorRef.current.getContent())
      let newNote = new CreateNote(
        editorRef.current.getContent(),
        date,
        JSON.parse(localStorage.getItem('userId') || '0'),
        JSON.parse(localStorage.getItem('userId') || '0'),
        false,
      )
      let notes = new Notes()
      notes.createNote(newNote)
      window.location.href = '/'
    }
  }

  const handleEdit = (note: INote) => {
    console.log(note)
    setEditNote(note)
    setShowEditor(false)
    setShowEdit(!showEdit)
  }

  const toggleShowEditor = () => {
    setShowEditor(!showEditor)
    setShowEdit(false)
    if (showEditor) setCreateNewNoteItem('Create new note')
    else setCreateNewNoteItem('Close editor')
  }

  const toggleEdit = () => {
    window.location.href = '/'
  }

  const handleDelete = (note: INote) => {
    let notes = new Notes()
    notes.deleteNote(note)
    window.location.href = '/'
  }

  const handleClear = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  let printHtml = allNotesWithUsers.map((user) => (
    <Div key={user.id}>
      <h2>
        UserEmail: {user.userEmail}
        <br />
        User Id: {user.id}
      </h2>
      {user.notes.map((note) => {
        return (
          <div key={note.id}>
            <div>{parse( note.content )}</div>
            <h3>CreatedAt: {note.created_at}</h3>
            <h4>CreatedBy: {note.created_by} </h4>
            <h5>UpdatedAt: {note.updated_at} </h5>
            <h5>UpdatedBy: {note.updated_by} </h5>
            <h5>Deleted: {note.deleted}</h5>
            <Button onClick={() => handleEdit(note)}>Edit</Button>
            <Button className="secondary" onClick={() => handleDelete(note)}>
              Delete
            </Button>
          </div>
        )
      })}
    </Div>
  ))

  return (
    <>
      <div className="Style_div">
        <h2>Create new note</h2>
        <Button onClick={toggleShowEditor}>{createNewNoteItem}</Button>
        {showMessage && <p className="para">No notes found</p>}
      </div>

      {showEditor && (
        <div className='Editor'>
          <Editor
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue="<p>Skriv här :)</p>"
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
          <div className="Style_div">
            <Button onClick={handleClick}>Spara</Button>{' '}
          </div>
        </div>
      )}

      {showEdit && <EditNote note={editNote} ShowEditer={toggleEdit} />}

      {notes.length > 0 &&
        showAllNotes === false &&
        notes.map((note) => (
          <div key={note.id}>
            {note.deleted === 1 ? (
              <div></div>
            ) : (
              <Div>
                {' '}
                <div>{parse( note.content )}</div>
                <h3>createdBy:{createdBy}</h3>
                <h4>CreatedAt: {note.created_at}</h4>
                <h4>UpdatedAt: {note.updated_at} </h4>
                <Button
                  onClick={() => {
                    handleEdit(note)
                  }}
                >
                  Edit
                </Button>
                <Button
                  className="secondary"
                  onClick={() => {
                    handleDelete(note)
                  }}
                >
                  Delete
                </Button>
              </Div>
            )}
          </div>
        ))}

      {showAllNotes && [printHtml]}

      <div className="Style_div">
        <Button className="secondary" onClick={handleClear}>
          Log out
        </Button>
      </div>
    </>
  )
}
