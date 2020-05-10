const db = require('../models')
const SUCCESS = require('../constants/success')

const User = db.User
const Homework = db.Homework
const sequelize = db.sequelize

const homeworkController = {
  getHomeworks: (req, res) => {
    const where = {
      UserId: req.params.id
    } 
    Homework.findAll({
      include: ['user', 'ta'],
      attributes: ['id', 'prUrl', 'week', 'isAchieve', 'isLike', 'TAId', 'createdAt'],
      ...(Number(req.params.id) && { where })
    }).then(homeworks => {
      res.json(homeworks)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },
  getTAHomeworks: (req, res) => {
    const where = {
      TAId: req.query.TAId
    } 
    Homework.findAll({
      include: ['user', 'ta'],
      attributes: ['id', 'prUrl', 'week', 'isAchieve', 'isLike', 'TAId', 'createdAt'],
      ...(Number(req.query.TAId) && { where })
    }).then(homeworks => {
      res.json(homeworks)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  likeHomework: (req, res) => {
    if (!req.user.isTA) {
      return res.status(500).end()
    }

    Homework.findByPk(req.params.id).then(homework => {
      const isLike = homework.isLike
      homework.update({
        isLike: !isLike
      })
    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  achieveHomework: (req, res) => {
    if (!req.user.isTA) {
      return res.status(500).end()
    }

    Homework.findByPk(req.params.id).then(homework => {
      const isAchieve = homework.isAchieve
      homework.update({
        isAchieve: !isAchieve
      })
    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  createHomework: (req, res) => {
    if (!req.body.prUrl || !req.body.week) {
      return res.status(500).end()
    }

    User.findAll({
      attributes: ['id'],
      where: {
        isTA: true,
        status: 'active',
      }
    }).then(activeTAList => {
      Homework.findAll({
        group: ['TAId'],
        attributes: ['TAId', [sequelize.fn('COUNT', 'id'), 'homeworkCount']],
        where: {
          TAId: activeTAList.map(ta => ta.id)
        },
        distinct: true,
        order: [[sequelize.literal('homeworkCount'), 'ASC']],
      }).then(hasHomeworkTA => {
        let TA = null;
        // if there are TAs haven't had any homework yet
        if(activeTAList.length > hasHomeworkTA.length) {
          let difference = activeTAList
            .map(ta => ta.id)
            .filter(ta => !hasHomeworkTA.map(item => item.TAId).includes(ta));
          TA = difference[0];
        } else {
          TA = hasHomeworkTA[0].TAId;
        }
   
        Homework.create({
          UserId: req.user.id,
          isAchieve: false,
          isLike: false,
          week: req.body.week,
          prUrl: req.body.prUrl,
          TAId: TA
        }).then(() => {
          res.json(SUCCESS.GENERAL)
        }).catch(err => {
          console.log(err)
          res.status(500).end()
        })

      })
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },
}

module.exports = homeworkController