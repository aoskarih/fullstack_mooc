const jwt = require('jsonwebtoken')
const User = require('../models/user')


const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  }
  next()
}
const userExtractor = async (request, response, next) => {
  let decodedToken = ""
  try {
    decodedToken = jwt.verify(request.token, process.env.SECRET)
  } catch (error) {
    return response.status(401).json({ error: error })
  } 
  request.user = await User.findById(decodedToken.id)
  next()
}

module.exports = {tokenExtractor, userExtractor}