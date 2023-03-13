import React from "react"
import { useForm } from "@mantine/form"
import { notifications } from "@mantine/notifications"
import { TextInput, PasswordInput, Textarea, Button } from "@mantine/core"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, writeBatch } from "firebase/firestore"

import { auth, db } from "../../api/base"
import { getErrorMessage } from "../../utils/helper"

const RegisterSeller = () => {
  const batch = writeBatch(db)
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      storeName: "",
      storeDescription: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value ? null : "Required"),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
      storeName: (value) => (value ? null : "Required"),
      storeDescription: (value) => (value ? null : "Required"),
    },
  })

  const handleCreateStore = async (values) => {
    const { email, password, storeName, storeDescription } = values
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      const user = doc(db, "users", userCredential.user.uid)
      const store = doc(db, "stores", userCredential.user.uid)
      batch.set(user, {
        email: userCredential.user.email,
        role: "seller",
      })
      batch.set(store, {
        img: "https://www.rd.com/wp-content/uploads/2020/11/RD-americas-favorite-foods-FT-Getty-Images-7-JValentine.jpg?fit=700,1024",
        name: storeName,
        description: storeDescription,
      })
      await batch.commit()
      notifications.show({
        title: "Success",
        message: "Created a new store",
      })
    } catch (error) {
      notifications.show({
        color: "red",
        title: "Error",
        message: getErrorMessage(error),
      })
    }
  }

  return (
    <form
      onSubmit={form.onSubmit(handleCreateStore)}
      className="space-y-4 md:space-y-6"
    >
      <TextInput
        withAsterisk
        label="Email"
        placeholder="store@email.com"
        {...form.getInputProps("email")}
      />

      <PasswordInput
        withAsterisk
        label="Password"
        placeholder="Password"
        {...form.getInputProps("password")}
      />

      <PasswordInput
        withAsterisk
        mt="sm"
        label="Confirm password"
        placeholder="Confirm password"
        {...form.getInputProps("confirmPassword")}
      />

      <TextInput
        withAsterisk
        placeholder="Store name"
        label="Store name"
        {...form.getInputProps("storeName")}
      />

      <Textarea
        placeholder="Store Desription"
        {...form.getInputProps("storeDescription")}
      />

      <Button fullWidth type="submit" className="bg-sky-500">
        Add Store
      </Button>
    </form>
  )
}

export default RegisterSeller
