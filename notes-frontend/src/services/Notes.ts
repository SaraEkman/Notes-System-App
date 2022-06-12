import { CreateNote } from '../models/CreateNote'
import axios from 'axios'
import { IUser } from '../models/IUser'
import { INote } from '../models/INote'

export class Notes {
  async logInUser(user: IUser) {
    let result = await axios.post('http://localhost:3000/logIn', user, {
      headers: {
        'content-type': 'application/json',
      },
    })
    return result.data
  }

  async getCreatedBy(userId: number): Promise<{}> {
    const response = await axios.get(
      `http://localhost:3000/getCreatedBy/${userId}`,
    )
    return response.data
  }

  async createUser(user: IUser): Promise<any> {
    let response = await axios.post<IUser>(
      'http://localhost:3000/createUser',
      user,
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
    return response.data
  }

  async getNotesWithUsers() {
    let response = await axios.get('http://localhost:3000/getNotesWithUsers')
    return response.data
  }

  async getFindNotes(id: number) {
    const response = await axios.get(`http://localhost:3000/findNotes/${id}`)
    return response.data
  }

  createNote(note: CreateNote) {
    axios
      .post<INote>('http://localhost:3000/createNote', note, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((data) => console.log(data))
      .catch((erro) => console.log('Error', erro))
  }

  updateNote(note: INote) {
    axios
      .put<INote>('http://localhost:3000/updateNote', note, {
        headers: {
          'content-type': 'application/json',
        },
      })
      .then((data) => console.log(data))
      .catch((erro) => console.log('Error', erro))
  }

  async deleteNote(note: INote) {
    let response = await axios.put(
      `http://localhost:3000/deleteNote`,
      { deleted: !note.deleted, id: note.id },
      {
        headers: {
          'content-type': 'application/json',
        },
      },
    )
    return response.data
  }
}
