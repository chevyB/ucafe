import { useState } from "react"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { IconUpload } from "@tabler/icons-react"
import { addDoc, collection, doc, setDoc } from "firebase/firestore"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"
import {
  ActionIcon,
  Button,
  Card,
  Image,
  Text,
  Textarea,
  TextInput,
  FileButton,
  NumberInput,
  Switch,
} from "@mantine/core"

import { db } from "../../api/base"
import useAuth from "../../hooks/useAuth"
import { getErrorMessage } from "../../utils/helper"
import Template from "../components/templates/Template"
import UploadProgress from "../components/molecules/UploadProgress"

const AddProduct = () => {
  const { user } = useAuth()
  const storage = getStorage()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [percentage, setPercentage] = useState(0)

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      is_available: false,
      img: null,
      deleted_at: null,
    },

    validate: {
      name: (value) => (value ? null : "Required"),
      price: (value) => (value ? null : "Required"),
    },
  })

  const handleAddProduct = async (values) => {
    if (!file) {
      notifications.show({
        color: "red",
        title: "Error",
        message: "Please select an image.",
      })
      return
    }
    setLoading(true)
    try {
      const docRef = doc(db, "stores", user.id)
      const colRef = collection(docRef, "products")
      const product = await addDoc(colRef, values)

      const storageRef = ref(storage, `products/${user.id}/${product.id}`)
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
          const subColRef = doc(db, "stores", user.id, "products", product.id)
          await setDoc(
            subColRef,
            { img: await getDownloadURL(uploadTask.snapshot.ref) },
            { merge: true }
          )
          setFile(null)
          setPercentage(0)
          setLoading(false)
          form.reset()
          notifications.show({
            title: "Success",
            message: "Created a new product",
          })
        }
      )
    } catch (error) {
      setPercentage(0)
      setLoading(false)
      notifications.show({
        color: "red",
        title: "Error",
        message: getErrorMessage(error),
      })
    }
  }
  return (
    <Template>
      {percentage ? <UploadProgress percentage={percentage} /> : null}
      <Text fz="md" className="font-medium p-4">
        Add new product:
      </Text>
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

          <Image
            src={file ? URL.createObjectURL(file) : "/productplaceholder.png"}
            height={160}
            alt="Norway"
          />
        </Card.Section>
      </Card>

      <form
        onSubmit={form.onSubmit(handleAddProduct)}
        className="p-4 space-y-4 md:space-y-6"
      >
        <TextInput
          withAsterisk
          label="Product name"
          {...form.getInputProps("name")}
        />

        <Textarea
          label="Product Description"
          {...form.getInputProps("description")}
        />

        <div className="flex space-x-4 items-end">
          <NumberInput
            hideControls
            withAsterisk
            className="w-2/5"
            label="Price"
            placeholder="0"
            min={0}
            icon={<span>₱</span>}
            parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
            formatter={(value) =>
              !Number.isNaN(parseFloat(value))
                ? `${value}`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : ""
            }
            {...form.getInputProps("price")}
          />

          <Switch
            className=""
            labelPosition="left"
            label="Availability"
            {...form.getInputProps("is_available")}
          />
        </div>

        <Button fullWidth loading={loading} type="submit" className="bg-sky-500">
          Submit
        </Button>
      </form>
    </Template>
  )
}

export default AddProduct
