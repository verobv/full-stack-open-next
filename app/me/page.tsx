
import { getCurrentUser } from "../services/session"
import { redirect } from "next/navigation"
import { generateToken } from "../actions/users"
import Link from "next/link"
import { markRead } from "../actions/readingList"
import { connection } from "next/server"

const Me = async () => {
  await connection()
  const user = await getCurrentUser()
  if(!user){
    redirect("/login")
  }
  const unreadBlogs = user.readingList.filter((item) => !item.read)
  const readBlogs = user.readingList.filter((item) => item.read)

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">My profile</h1>
        <div data-testid="user-profile" className="border rounded-lg p-6 shadow-sm space-y-4">
          <p data-testid="user-name"><strong>Name: </strong>{user.name}</p>
          <p data-testid="user-username"><strong>Username: </strong>{user.username}</p>
        </div>

        <div data-testid="reading-list-section" className="border rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold mb-2">My reading list</h2>
          {user.readingList.length === 0 && <p data-testid="empty-reading-list">Your reading list is empty</p>}

          <div data-testid="unread-section" className="mb-8">
            <h4 className="text-md font-semibold mb-3">Unread ({unreadBlogs.length})</h4>
            {unreadBlogs.length === 0 ? (
              <p data-testid="no-unread-blogs">No unread blogs</p>
              ) : (
            
              <ul className="space-y-3">
                {unreadBlogs.map((blog) => (
                  <li key={blog.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <Link href={`/blogs/${blog.blog.id}`} className="text-blue-600 font-medium hover:underline">{blog.blog.title}</Link>
                    <form action={markRead}>
                      <input type="hidden" name="blogId" value={blog.blog.id} />
                        <button
                          type="submit"
                          data-testid={`mark-read-${blog.blog.id}`}
                          className="bg-green-600 text-white px-5 py-2 rounded-lg
                                           hover:bg-blue-700 transition-colors font-medium"
                        >
                          Mark as read
                        </button>
                      </form>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mb-8">
            <h4 className="text-md font-semibold mb-3">Read ({readBlogs.length})</h4>
            {readBlogs.length === 0 ? (
              <p>No read blogs</p>
              ) : (
            
              <ul className="space-y-3">
                {readBlogs.map((blog) => (
                  <li key={blog.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <Link href={`/blogs/${blog.blog.id}`} className="text-blue-600 font-medium hover:underline">{blog.blog.title}</Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div data-testid="api-token-section" className="border rounded-lg p-6 shadow-sm space-y-4">
          <h2 className="text-lg font-bold mb-2">API Token</h2>
          {user.token ? (
            <div data-testid="token-display">
              <p className="text-gray-500 text-md">Current token: </p>
              <p data-testid="api-token" className="text-500 text-sm">{user.token}</p>
            </div> )
            : (
                <p data-testid="no-token-message">No token has been generated</p>
          )}
          
          <form action={generateToken}>
            <button 
            type="submit"
            data-testid="generate-token-button"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg
                hover:bg-blue-700 transition-colors"
            >
            Generate New Token
            </button>
          </form>
        </div>
    </div>
  )
}

export default Me
