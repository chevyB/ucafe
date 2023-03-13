import { useState } from "react"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { addDoc, collection, doc, serverTimestamp, setDoc } from "firebase/firestore"
import { Button, Text } from "@mantine/core"
import { getStorage, ref, uploadBytesResumable } from "firebase/storage"

import { db } from "../../api/base"
import useAuth from "../../hooks/useAuth"
import { getErrorMessage, onUploadHelper } from "../../utils/helper"
import Template from "../components/templates/Template"
import UploadProgress from "../components/molecules/UploadProgress"
import ProductFields from "./ProductFields"
import ProductBanner from "./ProductBanner"

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
      created_at: serverTimestamp(),
      deleted: false,
    },

    validate: {
      name: (value) => (value ? null : "Required"),
      price: (value) => (value ? null : "Required"),
    },
  })

  const onCompleteUpload = async ({ url, data }) => {
    const subColRef = doc(db, "stores", user.id, "products", data)
    await setDoc(subColRef, { img: url }, { merge: true })
    setFile(null)
    setPercentage(0)
    setLoading(false)
    form.reset()
    notifications.show({
      title: "Success",
      message: "Created a new product",
    })
  }

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

      onUploadHelper(uploadTask, setPercentage, onCompleteUpload, product.id)
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

      <ProductBanner
        setFile={setFile}
        file={file ? URL.createObjectURL(file) : null}
      />

      <form
        onSubmit={form.onSubmit(handleAddProduct)}
        className="p-4 space-y-4 md:space-y-6"
      >
        <ProductFields form={form} />

        <Button fullWidth loading={loading} type="submit" className="bg-sky-500">
          Submit
        </Button>
      </form>
    </Template>
  )
}

export default AddProduct
