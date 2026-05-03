const express = require('express');
const mongoose = require('mongoose');

const Post = require('../models/Post');

const router = express.Router();

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function generateHTML(title, content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        ul { list-style-type: none; padding: 0; }
        li { margin: 10px 0; padding: 10px; border: 1px solid #ddd; }
        a { text-decoration: none; color: #007bff; }
        a:hover { text-decoration: underline; }
        .error { color: red; }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      ${content}
      <br><a href="/">Back to Home</a>
    </body>
    </html>
  `;
}

router.get('/', (req, res) => {
  const content = `
    <p>Welcome to the Blog!</p>
    <a href="/posts">View All Posts</a>
  `;
  res.send(generateHTML('Home', content));
});

router.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    let content = '<ul>';
    if (posts.length === 0) {
      content += '<li>No posts found.</li>';
    } else {
      posts.forEach(post => {
        content += `
          <li>
            <h2><a href="/posts/${post._id}">${post.title || 'Untitled'}</a></h2>
            <p>${post.content ? post.content.substring(0, 100) + '...' : 'No content'}</p>
            <small>Created: ${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown'}</small>
          </li>
        `;
      });
    }
    content += '</ul>';
    res.send(generateHTML('All Posts', content));
  } catch (error) {
    const content = '<p class="error">Server error loading posts.</p>';
    res.status(500).send(generateHTML('Error', content));
  }
});

router.get('/posts/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) {
    const content = '<p class="error">Invalid post ID.</p>';
    return res.status(400).send(generateHTML('Error', content));
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      const content = '<p class="error">Post not found.</p>';
      return res.status(404).send(generateHTML('Not Found', content));
    }

    const content = `
      <h2>${post.title || 'Untitled'}</h2>
      <p>${post.content || 'No content'}</p>
      <small>Created: ${post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Unknown'}</small>
    `;
    res.send(generateHTML(post.title || 'Post', content));
  } catch (error) {
    const content = '<p class="error">Server error loading post.</p>';
    res.status(500).send(generateHTML('Error', content));
  }
});

router.get('/posts/new', (req, res) => {
  const content = `
    <form action="/api/posts" method="POST">
      <label>Title: <input type="text" name="title" required></label><br>
      <label>Content: <textarea name="content" required></textarea></label><br>
      <button type="submit">Create Post</button>
    </form>
  `;
  res.send(generateHTML('New Post', content));
});

module.exports = router;