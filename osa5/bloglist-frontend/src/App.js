import axios from 'axios'
import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'

const LoginForm = ({ username, password, setUsername, setPassword, setUser, setErrorMessage }) => {
  
  const login = async credentials => {
    const response = await axios.post('/api/login', credentials)
    return response.data
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await login({
        username, password,
      })
      setUser(user)
      blogService.setToken(user.token)
      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      ) 
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      console.log(exception, "wrong credentials");
    }
  }

  return (
    <>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
        </div>
        <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  )      
}

const CreateBlogForm = ({ blogs, setBlogs, setErrorMessage }) => {
  
  const [title, setTitle] = useState('') 
  const [author, setAuthor] = useState('') 
  const [url, setUrl] = useState('') 

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      
      const newBlog = {
        title: title,
        author: author,
        url: url,
      }

      const res = await blogService.create(newBlog)
      setBlogs(blogs.concat(res))
      setErrorMessage("added "+res.title)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)

      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
      console.log(exception);
    }
  }

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={addBlog}>
        <div>
            title
            <input
              type="text"
              value={title}
              name="title"
              onChange={({ target }) => setTitle(target.value)}
            />
        </div>
        <div>
            author
            <input
              type="text"
              value={author}
              name="author"
              onChange={({ target }) => setAuthor(target.value)}
            />
        </div>
        <div>
            url
            <input
              type="text"
              value={url}
              name="url"
              onChange={({ target }) => setUrl(target.value)}
            />
        </div>
        <button type="submit">create</button>
      </form>
    </>
  )      
}


const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  
  const notificationStyle = {
    fontWeight: 'bold',
    fontSize: 25,
    borderStyle: 'solid',
    borderRadius: 3,
    padding: 10
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  const logout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    console.log("Logged out");
  }

  const loginOrContent = () => {
    if (user === null) {
      return (
        <>
        <LoginForm 
          username={username} 
          password={password} 
          setUsername={setUsername} 
          setPassword={setPassword}
          setUser={setUser}
          setErrorMessage={setErrorMessage}
        />
        </>
      )
    }

    return (
      <>
      <h2>blogs</h2>
      {user.username} logged in <button onClick={logout}>logout</button> 
      <br /><br />
      
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <CreateBlogForm 
        blogs={blogs} 
        setBlogs={setBlogs} 
        setErrorMessage={setErrorMessage}/>
      </>
    )

  } 

  return (
    <div>
      <Notification message={errorMessage}/>
      {loginOrContent()}
    </div>
  )
}

export default App
