import React, { useEffect, useState } from "react"
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore"

import { db } from "../../api/base"
import useAuth from "../../hooks/useAuth"
import Template from "../components/templates/Template"
import { Box, Button, Card, Image, NumberInput, Text } from "@mantine/core"
import { IconPaperBag } from "@tabler/icons-react"

const Cart = () => {
  const { user } = useAuth()
  const [carts, setCarts] = useState(null)
  const [total, setTotal] = useState(0)

  const handlePiecesChange = async (id, pieces, operation, productName) => {
    const finalCount = pieces + operation
    if (finalCount) {
      await updateDoc(doc(db, "carts", id), {
        pieces: finalCount,
      })
      getCart()
    } else {
      const asnwer = window.confirm(`Remove item in cart? \n${productName}`)
      if (asnwer) {
        await deleteDoc(doc(db, "carts", id))
        getCart()
      }
    }
  }

  const getCart = async () => {
    const userCart = await getDocs(
      query(collection(db, "carts"), where("user_id", "==", user.id))
    )
    setCarts(null)
    setTotal(0)
    userCart?.forEach(async (cart) => {
      const { store_id, product_id } = cart.data()
      const product = await getDoc(
        doc(db, "stores", store_id, "products", product_id)
      )
      setCarts((prev) =>
        prev
          ? [...prev, { ...product.data(), ...cart.data(), id: cart.id }]
          : [{ ...product.data(), ...cart.data(), id: cart.id }]
      )

      setTotal((prev) => cart.data().pieces * product.data().price + prev)
    })
  }

  useEffect(() => {
    getCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Template>
      <div className="md:w-3/4 mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-2 pb-20">
        {carts?.map((cart) => {
          return (
            <Card
              key={cart.id}
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              className="flex p-0 m-0 !mt-0"
            >
              <Card.Section className="!m-0 flex pl-1 items-center">
                <Image
                  src={cart.img ?? "/productplaceholder.png"}
                  height={100}
                  width={100}
                  alt="Norway"
                />
              </Card.Section>

              <Box className={`flex flex-col p-1 w-full justify-between`}>
                <Text className="line-clamp-2" fz="sm">
                  {cart.name}
                </Text>
                <div className="flex justify-between items-center">
                  <Text fw={500}>
                    ₱ {(cart.price * cart.pieces).toLocaleString()}
                  </Text>
                  <div className="flex rounded-lg w-[95px]">
                    <button
                      onClick={() =>
                        handlePiecesChange(cart.id, cart.pieces, -1, cart.name)
                      }
                      className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-l cursor-pointer px-2"
                    >
                      <span className="m-auto text-2xl font-thin">−</span>
                    </button>
                    <NumberInput
                      min="0"
                      defaultValue={cart.pieces}
                      size="xs"
                      variant="filled"
                      hideControls
                    />
                    <button
                      onClick={() =>
                        handlePiecesChange(cart.id, cart.pieces, +1, cart.name)
                      }
                      className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-10 rounded-r cursor-pointer px-2"
                    >
                      <span className="m-auto text-2xl font-thin">+</span>
                    </button>
                  </div>
                </div>
              </Box>
            </Card>
          )
        })}
      </div>
      <div className="fixed z-10 bottom-0 px-8 py-4 border-gray-200 rounded bg-gray-100 w-full rounded-lg flex  justify-between">
        <div className="flex justify-top">
          <span className="pt-1 text-gray-600">₱</span>{" "}
          <span className="text-4xl bold pl-1">{total}</span>
        </div>
        <Button
          leftIcon={<IconPaperBag size="1rem" />}
          className="bg-sky-500"
          radius="xl"
        >
          Order now
        </Button>
      </div>
    </Template>
  )
}

export default Cart
