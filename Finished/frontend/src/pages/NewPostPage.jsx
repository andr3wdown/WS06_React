import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PostForm from '../components/PostForm.jsx'

function NewPostPage() {
  const navigate = useNavigate()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

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

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`Failed to create post (${response.status})`)
      }

      const createdPost = await response.json()
      const postId = createdPost._id ?? createdPost.id

      if (!postId) {
        throw new Error('Created post is missing an ID')
      }

      navigate(`/posts/${postId}`)
    } 
    catch (err) {
      setError(err.message || 'Unable to save post')
    } 
    finally {
      setSubmitting(false)
    }

    setSubmitting(false)
  }

  return (
    <div>
      <h1 className="page-title">New post</h1>
      {error && <p className="status-msg error">{error}</p>}
      <PostForm onSubmit={handleSubmit} submitting={submitting} />
    </div>
  )
}

export default NewPostPage
