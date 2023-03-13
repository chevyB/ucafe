import { createContext, useEffect, useState } from "react"
import { auth, db } from "../api/base"
import { onAuthStateChanged } from "firebase/auth"
import { getDoc, doc } from "firebase/firestore"
import { LoadingOverlay } from "@mantine/core"
import { useLocation, useNavigate } from "react-router-dom"
import { PUBLIC_URLS, ROLES } from "../configs/config"

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [user, setUser] = useState({})
  const [homeLink, setHomeLink] = useState("/")
  const [pending, setPending] = useState(true)

  console.log({ user })

  useEffect(() => {
    onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        getDoc(doc(db, "users", authUser.uid)).then((response) => {
          setUser({ id: authUser.uid, ...response.data() })
          setPending(false)
        })
      } else {
        setUser({})
        setPending(false)
      }
    })
  }, [])

  useEffect(() => {
    if (user.email && user.role) {
      const url = location.pathname
      if (PUBLIC_URLS.includes(url)) {
        switch (user.role) {
          case ROLES.Admin:
            navigate("/admin")
            break
          case ROLES.Seller:
            navigate("/seller")
            break
          default:
            navigate("/")
            break
        }
      }

      switch (user.role) {
        case ROLES.Admin:
          setHomeLink("/admin")
          break
        case ROLES.Seller:
          setHomeLink("/seller")
          break

        default:
          setHomeLink("/")
          break
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <AuthContext.Provider value={{ user, setUser, homeLink }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
