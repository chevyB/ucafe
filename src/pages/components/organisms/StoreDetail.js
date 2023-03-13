import React from "react"
import { IconUpload, IconEdit } from "@tabler/icons-react"
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  Text,
  FileButton,
} from "@mantine/core"

const StoreDetail = ({
  detail,
  setFile,
  showInfo = true,
  showEditBtns = false,
  setEditMode = () => null,
}) => {
  return (
    <Card>
      <Card.Section>
        {showEditBtns && (
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => (
              <ActionIcon
                className="cursor-pointer absolute  z-10 m-4 right-0 bg-white bg-opacity-60"
                color="blue"
                radius="lg"
                variant="outline"
                {...props}
              >
                <IconUpload size="1rem" />
              </ActionIcon>
            )}
          </FileButton>
        )}

        <Image
          src={detail?.img ?? "/storeplaceholder.png"}
          height={160}
          alt="Norway"
        />
      </Card.Section>

      {showInfo && (
        <>
          <Group position="apart" mt="md" mb="xs">
            <Text weight={500}>{detail?.name}</Text>
            {showEditBtns && (
              <Button
                onClick={() => setEditMode(true)}
                leftIcon={<IconEdit size=".8rem" />}
                variant="outline"
                size="xs"
              >
                Edit
              </Button>
            )}
          </Group>

          <Text size="sm" color="dimmed" className="line-clamp-3">
            {detail?.description}
          </Text>
        </>
      )}
    </Card>
  )
}

export default StoreDetail
