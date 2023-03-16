import React, { useState } from "react"
import { useForm } from "@mantine/form"
import { auth } from "../../api/base"
import { TextInput, PasswordInput, Button } from "@mantine/core"
import { signInWithEmailAndPassword } from "firebase/auth"
import { notifications } from "@mantine/notifications"
import { getErrorMessage } from "../../utils/helper"

const Login = () => {
  const [loading, setLoading] = useState(false)
  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => (value ? null : "Required"),
    },
  })

  const handleSignIn = async (values) => {
    setLoading(true)
    const { email, password } = values
    try {
      await signInWithEmailAndPassword(auth, email, password)
      notifications.show({
        title: "Success",
        message: "Redirecting ...",
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
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 lg:py-0 h-screen">
        <img className="mb-6 h-16" src="/logo.png" alt="logo" />
        <div className="w-full rounded-lg bg-white shadow dark:border dark:border-gray-700 dark:bg-gray-800 sm:max-w-md md:mt-0 xl:p-0">
          <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
              Sign in to your account
            </h1>
            <form
              onSubmit={form.onSubmit(handleSignIn)}
              className="space-y-4 md:space-y-6"
            >
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
              <Button
                fullWidth
                loading={loading}
                type="submit"
                className="bg-gradient-to-r from-cyan-500 to-blue-500"
              >
                Sign in
              </Button>

              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Don't have an account yet?{" "}
                <a
                  href="/register"
                  className="text-blue-600 dark:text-primary-500 font-medium hover:underline"
                >
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
