const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const User = require('../models/user')


const users = [
  {
    username: "vehikkeli",
    name: "Ajoneuvo",
    passwordHash: "$2b$10$8XE9NStGRYaU68r9l/V7zuwGAP7POWrNImLDj4NHqdLIyHva6bqJK",
    id: "62b6f73efdac98e2f61c4e5f"
  },
  {
    username: "vehikulaari",
    name: "Ajokki",
    passwordHash: "$2b$10$Ze0jUgfUHEa.j.Z5M5MkMOn.gcz4j.ZCILO2d63orZ4cNDIgUrvne",
    id: "62b6f76dfdac98e2f61c4e62"
  }
]

beforeEach(async () => {
  await User.deleteMany({})
  await User.insertMany(users)
}, 100000)

describe('user api', () => {

  test('a valid user can be added', async () => {
    const newUser =   {
      username: "menekki",
      name: "Menopeli",
      password: "hurja_pää"
    }
  
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(users.length + 1)
  }, 100000)

  test("an invalid user can't be added", async () => {
    const existingUsername =   {
      username: "vehikkeli",
      name: "Menopeli",
      password: "hurja_pää"
    }

    const usernameTooShort =   {
      username: "ap",
      name: "Menopeli",
      password: "hurja_pää"
    }

    const passwordTooShort =   {
      username: "apina",
      name: "Menopeli",
      password: "ug"
    }
  
    await api
      .post('/api/users')
      .send(existingUsername)
      .expect(400)
  
    await api
      .post('/api/users')
      .send(usernameTooShort)
      .expect(400)

    await api
      .post('/api/users')
      .send(passwordTooShort)
      .expect(400)
    
    const usersAtEnd = await api.get('/api/users')
    expect(usersAtEnd.body).toHaveLength(users.length)
  }, 100000)

})

afterAll(() => {
  mongoose.connection.close()
})