
const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})


blogsRouter.post('/', middleware.userExtractor, async (request, response) => {

  let newBlog = request.body  
  if (newBlog.url === undefined || newBlog.title === undefined) {
    return response.status(400).end()
  }
  let decodedToken = ""
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: error })
  }  
  if (!decodedToken.id) {    
    return response.status(401).json({ error: 'token missing or invalid' })  
  }
  const user = request.user
  newBlog.user = user._id

  if (newBlog.likes === undefined) {
    newBlog.likes = 0
  }

  const blog = new Blog(newBlog)
  const result = await blog.save()
  user.blogs = user.blogs.concat(blog._id)
  await user.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  
  const decodedToken = jwt.verify(request.token, process.env.SECRET)  
  if (!decodedToken.id) {    
    return response.status(401).json({ error: 'token missing or invalid' })  
  }

  const blog = await Blog.findById(request.params.id)
  if (decodedToken.id === blog.user.toString()) {
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }
  return response.status(401).json({ error: 'token belongs to a wrong user' })
})

blogsRouter.put('/:id', async (request, response, next) => {
  const blog = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
  response.json(updatedBlog)
})

module.exports = blogsRouter