"use server"

import { redirect } from "next/navigation"
import { getCurrentUser } from "../services/session"
import { revalidatePath } from "next/cache"
import { markEntryRead } from "../services/readingList"

export const markRead = async (formData: FormData) => {
  const user = await getCurrentUser()
  
  if(!user){
    redirect("/login")
  }

  const blogId = Number(formData.get("blogId"))

  await markEntryRead(user.id, blogId)
  revalidatePath("/me")
}