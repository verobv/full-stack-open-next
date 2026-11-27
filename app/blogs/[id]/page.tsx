import { notFound } from "next/navigation"
import { getBlogById } from "../../services/blogs"
import { addLikeBlog, addToReadingList } from "../../actions/blogs"
import { getCurrentUser } from "../../services/session"

const BlogPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const blog = await getBlogById(Number(id))
  const user = await getCurrentUser()

  if (!blog) {
    notFound()
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div data-testid="blog-detail" className="border rounded-lg p-6 shadow-sm">
        <h2 data-testid="blog-title" className="text-2xl font-bold mb-4">{blog.title}</h2>

        <div className="space-y-3 mb-6">
          <p data-testid="blog-author" className="text-gray-600">Author: {blog.author}</p>

          <p className="text-gray-600">url: 
            <a
              href={blog.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {" "}{blog.url}
            </a>
          </p>

          <p className="text-gray-600">Likes: {blog.likes}</p>
        </div>

        <form action={addLikeBlog}>
          <input type="hidden" name="id" value={blog.id} />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg
                       hover:bg-blue-700 transition-colors font-medium"
          >
            Like blog
          </button>
        </form>

        {user && user.id !== blog.userId && 
          <form action={addToReadingList} className="mt-2">
            <input type="hidden" name="id" value={blog.id} />
            <button
              type="submit"
              data-testid="add-to-reading-list-button"
              className="bg-green-600 text-white px-5 py-2 rounded-lg
                        hover:bg-blue-700 transition-colors font-medium"
            >
              Add to reading list
            </button>
          </form>
        }
        
      </div>
    </div>
  )
}

export default BlogPage