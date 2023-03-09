import { useNavigate } from "react-router-dom"

const Unauthorized = () => {
  const navigate = useNavigate()

  const goBack = () => navigate(-1)

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
          <h3 className="font-bold text-blue-600 text-9xl">Unauthorized</h3>

          <p className="mb-8 text-center text-gray-500 md:text-lg">
            You do not have access to the requested page.
          </p>

          <div
            onClick={goBack}
            className="cursor-pointer px-6 py-2 text-sm font-semibold text-blue-800 bg-blue-100"
          >
            Go back
          </div>
        </div>
      </div>
    </div>
  )
}

export default Unauthorized
