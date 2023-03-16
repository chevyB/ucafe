import { notifications } from "@mantine/notifications"
import {
  IconBowl,
  IconDiscountCheck,
  IconLoader,
  IconPaperBag,
} from "@tabler/icons-react"
import { getDownloadURL } from "firebase/storage"

export const getErrorMessage = (error) => {
  console.log({ error })
  switch (error.code) {
    case "auth/user-not-found":
      return "Incorrect Email or Password."
    case "auth/email-already-in-use":
      return "Email is already taken."
    case "auth/weak-password":
      return "Password should be at least 6 characters."
    case "storage/unauthorized":
      return "Unauthorize"
    case "storage/canceled":
      return "Upload cancelled."
    case "storage/unknown":
      return "Unknown error."

    default:
      return "Something went wrong"
  }
}

export const orderStatusIcon = (status) => {
  switch (status) {
    case "placed":
      return <IconLoader size="1rem" />
    case "processing":
      return <IconBowl size="1rem" />
    case "ready":
      return <IconPaperBag size="1rem" />
    case "completed":
      return <IconDiscountCheck size="1rem" />
    default:
      return <IconLoader size="1rem" />
  }
}

export const onUploadHelper = async (
  uploadTask,
  setPercentage,
  onComplete,
  data = null
) => {
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      setPercentage(
        parseInt((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
      )
    },
    (error) => {
      notifications.show({
        color: "red",
        title: "Error",
        message: getErrorMessage(error),
      })
    },
    async () => {
      onComplete({ url: await getDownloadURL(uploadTask.snapshot.ref), data })
    }
  )
}
