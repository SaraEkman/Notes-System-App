import { useEffect, useState } from 'react'
import { CreateNewNote } from './components/CreateNewNote'
import { CreateUser } from './components/CreateUser'
import { LogIn } from './components/LogIn'
import { Button } from './styles/Button'
import './GlobalStyle.css'

function App() {
  const [userId, setUserId] = useState(0)
  const [showLogIn, setShowLogIn] = useState(false)
  const [showLogOut, setShowLogOut] = useState(false)
  const [itemLogIN, setItemLogIN] = useState('Log In')
  const [itemSignIn, setItemSignIn] = useState('Sign In')

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
    if (showLogIn) {
      setItemLogIN('Log In');
    }
    else {
    setItemLogIN('Close');
    setItemSignIn('Sign In')
  }
  }
  const toggleSignInForm = () => {
    setShowLogOut(!showLogOut)
    setShowLogIn(false)
    if (showLogOut) {
      setItemSignIn('Sign In')
    } else {
      setItemSignIn('Close');
      setItemLogIN('Log In')
    }
  }

  return (
    <div className="App">
      {userId != 0 ? (
        <div>
          <CreateNewNote />
        </div>
      ) : (
        <div>
          <article className="App_btns">
            <Button onClick={toggleLogInForm}>{itemLogIN}</Button>
            <Button onClick={toggleSignInForm}>{itemSignIn}</Button>
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
    </div>
  )
}

export default App
