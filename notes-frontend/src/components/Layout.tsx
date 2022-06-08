import { Link, Outlet } from "react-router-dom"
import App from "../App"

export const Layout = () => {
    return (<div>
      <header>
        <h1>
          <Link to="/">React Notes System</Link>
        </h1>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <h3>CopyRight</h3>
      </footer>
    </div>)
}