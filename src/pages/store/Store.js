import React, { useState } from "react"
import { Loader, Center } from "@mantine/core"
import { notifications } from "@mantine/notifications"
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
  where,
} from "firebase/firestore"
import { useCollection, useDocument } from "react-firebase-hooks/firestore"

import { db } from "../../api/base"
import Template from "../components/templates/Template"
import { useParams } from "react-router-dom"
import ProductItem from "../components/organisms/ProductItem"
import StoreDetail from "../components/organisms/StoreDetail"
import useAuth from "../../hooks/useAuth"
import { getErrorMessage } from "../../utils/helper"

const Store = () => {
  const { storeId } = useParams()
  const { user, userCart, setTriggerCartFetch } = useAuth()
  const [processedIds, setProcessedId] = useState([])
  const [store, storeLoading] = useDocument(doc(db, "stores", storeId))
  const [productList, productLoading] = useCollection(
    query(
      collection(db, "stores", storeId, "products"),
      where("deleted", "==", false)
    )
  )

  const checkIfSameStore = () => {
    if (!userCart.size || userCart.docs[0].data().store_id === storeId) return true

    return false
  }

  const addNewCart = async (product_id) => {
    await addDoc(collection(db, "carts"), {
      user_id: user.id,
      store_id: storeId,
      product_id,
      pieces: 1,
    })
  }

  const handleAddToCart = async (product_id) => {
    setProcessedId((prev) => [...prev, product_id])
    try {
      if (checkIfSameStore()) {
        let hasSameProduct = false
        if (userCart.size) {
          hasSameProduct = (
            await getDocs(
              query(
                collection(db, "carts"),
                where("product_id", "==", product_id),
                where("user_id", "==", user.id),
                limit(1)
              )
            )
          ).size

          if (hasSameProduct) {
            const cart = userCart.docs[0]
            await updateDoc(doc(db, "carts", cart.id), {
              pieces: cart.data().pieces + 1,
            })
          }
        }
        console.log({ hasSameProduct })

        if (!hasSameProduct) {
          addNewCart(product_id)
        }
      } else {
        const asnwer = window.confirm(
          "Remove your previous items? \nYou have already selected different restaurant. If you continue your  cart and selection will be removed."
        )
        if (asnwer) {
          userCart.forEach(async (doc) => {
            await deleteDoc(doc.ref)
          })
          addNewCart(product_id)
        }
      }
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: getErrorMessage(error),
      })
    } finally {
      setTriggerCartFetch((prev) => !prev)
    }

    setProcessedId((prev) => prev.filter((data) => data !== product_id))
  }

  return (
    <Template>
      {store && <StoreDetail detail={store.data()} />}
      <div className="p-4 grid md:grid-cols-2 gap-2">
        {(productLoading || storeLoading) && (
          <Center>
            <Loader variant="dots" className="justify-self-center py-8" />
          </Center>
        )}

        {productList?.docs?.length
          ? productList.docs.map((product) => (
              <ProductItem
                key={product.id}
                {...product.data()}
                id={product.id}
                handleAddToCart={handleAddToCart}
                loadingCartIds={processedIds}
              />
            ))
          : !productLoading && <Center>This store has no product yet.</Center>}
      </div>
    </Template>
  )
}

export default Store
