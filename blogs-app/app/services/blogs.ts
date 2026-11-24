const blogs = [
  { id: 1, title: "React Test", author: 'Test Author', url: 'reacttest.com', likes: 1 },
  { id: 2, title: "Test", author: 'Test Author', url: 'test.com', likes: 0 },
  { id: 3, title: "Example", author: 'Example Author', url: 'example.com', likes: 5 },
]

let nextId = 4

export const getBlogs = () => {
  return blogs
}

export const addBlogs = (title: string, author: string, url: string, likes: number) => {
  blogs.push({ id: nextId++, title, author, url, likes })
}

export const getBlogById = (id: number) => {
  return blogs.find((blog) => blog.id === id)
}

export const addLike = (id: number) => {
  const blog = blogs.find((blog) => blog.id === id)
  if (blog) {
    blog.likes += 1
  }
}