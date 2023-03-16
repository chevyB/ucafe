import { useEffect, useState } from "react"
import { useForm } from "@mantine/form"
import { useNavigate, useParams } from "react-router-dom"
import { notifications } from "@mantine/notifications"
import { doc, setDoc, updateDoc } from "firebase/firestore"
import { Button, Text, Loader, Center } from "@mantine/core"
import { useDocument } from "react-firebase-hooks/firestore"
import { getStorage, ref, uploadBytesResumable } from "firebase/storage"

import { db } from "../../api/base"
import useAuth from "../../hooks/useAuth"
import { getErrorMessage, onUploadHelper } from "../../utils/helper"
import Template from "../components/templates/Template"
import UploadProgress from "../components/molecules/UploadProgress"
import ProductFields from "./ProductFields"
import ProductBanner from "./ProductBanner"

const EditProduct = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { productId } = useParams()
  const storage = getStorage()
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [percentage, setPercentage] = useState(0)

  const [product, productLoading] = useDocument(
    doc(db, "stores", user.id, "products", productId)
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => product && form.setValues(product.data()), [product])

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      is_available: false,
      img: null,
      deleted_at: false,
    },

    validate: {
      name: (value) => (value ? null : "Required"),
      price: (value) => (value ? null : "Required"),
    },
  })

  const handleDeleteProduct = async () => {
    setLoading(true)
    try {
      await updateDoc(doc(db, "stores", user.id, "products", productId), {
        deleted: true,
      })
      notifications.show({
        title: "Success",
        message: "Deleted product successfully.",
      })
      navigate("/seller")
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: getErrorMessage(error),
      })
    }
    setLoading(false)
  }

  const handleUpdateProduct = async (values) => {
    setLoading(true)
    try {
      await updateDoc(doc(db, "stores", user.id, "products", productId), values)
      notifications.show({
        title: "Success",
        message: "Updated product successfully.",
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

  const onCompleteUpload = async ({ url }) => {
    const subColRef = doc(db, "stores", user.id, "products", product.id)
    await setDoc(subColRef, { img: url }, { merge: true })
    form.setValues((prev) => ({ ...prev, img: url }))
    notifications.show({
      title: "Success",
      message: "Image uploaded successfully",
    })
    setFile(null)
  }

  const onUpload = async () => {
    const storageRef = ref(storage, `images/${user.id}`)
    const uploadTask = uploadBytesResumable(storageRef, file, file.type)
    onUploadHelper(uploadTask, setPercentage, onCompleteUpload)
  }

  useEffect(() => {
    if (file) {
      onUpload()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  return (
    <Template>
      {file ? <UploadProgress percentage={percentage} /> : null}
      <ProductBanner setFile={setFile} file={form?.values.img} />
      <div className="p-4">
        <Text fz="md" className="font-medium p-4">
          Product Details:
        </Text>
        {productLoading ? (
          <Center>
            <Loader variant="dots" className="justify-self-center py-8" />
          </Center>
        ) : (
          <>
            <form
              onSubmit={form.onSubmit(handleUpdateProduct)}
              className="p-4 space-y-4 md:space-y-6"
            >
              <ProductFields form={form} />

              <Button
                fullWidth
                loading={loading}
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                Submit
              </Button>
            </form>

            <div className="px-4 pt-12">
              <Button
                onClick={() => handleDeleteProduct()}
                fullWidth
                loading={loading}
                className="bg-red-500"
                color="red"
              >
                Delete
              </Button>
            </div>
          </>
        )}
      </div>
    </Template>
  )
}

export default EditProduct
