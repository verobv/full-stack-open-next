import { Suspense } from "react"
import { getBlogs } from "../services/blogs"
import Link from "next/link"

type SearchParams = Promise<{ filter?: string }>

const BlogList = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { filter } = await searchParams
  const search = filter ?? ''
  const blogs = await getBlogs(search)
  const blogsToShow = [...blogs].sort((a, b) => b.likes - a.likes)
  return (
    <>
      <form action='/blogs' method="GET">
        <input
          type="text"
          name="filter"
          defaultValue={filter}
          placeholder="Search blogs by title"
        />
        <button type="submit">Search</button>
      </form>
      {filter && (
        <div>
          <Link href="/blogs">Show all blogs</Link>
        </div>
      )}
      <ul>
        {blogsToShow.map(blog => (
          <li key={blog.id}>
            <Link href={`/blogs/${blog.id}`}>{blog.title} </Link>
            written by {blog.author} url: {blog.url} likes: {blog.likes}
          </li>
        ))}
      </ul>
    </>
  )
}

const Blogs = async ({ searchParams }: { searchParams: SearchParams }) => {
  return (
    <div>
      <h2>Blogs</h2>
      <Suspense fallback={<p>Loading blogs...</p>}>
        <BlogList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
export default Blogs
