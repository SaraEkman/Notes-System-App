import { ChangeEvent, useState } from 'react'
import { IUser } from '../models/IUser'
import { Notes } from '../services/Notes'

export function CreateUser() {
  const [user, setUser] = useState<IUser>({
    id: 0,
    userEmail: '',
    userPass: '',
  })
  const [showError, setShowError] = useState(false)
  const [showMess, setShowMess] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleClick = (e: any) => {
    e.preventDefault()
    console.log(user)
    let checkUser = new Notes()
    checkUser.createUser(user).then((res) => {
      console.log(res)
      if (res.status === 'success') {
        setShowError(false)
        setShowMess(true)
      } else if (res.status === 'error') {
        setShowError(true)
        setShowMess(false)
      }
    })
  }
  return (
    <div>
      <h1>Sign in</h1>
      {showError && <p>User already exists instead log in please</p>}
      {showMess && <p>User created please log in</p>}
      <form onSubmit={handleClick}>
        <label>
          Email:
          <input type="text" name="userEmail" onChange={handleChange} />
        </label>
        <label>
          Password:
          <input
            type="text"
            name="userPass"
            onChange={handleChange}
            autoComplete="on"
          />
        </label>
        <input type="submit" value="Register" />
      </form>
    </div>
  )
}
