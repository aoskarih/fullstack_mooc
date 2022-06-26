const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')


const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const newUser =   {
  username: "menekki",
  name: "Menopeli",
  password: "hurja_pää"
}

const credentials = {
  username: newUser.username,
  password: newUser.password
}

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  await api
    .post('/api/users')
    .send(newUser)

  const auth = await api
    .post('/api/login')
    .send(credentials)

  const promiseArray = blogs.map(async b => {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${auth.body.token}`)
      .send(b)
  });
  await Promise.all(promiseArray)

}, 100000)

describe('blog api', () => {
  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogs.length)
  }, 100000)

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)
  
  test('blogs have field "id"', async () => {
    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
  }, 100000)

  test('a valid blog can be added', async () => {
    const newBlog =   {
      title: "React",
      author: "Chan",
      url: "https://rat.com/",
      likes: 420,
    }
    const auth = await api
      .post('/api/login')
      .send(credentials)
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${auth.body.token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(blogs.length + 1)
  }, 100000)

  test('added blog can be found in db', async () => {
    const newBlog =   {
      title: "Reactor",
      author: "Chan",
      url: "https://rat.com/",
      likes: 420,
    }
  
    const auth = await api
      .post('/api/login')
      .send(credentials)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${auth.body.token}`)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body.map(b => b.title)).toContainEqual(newBlog.title)
  }, 100000)

  test('added blog likes default to 0', async () => {
    const newBlog =   {
      title: "likes default to 0",
      author: "Chan",
      url: "https://rat.com/",
    }
    const auth = await api
      .post('/api/login')
      .send(credentials)

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${auth.body.token}`)

    const addedBlog = await Blog.findOne({ title:"likes default to 0" })
    expect(addedBlog.likes).toBe(0)
  }, 100000)

  test('an invalid blog returns 400 Bad Request', async () => {
    const newBlog =   {
      title: "React",
      author: "Chan",
      //url: "https://rat.com/",
      likes: 420,
    }
    const auth = await api
      .post('/api/login')
      .send(credentials)
    
    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer ${auth.body.token}`)
      .expect(400)
  
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(blogs.length)
  }, 100000)

  test('an invalid token returns 401', async () => {
    const newBlog =   {
      title: "React",
      author: "Chan",
      url: "https://rat.com/",
      likes: 420,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `Bearer 123456`)
      .expect(401)
  
    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(blogs.length)
  }, 100000)

  test('deleting blog removes it', async () => {
    const blogToDelete = blogs[0]
    
    const auth = await api
      .post('/api/login')
      .send(credentials)
    
    await api
      .delete(`/api/blogs/${blogToDelete._id}`)
      .set('Authorization', `Bearer ${auth.body.token}`)
      .expect(204)

    const blogsAtEnd = await api.get('/api/blogs')
    expect(blogsAtEnd.body).toHaveLength(blogs.length - 1)

    expect(blogsAtEnd.body.reduce((acc, val) => val.id === blogToDelete._id || acc, false)).toBe(false)

  })

  test('updating blog changes it', async () => {
    const blogToUpdate = blogs[0]
    const newBlog = {
      //author: blogToUpdate.author,
      //title: blogToUpdate.title,
      //url: blogToUpdate.url,
      likes: blogToUpdate.likes+100
    }
    await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    const updatedBlog = await Blog.findById(blogToUpdate._id)
    expect(updatedBlog.likes).toBe(blogToUpdate.likes+100)
  })

})

afterAll(() => {
  mongoose.connection.close()
})