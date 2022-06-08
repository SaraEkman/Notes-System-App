import { useEffect, useState, useRef } from 'react'
import { Editor } from '@tinymce/tinymce-react'
import { INote } from '../models/INote'
import { CreateNote } from '../models/CreateNote'
import { Notes } from '../services/Notes'
import { EditNote } from './EditNote'
import { IAllNotesWithUsers } from '../models/IAllNotesWithUsers'
// import { IUser } from '../models/IUser'

export const CreateNewNote = () => {
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

  useEffect(() => {
    let notes = new Notes()
    let userId: number = JSON.parse(localStorage.getItem('userId') || '0')
    if (userId === 21) {
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
    <div key={user.id}>
      <h1>UserEmail: {user.userEmail}</h1>
      <h2>User Id: {user.id}</h2>
      {user.notes.map((note) => {
        return (
          <div key={note.id}>
            <div dangerouslySetInnerHTML={{ __html: note.content }}></div>
            <div>CreatedAt: {note.created_at}</div>
            <div>CreatedBy: {note.created_by} </div>
            <div>UpdatedAt: {note.updated_at} </div>
            <div>UpdatedBy: {note.updated_by} </div>
            <button onClick={() => handleEdit(note)}>Edit</button>
            <button onClick={() => handleDelete(note)}>Delete</button>
          </div>
        )
      })}
    </div>
  ))

  return (
    <>
      <h2>Create new note</h2>
      <button onClick={toggleShowEditor}>Create new note</button>
      {showMessage && <p>No notes found</p>}

      {showEditor && (
        <div>
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
          <button onClick={handleClick}>Spara</button>{' '}
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
              <>
                {' '}
                <div dangerouslySetInnerHTML={{ __html: note.content }}></div>
                <div>
                  CreatedAt: {note.created_at} createdBy:{createdBy}
                </div>
                <div>UpdatedAt: {note.updated_at} </div>
                <button
                  onClick={() => {
                    handleEdit(note)
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    handleDelete(note)
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}

      {showAllNotes && [printHtml]}

      <button onClick={handleClear}>Log out</button>
    </>
  )
}
