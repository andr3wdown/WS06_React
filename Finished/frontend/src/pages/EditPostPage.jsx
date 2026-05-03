import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import PostForm from '../components/PostForm.jsx'


function EditPostPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchPost() {
    setLoading(true)
    try {
      const response = await fetch(`/api/posts/${id}`)

      if (!response.ok) {
        setError(`Failed to load post (${response.status})`)
        return
      }

      const data = await response.json()
      setPost(data)
    } 
    catch (err) {
      setError(err.message || 'Unable to load post')
    } 
    finally {
      setLoading(false)
    }
  }

  fetchPost()
  }, [id])

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const formData = new FormData(e.target)
      const body = {
        title: formData.get('title'),
        author: formData.get('author'),
        content: formData.get('content'),
      }

      const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to update post (${response.status})`)
      }

      navigate(`/posts/${id}`)
    } 
    catch (err) {
      setError(err.message || 'Unable to save post')
    } 
    finally {
      setSubmitting(false)
    }
  }

  if (loading) return <p className="status-msg">Loading…</p>
  if (error && !post) return <p className="status-msg error">{error}</p>
  if (!post) return <p className="status-msg">TODO: Load a post before editing.</p>

  return (
    <div>
      <h1 className="page-title">Edit post</h1>
      {error && <p className="status-msg error">{error}</p>}
      <PostForm
        key={post._id}
        initialData={post}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  )
}

export default EditPostPage
