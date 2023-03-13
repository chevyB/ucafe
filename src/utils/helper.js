import { notifications } from "@mantine/notifications"
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
