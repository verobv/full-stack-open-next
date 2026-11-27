"use server"

import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { db } from "@/db"
import { users } from "@/db/schema"
import { checkUniqueness } from "../services/users"
import { getCurrentUser } from "../services/session"
import { redirect } from "next/navigation"
import { eq } from "drizzle-orm"

export type RegisterField = "username" | "password" | "passwordConfirm"
export type RegisterState = {
  error: string
  field?: RegisterField
  success?: boolean
}

export const registerUser = async (
  prevState: RegisterState,
  formData: FormData
): Promise<RegisterState> => {
  const username = (formData.get("username") as string)?.trim()
  const name = (formData.get("name") as string)?.trim()
  const password = formData.get("password") as string
  const passwordConfirm = formData.get("passwordConfirm") as string

  if (!username || username.length < 4) {
    return { error: "Username must be at least 4 characters long", field: "username" }
  }

  if (!password || password.length < 4) {
    return { error: "Password must be at least 4 characters long", field: "password" }
  }

  if (password !== passwordConfirm ) {
    return { error: "Passwords must match", field: "passwordConfirm" }
  }

  const isUnique = await checkUniqueness(username)
  if (!isUnique) {
    return { error: "Username already exists", field: "username" }
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await db.insert(users).values({ username, name, passwordHash })

  //redirect("/login")
  return { error: "", success: true }
}

export const generateToken = async() => {
  const user = await getCurrentUser()

  if(!user){
    redirect("/login")
  }

  const token = crypto.randomUUID()

  await db.update(users).set({ token }).where(eq(users.id, user.id))

  revalidatePath("/me")
}