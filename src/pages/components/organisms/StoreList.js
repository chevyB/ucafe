import React from "react"
import { Loader, Center } from "@mantine/core"
import { collection } from "firebase/firestore"
import { useCollection } from "react-firebase-hooks/firestore"

import { db } from "../../../api/base"
import StoreCard from "./StoreCard"

const StoreList = () => {
  const [stores, storesLoading] = useCollection(collection(db, "stores"))

  return (
    <section>
      <div className="md:w-3/4 mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {storesLoading ? (
          <Center>
            <Loader variant="dots" className="justify-self-center py-8" />
          </Center>
        ) : stores?.docs?.length ? (
          stores.docs.map((store) => (
            <StoreCard key={store.id} store={store.data()} id={store.id} />
          ))
        ) : (
          <Center>No stores yet.</Center>
        )}
      </div>
    </section>
  )
}

export default StoreList
