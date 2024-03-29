import { Link } from "react-router-dom"
import useAuth from "../../hooks/useAuth"

const Unauthorized = () => {
  const { homeLink } = useAuth()

  return (
    <div
      className="
        flex
        items-center
        justify-center
        h-screen
      "
    >
      <div className="py-20 bg-white rounded-md ">
        <div className="flex flex-col items-center">
          <h6 className="font-bold text-blue-600 text-xl">Unauthorized</h6>

          <p className="mb-8 text-center text-gray-500 md:text-lg">
            You do not have access to the requested page.
          </p>

          <Link to={homeLink}>
            <div className="cursor-pointer px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100">
              Go back
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
