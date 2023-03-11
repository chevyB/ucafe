import React from "react"
import { Badge, Card, Group, Image, Text } from "@mantine/core"
import { Link } from "react-router-dom"

const StoreCard = ({ store }) => {
  return (
    <Link to={`store/${store.id}`}>
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

        <Text size="sm" color="dimmed" className="line-clamp-2">
          {store.description}
        </Text>
      </Card>
    </Link>
  )
}

export default StoreCard
