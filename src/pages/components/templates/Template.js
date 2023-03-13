import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { auth } from "../../../api/base"
import { ROLES } from "../../../configs/config"
import useAuth from "../../../hooks/useAuth"

const Template = ({ children }) => {
  const { setUser, user, homeLink } = useAuth()
  const navigate = useNavigate()
  const [showSideBar, setShowSideBar] = useState(false)

  const logout = async () => {
    auth.signOut()
    setUser({})
    navigate("/login")
  }

  return (
    <section>
      <nav className="p-3 border-gray-200 rounded bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
        <div className="container flex flex-wrap items-center justify-between mx-auto">
          <Link to={homeLink}>
            <img className="h-6" src="/logo.png" alt="logo" />
          </Link>
          <button
            onClick={() => setShowSideBar(!showSideBar)}
            data-collapse-toggle="navbar-solid-bg"
            type="button"
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-solid-bg"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-6 h-6"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          <div
            className={`${
              showSideBar ? "absolute top-16 left-0 z-20 bg-gray-200 p-4" : "hidden"
            }  w-full md:block md:w-auto `}
          >
            <ul className="flex flex-col rounded-lg  md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 bg-white md:bg-transparent">
              {user.email && (
                <li>
                  <Link
                    to={homeLink}
                    className="cursor-pointer block py-2 pl-3 pr-4 text-gray-700 md:p-0 hover:text-sky-500"
                  >
                    Home
                  </Link>
                </li>
              )}
              {user.role === ROLES.user && (
                <li>
                  <Link
                    to="/orders"
                    className="cursor-pointer block py-2 pl-3 pr-4 text-gray-700 md:p-0 hover:text-sky-500"
                  >
                    Orders
                  </Link>
                </li>
              )}
              {user.role === ROLES.Seller && (
                <li>
                  <Link
                    to="/seller/orders"
                    className="cursor-pointer block py-2 pl-3 pr-4 text-gray-700 md:p-0 hover:text-sky-500"
                  >
                    Orders
                  </Link>
                </li>
              )}
              {user.role === ROLES.Seller && (
                <li>
                  <Link
                    to="/seller/product/add"
                    className="cursor-pointer block py-2 pl-3 pr-4 text-gray-700 md:p-0 hover:text-sky-500"
                  >
                    Add Product
                  </Link>
                </li>
              )}
              <li onClick={logout}>
                <div
                  type="button"
                  className="cursor-pointer block py-2 pl-3 pr-4 text-gray-700 md:p-0 hover:text-sky-500"
                >
                  Logout
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <section>{children}</section>
    </section>
  )
}

export default Template
