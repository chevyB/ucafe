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

const AddProduct = () => {
  // const [file, setFile] = useState(null)
  // const { user } = useAuth()
  // const [loading, setLoading] = useState(false)

  // const form = useForm({
  //   initialValues: {
  //     name: "",
  //     description: "",
  //   },

  //   validate: {
  //     name: (value) => (value ? null : "Required"),
  //     description: (value) => (value ? null : "Required"),
  //   },
  // })
  return (
    <Template>
      <Text color="blue" fz="md" className="font-medium">
        Add new product
      </Text>
    </Template>
  )
}

export default AddProduct
