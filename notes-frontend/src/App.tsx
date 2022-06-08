import { useEffect, useState } from 'react'
import { CreateNewNote } from './components/CreateNewNote'
import { CreateUser } from './components/CreateUser'
import { LogIn } from './components/LogIn'

function App() {
  const [userId, setUserId] = useState(0)
  const [showLogIn, setShowLogIn] = useState(false)
  const [showLogOut, setShowLogOut] = useState(false)

  useEffect(() => {
    let getLS = localStorage.getItem('userId')
    if (getLS === null) {
      setUserId(0)
    } else {
      setUserId(parseInt(getLS))
    }
  }, [])

  const toggleLogInForm = () => {
    setShowLogIn(!showLogIn)
    setShowLogOut(false)
  }
  const toggleLogOutForm = () => {
    setShowLogOut(!showLogOut)
    setShowLogIn(false)
  }

  return (
    <>
      {userId != 0 ? (
        <div>
          <CreateNewNote />
        </div>
      ) : (
        <div>
          <article>
            <button onClick={toggleLogInForm}>Log in</button>
            <button onClick={toggleLogOutForm}>Sign up</button>
          </article>
          {showLogIn && (
            <div>
              {' '}
              <LogIn />
            </div>
          )}
          {showLogOut && (
            <div>
              <CreateUser />
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default App
