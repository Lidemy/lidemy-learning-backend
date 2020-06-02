const get = require('lodash/get')
const jwt = require('jsonwebtoken')

const models = require('../models')
const User = models.User

const admin = require('../utils/firebase')
const ERROR = require('../constants/error')

const REGISTER_CODE = process.env.REGISTER_CODE || 'TEST'

function checkAuth(req, res, next) {
  if (!req.token) {
    return res.status(401).json(ERROR.UNAUTHORIZED)
  }

  admin.auth().verifyIdToken(req.token)
      .then(function(decodedToken) {
        // use email to find user
        User.findOne({where: { email: decodedToken.email }}).then(user => {
          if (!user) {
            throw new Error('no user')
          }
          req.user = user
          next()
        }).catch(err => {
          res.status(403).json(ERROR.INVALID_USER)
        })        
      }).catch(function(err) {
        res.status(401).json(ERROR.UNAUTHORIZED)
      });
}

function register(req, res, next) {
  try {
    const payload = jwt.verify(req.query.token, process.env.SIGNATURE);
    admin.auth().verifyIdToken(req.token)
      .then(function(decodedToken) {
        User.create({
          nickname: decodedToken.name || decodedToken.email.split('@')[0],
          email: decodedToken.email,
          picture: decodedToken.picture,
          githubId: get(decodedToken, 'firebase.identities["github.com"][0]'),
          priceType: payload.priceType,
          semester: Number(payload.semester),
          status: 'active',
          ...(payload.role === 'student' && { isStudent: true }),
          ...(payload.role === 'ta' && { isTA: true })
        }).then(user => {
          res.json({
            ok: true
          })
        }).catch(err => {
          res.status(401).json(ERROR.REPEAT_USER)
        })        
      }).catch(function(err) {
        res.status(401).json(ERROR.UNAUTHORIZED)
      })
  } catch(err) {
    res.status(401).json(ERROR.EXPIRE_INVITE)
  }
}

module.exports = {
  checkAuth,
  register
}
