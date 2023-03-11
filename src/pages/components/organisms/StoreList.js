import React, { useEffect, useState } from "react"
import { db } from "../../../api/base"
import { collection, getDocs } from "firebase/firestore"
import StoreCard from "./StoreCard"

const StoreList = () => {
  const [stores, setStores] = useState([])
  const getStores = async () => {
    const querySnapshot = await getDocs(collection(db, "stores"))
    setStores(
      querySnapshot.docs.map((resp) => ({
        id: resp.id,
        ...resp.data(),
      }))
    )
  }
  useEffect(() => getStores, [])

  return (
    <section>
      <div className="max-w-2xl mx-auto">
        {stores.length ? (
          stores.map((store) => <StoreCard store={store} />)
        ) : (
          <div>No stores as of the moment.</div>
        )}
      </div>
    </section>
  )
}

export default StoreList
