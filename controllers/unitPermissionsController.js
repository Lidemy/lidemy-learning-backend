const db = require('../models')
const SUCCESS = require('../constants/success')
const ERROR = require('../constants/error')
const jwt = require('jsonwebtoken')

const UnitPermissions = db['Unit_Permissions']
const User = db.User

const unitPermissionsController = {
  getUnitPermission: (req, res) => {
    if (!req.query.userId) {
      return res.status(500).end()
    }
    UnitPermissions.findAll({
      where: {
        UserId: req.query.userId
      }
    }).then(list => {
      res.json(list)
    }).catch(err => {
      res.json([])
    })
  },
  createPassCode: (req, res) => {
    if(!req.body.nickname || !req.body.week){
      return res.status(500).end()
    }
    User.findOne({
      where: {
        nickname: req.body.nickname
      }
    }).then(user => {
      const token = jwt.sign({ 
        userId:  user.id,
        week:  req.body.week,
        exp: Math.floor(Date.now() / 1000) + (3600 * 24),
      }, process.env.UNIT_SIGNATURE)
      return res.json({ token })
    })
  },
  createUnitPermission: (req, res) => {   
    if(req.query.token) {
      try {
        const decodedToken = jwt.verify(req.query.token, process.env.UNIT_SIGNATURE);
        if(decodedToken.userId === req.user.id && 
          Number(decodedToken.week) === req.body.week
        ) {
          UnitPermissions
            .findOne({ where: {
              UserId: req.user.id,
              week: decodedToken.week,
              }
            }).then((permission) => { 
              if(!permission) {
                UnitPermissions.create({
                  UserId: req.user.id,
                  week: decodedToken.week,
                  status: 2
                })
              }
            })
            .then(() => {
              res.json(SUCCESS.GENERAL)
            }).catch(err => {
              console.log(err)
              res.status(500).end()
            }) 
        } else {
          res.status(401).json(ERROR.INVALID_TOKEN)
        }
      } catch(err) {
        console.log('err', err)
        res.status(401).json(ERROR.INVALID_TOKEN)
      }
    } else {
      if (!req.body.week && req.query.token) {
        return res.status(500).end()
      }
      UnitPermissions
        .findOne({ where: {
          UserId: req.user.id,
          week: req.body.week,
          }
        }).then((permission) => { 
          if(!permission) {
            UnitPermissions.create({
              UserId: req.user.id,
              week: req.body.week,
              status: 1
            })
          } else {
            return permission.update({
              status: 1
            })
          }
        })
        .then(() => {
          res.json(SUCCESS.GENERAL)
        }).catch(err => {
          console.log(err)
          res.status(500).end()
        }) 
    }
  },
}

module.exports = unitPermissionsController