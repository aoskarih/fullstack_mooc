
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((acc, val) => acc+val.likes, 0)
}

const favouriteBlog = (blogs) => {
  if (blogs.length > 0) {
    return blogs.reduce((fav, val) => fav.likes < val.likes ? val : fav)
  }
  return null
}

const mostBlogs = (blogs) => {
  if (blogs.length===0) {
    return null
  }
  let m = new Map()
  blogs.forEach(e => {
    const val = m.get(e.author)
    if (val) {
      m.set(e.author, val+1)
    } else {
      m.set(e.author, 1)
    }
  });
  let res = ["", 0]
  m.forEach((val,key) => {
    if (res[1] < val) {
      res = [key, val]
    }
  })
  return {author:res[0], blogs:res[1]}
}

const mostLikes = (blogs) => {
  if (blogs.length===0) {
    return null
  }
  let m = new Map()
  blogs.forEach(e => {
    const val = m.get(e.author)
    if (val) {
      m.set(e.author, val+e.likes)
    } else {
      m.set(e.author, e.likes)
    }
  });
  let res = ["", 0]
  m.forEach((val,key) => {
    if (res[1] < val) {
      res = [key, val]
    }
  })
  return {author:res[0], likes:res[1]}
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}