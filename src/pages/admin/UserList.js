import React, { useEffect, useState } from "react"
import { db } from "../../api/base"
import { Button } from "@mantine/core"
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore"
import { notifications } from "@mantine/notifications"
import { getErrorMessage } from "../../utils/helper"
import { IconHomeEdit } from "@tabler/icons-react"

const UserList = () => {
  const [loading, setLoading] = useState(false)
  const batch = writeBatch(db)
  const [users, setUsers] = useState([])
  const getUsers = async () => {
    const querySnapshot = await getDocs(
      query(collection(db, "users"), where("role", "==", "user"))
    )
    setUsers(
      querySnapshot.docs.map((user) => ({
        id: user.id,
        ...user.data(),
      }))
    )
  }
  useEffect(() => {
    getUsers()
  }, [])

  const handleMakeSeller = async (user) => {
    const { id, name } = user
    try {
      setLoading(true)
      const user = doc(db, "users", id)
      const store = doc(db, "stores", id)
      batch.update(user, {
        role: "seller",
      })
      batch.set(store, {
        img: null,
        name: `${name}'s store`,
        description: null,
      })
      await batch.commit()
      notifications.show({
        message: "Success",
      })
      setLoading(false)
      getUsers()
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: getErrorMessage(error),
      })
    }
  }

  return (
    <section>
      <div className="max-w-2xl mx-auto">
        <div className="p-4 bg-white rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {!!users.length ? (
                users.map((user) => {
                  return (
                    <li key={user.id} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <img
                            className="w-8 h-8 rounded-full"
                            src="/profile.jpg"
                            alt="profile"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                        <div className="cursor-pointer inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          <Button
                            onClick={() => handleMakeSeller(user)}
                            leftIcon={<IconHomeEdit size="1rem" />}
                            variant="outline"
                            loading={loading}
                          >
                            <span className="hidden sm:block">Make &nbsp;</span>
                            Seller
                          </Button>
                        </div>
                      </div>
                    </li>
                  )
                })
              ) : (
                <div>No customers as of the moment.</div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default UserList
