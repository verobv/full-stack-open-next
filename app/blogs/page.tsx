import { getBlogs } from "../services/blogs"
import Link from "next/link"

type SearchParams = Promise<{ filter?: string }>

const Blogs = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { filter } = await searchParams
  const search = filter ?? ''
  const blogs = await getBlogs(search)
  const blogsToShow = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Blogs</h2>
      <form action='/blogs' method="GET" className="flex gap-2 mb-6">
        <input
          type="text"
          name="filter"
          data-testid="filter-input"
          defaultValue={filter}
          placeholder="Search blogs by title"
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2
               focus:outline-none focus:ring-2 focus:ring-blue-500
               focus:border-blue-500"
        />
        <button 
          type="submit"
          data-testid="search-button"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg
               hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>
      {filter && (
        <div className="mb-4">
          <Link href="/blogs" className="text-blue-600 hover:underline">Show all blogs</Link>
        </div>
      )}
      <ul data-testid="blogs-list" className="space-y-2">
        {blogsToShow.map(blog => (
          <li key={blog.id} className="border rounded p-3 hover:bg-gray-50">
            <Link href={`/blogs/${blog.id}`} className="text-blue-600 hover:underline">{blog.title} </Link>
            written by {blog.author} url: {blog.url} {blog.likes} likes
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Blogs
