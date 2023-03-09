import { createContext, useEffect, useState } from "react"
import { auth, db } from "../api/base"
import { onAuthStateChanged } from "firebase/auth"
import { getDoc, doc } from "firebase/firestore"
import { LoadingOverlay } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import { PUBLIC_URLS } from "../configs/config"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [pending, setPending] = useState(true)

  console.log({ user })

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        getDoc(doc(db, "users", authUser.uid)).then((response) => {
          setUser(response.data())
          setPending(false)
        })
      } else {
        setUser({})
        setPending(false)
      }
    })
  }, [])

  useEffect(() => {
    if (user) {
      const url = location.pathname
      PUBLIC_URLS.includes(url) && navigate("/")
    }
  }, [user])

  if (pending) {
    return (
      <LoadingOverlay
        loaderProps={{ size: "sm", color: "pink", variant: "bars" }}
        overlayOpacity={0.3}
        overlayColor="#c5c5c5"
        visible
      />
    )
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
  )
}

export default AuthContext
