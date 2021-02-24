const jwt = require('jsonwebtoken')

function getTokenFromHeaders(req) {
  const token = req.body.token || req.query.token || req.headers['master-token']

  return token
}

function validateToken(req, res, next) {
  const token = getTokenFromHeaders(req)

  if (token) {
    jwt.verify(token, 'prettydumbsecret', (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token'
        })
      } else {
        req.decoded = decoded
        next()
      }
    })
  } else {
    return res.status(403).send({
      success: false,
      message: 'No token provided'
    })
  }
}

module.exports = validateToken
