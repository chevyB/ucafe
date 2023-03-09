export const getErrorMessage = (error) => {
  console.log({ error })
  switch (error.code) {
    case "auth/user-not-found":
      return "Incorrect Email or Password"
    case "auth/email-already-in-use":
      return "Email is already taken"
    case "auth/weak-password":
      return "Password should be at least 6 characters"

    default:
      return "Something went wrong"
  }
}
