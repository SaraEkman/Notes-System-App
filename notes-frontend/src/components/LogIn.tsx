import { ChangeEvent, useState } from 'react'
import { IUser } from '../models/IUser'
import { Notes } from '../services/Notes'

export function LogIn() {
  const [user, setUser] = useState<IUser>({
    id: 0,
    userEmail: '',
    userPass: '',
  })
  const [showError, setShowError] = useState(false)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  }

  const handleClick = (e: any) => {
    e.preventDefault()
    console.log(user)
    let checkUser = new Notes()
    checkUser
      .logInUser(user)
      .then((res) => {
        if (res.error === 'User not found' || res.error === 'Wrong password') {
          console.log(res.error)
          setShowError(true)
        } else {
          localStorage.setItem('userId', JSON.stringify(res.id))
          window.location.href = '/'
        }
      })
      .catch((erro) => console.log('Error', erro))
  }
  return (
    <div>
      <h1>Log in</h1>
      {showError && <p>Wrong email or password</p>}
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
        <input type="submit" value="log in" />
      </form>
    </div>
  )
}
