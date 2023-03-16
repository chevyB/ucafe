import React, { useState } from "react"
import { useForm } from "@mantine/form"
import { auth, db } from "../../api/base"
import { TextInput, PasswordInput, Button } from "@mantine/core"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { notifications } from "@mantine/notifications"
import { getErrorMessage } from "../../utils/helper"

const Register = () => {
  const [loading, setLoading] = useState(false)
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },

    validate: {
      name: (value) => (value ? null : "Required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value ? null : "Required"),
      confirmPassword: (value, values) =>
        value !== values.password ? "Passwords did not match" : null,
    },
  })

  const handleSignUp = async (values) => {
    setLoading(true)
    const { email, password, name } = values
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: userCredential.user.email,
        name,
        role: "user",
      })

      form.reset()
      notifications.show({
        title: "Success!",
        message: "You're all signed up!",
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
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 lg:py-0 h-screen">
        <img className="mb-6 h-16" src="/logo.png" alt="logo" />
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Create a new account
            </h1>
            <form
              onSubmit={form.onSubmit(handleSignUp)}
              className="space-y-4 md:space-y-6"
            >
              <TextInput
                withAsterisk
                label="Full name"
                placeholder="Your name"
                {...form.getInputProps("name")}
              />

              <TextInput
                withAsterisk
                label="Email"
                placeholder="your@email.com"
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
              <Button
                fullWidth
                loading={loading}
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                Register
              </Button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account yet?{" "}
                <a
                  href="/login"
                  className="text-blue-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Sign in
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register
