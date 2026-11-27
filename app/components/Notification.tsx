"use client"

import { useNotification } from "./NotificationContext"

export default function Notification() {
  const { message, type } = useNotification()

  if (!message) return null

  const styles =
    type === "success"
      ? "bg-green-100 text-green-800 border-green-400"
      : "bg-red-100 text-red-800 border-red-400"

  return (
    <div 
      role="status"
      data-testid="notification"
      className={`max-w-2xl mx-auto my-4 p-3 border rounded-md ${styles}`}>
        {message}
    </div>
  )
}