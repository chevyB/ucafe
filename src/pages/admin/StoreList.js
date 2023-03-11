import React, { useEffect, useState } from "react"
import { db } from "../../api/base"
import { Badge, Card, Group, Image, Text } from "@mantine/core"
import { collection, getDocs } from "firebase/firestore"

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
          stores.map((store) => {
            return (
              <Card
                key={store.id}
                className="mb-4"
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
              >
                <Card.Section>
                  <Image
                    src={!!store.img ? store.img : "/storeplaceholder.png"}
                    height={160}
                    alt="Norway"
                  />
                </Card.Section>

                <Group position="apart" mt="md" mb="xs">
                  <Text weight={500}>{store.name}</Text>
                  <Badge color="pink" variant="light">
                    On Sale
                  </Badge>
                </Group>

                <Text size="sm" color="dimmed">
                  {store.description}
                </Text>
              </Card>
            )
          })
        ) : (
          <div>No stores as of the moment.</div>
        )}
      </div>
    </section>
  )
}

export default StoreList
