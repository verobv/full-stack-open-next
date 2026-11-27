"use client"

import { useActionState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBlog } from "../../actions/blogs"
import { useNotification } from "../../components/NotificationContext"

const initialBlogState = {
  errors: {
    title: "",
    author: "",
    url: "",
  },
  values: {
    title: "",
    author: "",
    url: "",
  },
  success: false,
}

const NewBlog = () => {
  const [state, formAction] = useActionState(createBlog, initialBlogState)
  const { showNotification } = useNotification()
  const router = useRouter()

  useEffect(() => {
    if (state.success) {
      showNotification("blog created", "success")
      router.push("/blogs")
    }
  }, [state.success, showNotification, router])

  return (
    <div className="max-w-xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Create a new blog</h2>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            Title
            <input id="title" type="text" name="title" defaultValue={state.values?.title} required className="w-full border rounded-md p-2"/>
          </label>
        </div>
        <div>
          <label htmlFor="author" className="block font-medium mb-1">
            Author
            <input id="author" type="text" name="author" defaultValue={state.values?.author} required className="w-full border rounded-md p-2"/>
          </label>
        </div>
        <div>
          <label htmlFor="url" className="block font-medium mb-1">
            URL
            <input id="url" type="text" name="url" defaultValue={state.values?.url} required className="w-full border rounded-md p-2"/>
          </label>
        </div>
        <button type="submit" data-testid="create-blog-button" className="bg-blue-600 text-white px-5 py-2 rounded-lg
                       hover:bg-blue-700 transition-colors font-medium">Create</button>
        {state.errors.title && <p className="text-red-600 text-sm mt-1">{state.errors.title}</p>}
        {state.errors.author && <p className="text-red-600 text-sm mt-1">{state.errors.author}</p>}
        {state.errors.url && <p className="text-red-600 text-sm mt-1">{state.errors.url}</p>}
      </form>
    </div>
  )
}

export default NewBlog