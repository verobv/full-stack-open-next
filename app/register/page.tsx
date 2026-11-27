"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { registerUser, RegisterState } from "../actions/users"
import { useNotification } from "../components/NotificationContext"

export default function RegisterPage() {
  const { showNotification } = useNotification()
  const router = useRouter()
  
  const registerAndNotify = async (prev: RegisterState, formData: FormData) => {
    const result = await registerUser(prev, formData)
    if (result.success) {
      showNotification("Registration successful! Please log in.", "success")
      router.push("/login")
    } else {
      showNotification(result.error, "error")
    }
    return result
  }

  const [state, formAction] = useActionState(registerAndNotify, { error: "" })

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <form action={formAction} className="flex flex-col gap-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
            <input id="username" type="text" name="username" required className="w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </label>
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Name
            <input id="name" type="text" name="name" required className="w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </label>
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
            <input id="password" type="password" name="password" required className="w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </label>
        </div>
        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium mb-1">
            Confirm Password
            <input id="passwordConfirm" type="password" name="passwordConfirm" required className="w-full border border-gray-300 rounded-lg px-3 py-2
                       focus:outline-none focus:ring-2 focus:ring-blue-500"/>
          </label>
        </div>

        <button 
          type="submit"
          data-testid="register-button"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg
               hover:bg-blue-700 transition-colors"
        >
          Register
        </button>
        {state.error && <p data-testid={`${state.field}-error`} className="text-red-600 text-sm">{state.error}</p>}
      </form>
    </div>
  )
}