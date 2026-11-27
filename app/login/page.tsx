"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useNotification } from "../components/NotificationContext"

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState("")
  const { showNotification } = useNotification()

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid username or password")
      showNotification("Login failed!", "error")
    } else {
      showNotification("Logged in successfully!", "success")
      router.push("/")
      router.refresh()
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p data-testid="error-message" className="text-red-600 mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">
            Username
            <input type="text" name="username" required className="w-full border rounded-md p-2"/>
          </label>
        </div>
        <div>
          <label className="block font-medium">
            Password
            <input type="password" name="password" required className="w-full border rounded-md p-2"/>
          </label>
        </div>
        <button 
          type="submit"
          data-testid="login-button"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  )
}