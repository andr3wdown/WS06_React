import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard.jsx'

function HomePage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true)
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/posts`)

        if (!response.ok) {
          setError(`Failed to load posts (${response.status})`)
        }
        else{
          const data = await response.json()
          setPosts(data)
        }
      } 
      catch (err) {
        setError(err.message || 'Unable to load posts')
      } 
      finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) return <p className="status-msg">Loading posts…</p>
  if (error) return <p className="status-msg error">{error}</p>

  return (
    <div className="blog-page">
      <div className="page-heading">
        <p className="eyebrow">Blog</p>
        <h1 className="page-title">All posts</h1>
        <p className="page-copy">
          Latest posts
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="status-msg">No posts yet.</p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post._id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default HomePage
