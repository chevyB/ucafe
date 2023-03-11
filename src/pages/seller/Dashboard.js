import { useEffect, useState, useRef } from "react"
import {
  ActionIcon,
  Button,
  Card,
  Group,
  Image,
  Text,
  Textarea,
  TextInput,
  FileButton,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconEdit, IconUpload } from "@tabler/icons-react"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { db } from "../../api/base"
import useAuth from "../../hooks/useAuth"
import { getErrorMessage } from "../../utils/helper"
import Template from "../components/templates/Template"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import UploadProgress from "../components/molecules/UploadProgress"

const Dashboard = () => {
  const { user } = useAuth()
  const storage = getStorage()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [percentage, setPercentage] = useState(0)
  const [detail, setDetail] = useState({})
  const [editMode, setEditMode] = useState(false)

  const getStoreData = async () => {
    getDoc(doc(db, "stores", user.id)).then((response) => {
      setDetail(response.data())
      form.setValues(response.data())
    })
  }

  const onUpload = async () => {
    const storageRef = ref(storage, `images/${user.id}`)
    const uploadTask = uploadBytesResumable(storageRef, file, file.type)
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setPercentage(
          parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        )
      },
      (error) => {
        setFile(null)
        notifications.show({
          color: "red",
          title: "Error",
          message: getErrorMessage(error),
        })
      },
      async () => {
        await updateDoc(doc(db, "stores", user.id), {
          img: await getDownloadURL(uploadTask.snapshot.ref),
        })
        setFile(null)
        setPercentage(0)
        getStoreData()
      }
    )
  }

  useEffect(() => {
    if (file) {
      onUpload()
    }
  }, [file])

  useEffect(() => getStoreData, [])

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },

    validate: {
      name: (value) => (value ? null : "Required"),
      description: (value) => (value ? null : "Required"),
    },
  })

  const handleDetailSubmit = async ({ name, description }) => {
    setLoading(true)
    try {
      await updateDoc(doc(db, "stores", user.id), {
        name,
        description,
      })
      setEditMode(false)
      getStoreData()
      notifications.show({
        title: "Success",
        message: "Updated info successfully.",
      })
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: getErrorMessage(error),
      })
    }
    setLoading(false)
  }

  return (
    <Template>
      {file && <UploadProgress percentage={percentage} />}
      <Card>
        <Card.Section>
          <FileButton onChange={setFile} accept="image/png,image/jpeg">
            {(props) => (
              <ActionIcon
                className="cursor-pointer fixed z-10 m-4 right-0"
                color="blue"
                radius="lg"
                variant="outline"
                {...props}
              >
                <IconUpload size="1rem" />
              </ActionIcon>
            )}
          </FileButton>

          <Image
            src={detail?.img ?? "/storeplaceholder.png"}
            height={160}
            alt="Norway"
          />
        </Card.Section>

        {editMode ? (
          <form
            onSubmit={form.onSubmit(handleDetailSubmit)}
            className="pt-4 space-y-4 md:space-y-6"
          >
            <TextInput
              withAsterisk
              placeholder="Store name"
              label="Store name"
              {...form.getInputProps("name")}
            />

            <Textarea
              label="Description"
              placeholder="Store Desription here"
              {...form.getInputProps("description")}
            />

            <Group position="right" mt="md">
              <Button
                onClick={() => setEditMode(false)}
                type="cancel"
                variant="outline"
              >
                Cancel
              </Button>
              <Button loading={loading} type="submit" className="bg-sky-500">
                Submit
              </Button>
            </Group>
          </form>
        ) : (
          <>
            <Group position="apart" mt="md" mb="xs">
              <Text weight={500}>{detail?.name}</Text>
              <Button
                onClick={() => setEditMode(true)}
                leftIcon={<IconEdit size="1rem" />}
                variant="outline"
              >
                Edit
              </Button>
            </Group>

            <Text size="sm" color="dimmed">
              {detail?.description}
            </Text>
          </>
        )}
      </Card>
    </Template>
  )
}

export default Dashboard
