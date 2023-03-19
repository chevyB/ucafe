import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { IconUser } from "@tabler/icons-react"
import { Button, Center, Group, Loader, Space, Text } from "@mantine/core"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { useDocumentOnce } from "react-firebase-hooks/firestore"

import { db } from "../../api/base"
import Template from "../components/templates/Template"
import ProductItem from "../components/organisms/ProductItem"
import {
  ORDER_STATUS,
  ORDER_STATUS_ARRAY,
  ORDER_STATUS_NUM,
  ORDER_STATUS_SELLER,
} from "../../configs/config"
import { getErrorMessage, orderStatusIcon } from "../../utils/helper"
import { notifications } from "@mantine/notifications"

const SellerOrderDetail = () => {
  const { orderId } = useParams()
  const [buyer, setBuyer] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [order, orderLoading, error, reload] = useDocumentOnce(
    doc(db, "orders", orderId)
  )

  const getBuyer = async (id) => {
    const userInfo = await getDoc(doc(db, "users", id))
    setBuyer(userInfo.data())
  }

  useEffect(() => {
    if (order?.data()?.buyer_id) {
      getBuyer(order.data().buyer_id)
    }
  }, [order])

  const handleChangeStatus = async (id, status) => {
    const newStatus = ORDER_STATUS_ARRAY[ORDER_STATUS_NUM[status]]
    try {
      await setDoc(doc(db, "orders", id), { status: newStatus }, { merge: true })
      notifications.show({
        title: "Success",
        message: "Status updated.",
      })
      reload()
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: getErrorMessage(error),
      })
    }
  }

  return (
    <Template>
      <div className="p-4">
        {orderLoading ? (
          <Center>
            <Loader variant="dots" className="justify-self-center py-8" />
          </Center>
        ) : (
          <>
            <Group noWrap>
              <div className="border border-gray-300 bg-gray-100 rounded-full p-1">
                <IconUser color="gray" />
              </div>
              <div className="w-full">
                <Text>{buyer?.name}</Text>
                <Text size="sm" color="dimmed" weight={400}>
                  {buyer?.email}
                </Text>
              </div>

              <Group position="right">
                <div className="flex justify-top">
                  <span className="pt-1 text-gray-600">₱</span>{" "}
                  <span className="text-4xl bold pl-1">{order?.data().total}</span>
                </div>
              </Group>
            </Group>
            <Text
              size="lg"
              fw={500}
              className="text-gray-500 py-4 animate-pulse flex justify-center items-center"
            >
              {orderStatusIcon(order.data().status)}
              <Space w={6} /> Order is {order?.data().status}
            </Text>
            <div className="md:w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 gap-2">
              {order?.data().products.map((product) => (
                <ProductItem {...product} is_available />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="fixed z-10 bottom-0 px-8 py-4 border-gray-200 rounded bg-gray-100 w-full rounded-lg flex  justify-between">
        <Button
          disabled={order?.data().status === ORDER_STATUS.Completed}
          fullWidth
          loading={false}
          onClick={() => handleChangeStatus(order.id, order.data().status)}
          leftIcon={orderStatusIcon(order?.data().status)}
          className="bg-gradient-to-r from-cyan-500 to-blue-500"
          radius="xl"
        >
          {ORDER_STATUS_SELLER[order?.data().status]}
        </Button>
      </div>
    </Template>
  )
}

export default SellerOrderDetail
