import React from "react"
import { Center, Loader } from "@mantine/core"
import { collection, query, where } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"

import { db } from "../../api/base"
import useAuth from "../../hooks/useAuth"
import Orders from "../components/organisms/Orders"
import Template from "../components/templates/Template"

const SellerOrders = () => {
  const { user } = useAuth()

  const [orders, ordersLoading] = useCollection(
    query(collection(db, "orders"), where("store_id", "==", user.id))
  )
  return (
    <Template>
      <div className="p-4">
        {ordersLoading ? (
          <Center>
            <Loader variant="dots" className="justify-self-center py-8" />
          </Center>
        ) : orders.docs.length ? (
          <Orders orders={orders} is_store />
        ) : (
          <Center className="p-4 bg-white w-full rounded-lg border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            No orders yet.
          </Center>
        )}
      </div>
    </Template>
  )
}

export default SellerOrders
