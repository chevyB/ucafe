import React from "react"
import { ActionIcon, Badge, Box, Card, Image, Text } from "@mantine/core"
import { IconShoppingCartPlus } from "@tabler/icons-react"

const ProductItem = ({
  img,
  name,
  description,
  price,
  is_available,
  isAdd = null,
}) => {
  return (
    <Card
      shadow="sm"
      padding="lg"
      radius="md"
      withBorder
      className="flex p-0 m-0 !mt-0"
    >
      <Card.Section className="!m-0 flex pl-1 items-center">
        <Image
          src={img ?? "/productplaceholder.png"}
          height={100}
          width={100}
          alt="Norway"
        />
      </Card.Section>

      <Box className="flex flex-col p-1 w-full justify-between">
        <Text className="line-clamp-2" fz="sm">
          {name}
        </Text>
        <Text className="line-clamp-2 text-gray-500" fz="xs">
          {description}
        </Text>
        <div className="flex justify-between items-center">
          <Text fw={500}>₱ {price.toLocaleString()}</Text>

          {isAdd && is_available && (
            <ActionIcon
              sx={{
                border: "1px solid rgb(14 165 233)",
                color: "rgb(14 165 233)",
                padding: "0.05rem",
              }}
              variant="filled"
            >
              <IconShoppingCartPlus size="1rem" />
            </ActionIcon>
          )}

          {!is_available && (
            <Badge color="red" size="xs" variant="filled">
              Not Available
            </Badge>
          )}
        </div>
      </Box>
    </Card>
  )
}

export default ProductItem
