import { useEffect } from "react"
import { LoadingOverlay } from "@mantine/core"

import { auth } from "../../api/base"
import useAuth from "../../hooks/useAuth"

const Logout = () => {
  const { setUser } = useAuth()

  const logout = async () => {
    await auth.signOut()
    setUser({})
    window.location = "/"
  }

  useEffect(() => {
    logout()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <LoadingOverlay
      loaderProps={{ size: "sm", color: "pink", variant: "bars" }}
      overlayOpacity={0.3}
      overlayColor="#c5c5c5"
      visible
    />
  )
}

export default Logout
