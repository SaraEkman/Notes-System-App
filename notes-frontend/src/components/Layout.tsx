import { Outlet } from 'react-router-dom'

export const Layout = () => {
  return (
    <div>
      <header>
        <h1>React Notes System</h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <h3>CopyRight</h3>
      </footer>
    </div>
  )
}
