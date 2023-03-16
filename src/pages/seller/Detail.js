import { useEffect, useState } from "react"
import { Button, Group, Textarea, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { getErrorMessage } from "../../utils/helper"
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"

import { db } from "../../api/base"
import useAuth from "../../hooks/useAuth"
import UploadProgress from "../components/molecules/UploadProgress"
import StoreDetail from "../components/organisms/StoreDetail"

const Detail = () => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file])

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <>
      {file && <UploadProgress percentage={percentage} />}
      <StoreDetail
        showEditBtns
        detail={detail}
        setFile={setFile}
        showInfo={!editMode}
        setEditMode={setEditMode}
      />

      {editMode && (
        <form
          onSubmit={form.onSubmit(handleDetailSubmit)}
          className="p-4 space-y-4 md:space-y-6"
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
              size="xs"
            >
              Cancel
            </Button>
            <Button
              loading={loading}
              type="submit"
              size="xs"
              className="bg-gradient-to-r from-cyan-500 to-blue-500"
            >
              Submit
            </Button>
          </Group>
        </form>
      )}
    </>
  )
}

export default Detail
