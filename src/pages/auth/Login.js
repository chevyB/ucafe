import React from "react"
import { useForm } from "@mantine/form"
import { auth, db } from "../../api/base"
import { TextInput, PasswordInput } from "@mantine/core"
import { signInWithEmailAndPassword } from "firebase/auth"
import { notifications } from "@mantine/notifications"
import { getErrorMessage } from "../../utils/helper"
import { getDoc, doc } from "firebase/firestore"
import useAuth from "../../hooks/useAuth"

const Login = () => {
  const { user, setUser } = useAuth()
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

  const handleSignIn = (values) => {
    const { email, password } = values
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        notifications.show({
          title: "Success",
          message: "Redirecting ...",
        })
      })
      .catch((error) => {
        notifications.show({
          color: "red",
          title: "Error",
          message: getErrorMessage(error),
        })
      })
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

              <button
                type="submit"
                className="hover:bg-primary-700 focus:ring-primary-300 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4 dark:bg-blue-700"
              >
                Sign in
              </button>

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
