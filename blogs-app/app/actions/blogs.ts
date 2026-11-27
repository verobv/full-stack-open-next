"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { addBlog, addLike, getBlogById } from "../services/blogs"
import { auth } from "@/auth"
import { getCurrentUser } from "../services/session"
import { addEntry } from "../services/readingList"

export type BlogFormState = {
  errors: { [key: string]: string }
  values: { title: string; author: string; url: string },
  success?: boolean,
}

export const createBlog = async (
  prevState: BlogFormState,
  formData: FormData
): Promise<BlogFormState> => {
  const session = await auth()
  
  if (!session) {
    return {
      errors: {},
      values: { title: "", author: "", url: "" },
      success: false,
    }
  }

  const errors: { [key: string]: string } = {}
  
  const title = formData.get("title") as string
  if (!title || title.length < 5) {
    errors.title = "Blog title must be at least 5 characters long" 
  }

  const author = formData.get("author") as string
  if (!author || author.length < 5) {
    errors.author = "Blog author must be at least 5 characters long" 
  }

  const url = formData.get("url") as string
  if (!url || url.length < 5) {
    errors.url = "Blog url must be at least 5 characters long" 
  }

  if (Object.keys(errors).length > 0) {
    return { errors, values: { title, author, url }, success: false }
  }

  await addBlog(title, author, url, 0)
  revalidatePath("/blogs")
  //redirect("/blogs")

  return { errors, values: { title: "", author: "", url: "" }, success: true }
}

export const addLikeBlog = async (formData: FormData) => {
  const id = Number(formData.get("id"))
  await addLike(id)
  revalidatePath(`/blogs/${id}`)
  revalidatePath("/blogs")
}

export const addToReadingList = async (formData: FormData) => {
  const user = await getCurrentUser()
  
  if(!user){
    redirect("/login")
  }

  const id = Number(formData.get("id"))
  const blog = await getBlogById(id)

  if (!blog){
    throw new Error("Blog not found")
  }

  if (blog.userId === user.id){
    throw new Error("This blog is already added")
  }

  await addEntry(user.id, id)
  revalidatePath(`/blogs/${id}`)
  revalidatePath("/me")
}