import React from "react"
import { Link } from "react-router-dom"
import { Loader, Center } from "@mantine/core"
import { collection, query, where } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"

import Detail from "./Detail"
import { db } from "../../api/base"
import useAuth from "../../hooks/useAuth"
import Template from "../components/templates/Template"
import ProductItem from "../components/organisms/ProductItem"

const Dashboard = () => {
  const { user } = useAuth()
  const [productList, productLoading] = useCollection(
    query(
      collection(db, "stores", user.id, "products"),
      where("deleted", "==", false)
    )
  )

  return (
    <Template>
      <Detail />

      <div className="p-4 grid md:grid-cols-2 gap-2">
        {productLoading ? (
          <Center>
            <Loader variant="dots" className="justify-self-center py-8" />
          </Center>
        ) : productList?.docs?.length ? (
          productList.docs.map((product) => (
            <Link to={`/seller/product/${product.id}`} key={product.id}>
              <ProductItem {...product.data()} />
            </Link>
          ))
        ) : (
          <Center>
            No product yet. You can add product
            <Link to="/seller/product/add" className="text-blue-500 cursor-pointer">
              &nbsp;here
            </Link>
            .
          </Center>
        )}
      </div>
    </Template>
  )
}

export default Dashboard
