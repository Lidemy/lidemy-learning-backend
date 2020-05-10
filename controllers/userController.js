const moment = require('moment-timezone')
const db = require('../models')
const SUCCESS = require('../constants/success')
const User = db.User
const Progression = db.Progression
const Report = db.Report
const Homework = db.Homework
const sequelize = db.sequelize

function formatTime(time) {
  return moment(time).tz('Asia/Taipei').format('YYYY-MM-DD')
}

const userController = {
  me: (req, res) => {
    return res.json(req.user)
  },

  updateUser: (req, res) => {
    const id = req.params.id
    if (Number(id) !== req.user.id || !req.body.nickname || !req.body.slackId) {
      return res.status(401).end()
    }
    User.findByPk(req.user.id).then(user => {
      return user.update({
        nickname: req.body.nickname.slice(0, 20),
        slackId: req.body.slackId
      })
    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      res.json(500).end()
    })
  },

  upProgress: (req, res) => {
    User.findByPk(req.user.id).then(user => {
      const currentProgress = user.progress
      return sequelize.transaction(t => {
        return user.update({
          progress: currentProgress + 1
        }, {transaction: t})
        .then(() => {
          return Progression.create({
            UserId: user.id,
            level: currentProgress
          }) 
        })
      }).then(() => {
        res.json(SUCCESS.GENERAL)
      }).catch(err => {
        console.log(err)
        res.status(500).end()
      })
    })
  },

  downProgress: (req, res) => {
    // can not decrease
    if (req.user.progress <= 1) {
      return res.status(500).end()
    }

    User.findByPk(req.user.id).then(user => {
      const currentProgress = user.progress
      return sequelize.transaction(t => {
        return user.update({
          progress: currentProgress - 1
        }, {transaction: t})
        .then(() => {
          return Progression.findOne({
            where: {
              UserId: user.id,
              level: currentProgress - 1
            }
          })
        }).then(item => {
          return item.destroy()
        })
      }).then(() => {
        res.json(SUCCESS.GENERAL)
      }).catch(err => {
        console.log(err)
        res.status(500).end()
      })
    })
  },

  getTAs: (req, res) => {
    if (!req.user.isAdmin) {
      return res.status(500).end()
    }
    User.findAll({
      attributes: ['id', 'picture', 'nickname', 'slackId', 'status'],
      include: [{
        model: Homework,
        as: 'homeworks'
      }],
      where: {
        isTA: true
      },
    }).then(users => {
      res.json(users);
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  getUserProfile: (req, res) => {
    const userId = req.params.id
    Report.findAll({
      attributes: ['createdAt', 'wordCount'],
      where: {
        UserId: userId
      },
    }).then(reports => {
      const dates = reports.map(report => formatTime(report.createdAt))
      const count = reports.reduce((total, report) => total + report.wordCount, 0)
      Progression.findAll({
        limit: 6,
        order: [['createdAt', 'DESC']],
        where: {
          UserId: userId
        }
      }).then(progressions => {
        res.json({
          dates,
          wordCount: count,
          length: reports.length,
          progressions: progressions.map(item => `${formatTime(item.createdAt)} 成功征服第 ${item.level} 週`)
        })
      })
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  toggleStatus: (req, res) => {
    User.findByPk(req.user.id).then(user => {
      const status = user.status
      const isTa = user.isTA
      if(isTa) {
        user.update({
          status: status === 'active' ? 'inactive' : 'active'
        })
      }
    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  }
}

module.exports = userController