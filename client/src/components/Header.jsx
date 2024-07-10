import { FaSearch } from "react-icons/fa"
import { Link } from "react-router-dom"

const Header = () => {
  return (
    <header className="bg-slate-200">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">NOOR</span>
            <span className="text-slate-700">ESTATE</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center justify-between">
          <input
            type="text"
            placeholder="Search ..."
            className="focus:outline-none bg-transparent w-24 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>

        <nav>
          <ul className="flex gap-4">
            <Link to="/">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Home
              </li>
            </Link>

            <Link to="/about">
              <li className="hidden sm:inline text-slate-700 hover:underline">
                About
              </li>
            </Link>

            <Link to="/signin">
              <li className="text-slate-700 hover:underline">Sign In</li>
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header
