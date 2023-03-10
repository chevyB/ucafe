import {  LoadingOverlay } from "@mantine/core"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../../api/base"
import useAuth from "../../hooks/useAuth"

const Logout = () => {
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const logout = async () => {
    auth.signOut()
    setUser({})
    navigate("/login")
  }

  useEffect(() => logout, [])

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
