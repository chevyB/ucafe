import React from "react"
import { Loader, Center } from "@mantine/core"
import { collection, doc, getDoc, query, where } from "firebase/firestore"
import { useCollection, useDocument } from "react-firebase-hooks/firestore"

import { db } from "../../api/base"
import Template from "../components/templates/Template"
import { useParams } from "react-router-dom"
import ProductItem from "../components/organisms/ProductItem"
import StoreDetail from "../components/organisms/StoreDetail"

const Store = () => {
  const { storeId } = useParams()
  const [store, storeLoading] = useDocument(doc(db, "stores", storeId))
  const [productList, productLoading] = useCollection(
    query(
      collection(db, "stores", storeId, "products"),
      where("deleted", "==", false)
    )
  )

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
              <ProductItem key={product.id} {...product.data()} isAdd />
            ))
          : !productLoading && <Center>This store has no product yet.</Center>}
      </div>
    </Template>
  )
}

export default Store
