import { IconUpload } from "@tabler/icons-react"
import { ActionIcon, Card, Image, FileButton } from "@mantine/core"

const ProductBanner = ({ setFile, file }) => {
  return (
    <Card>
      <Card.Section>
        <FileButton onChange={setFile} accept="image/png,image/jpeg">
          {(props) => (
            <ActionIcon
              className="cursor-pointer absolute z-10 m-4 right-0 bg-white bg-opacity-60"
              color="blue"
              radius="lg"
              variant="outline"
              {...props}
            >
              <IconUpload size="1rem" />
            </ActionIcon>
          )}
        </FileButton>

        <Image src={file ?? "/productplaceholder.png"} height={160} alt="Norway" />
      </Card.Section>
    </Card>
  )
}

export default ProductBanner
