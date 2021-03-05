const db = require('../models')
const SUCCESS = require('../constants/success')

const User = db.User
const Homework = db.Homework
const sequelize = db.sequelize
const homeworksLimit = 10

const homeworkController = {
  getHomeworks: (req, res) => {
    let offset = 0
    if(req.query.page || 1) {
      offset = (req.query.page - 1) * homeworksLimit
    }
    const sort = req.query.sort || 'id'
    const order = req.query.order || 'ASC'
    Homework.findAndCountAll({
      include: [{
        association: 'user',
        ...(req.query.student  && { where: { nickname: JSON.parse(req.query.student) } }),
      }, {
        association: 'ta',
        ...(req.query.ta  && { where: { nickname: JSON.parse(req.query.ta) } }),
      }],
      attributes: ['id', 'prUrl', 'week', 'isAchieve', 'isLike', 'TAId', 'createdAt'],
      limit: homeworksLimit, 
      offset: offset,
      order: [[sort, order]],
      where: {
        ...(req.query.like && { isLike: JSON.parse(req.query.like) }),
        ...(req.query.achieve && { isAchieve: JSON.parse(req.query.achieve) }),
        ...(req.query.TAId && { TAId: JSON.parse(req.query.TAId) }),
        ...(req.query.UserId && { UserId: JSON.parse(req.query.UserId) }),
        ...(req.query.week && { week: JSON.parse(req.query.week) })
      }
    }).then(homeworks => {
      res.json(homeworks)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  getHomeworksAchieveData: (req, res) => {
    Homework.findAll({
      attributes: ['week', 'isAchieve', [sequelize.fn('COUNT', 'id'), 'homeworkCount']],
      group: ['week', 'isAchieve']
    }).then(homeworks => {
      res.json(homeworks)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  likeHomework: (req, res) => {
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
      attributes: ['id', 'weight'],
      where: {
        isTA: true,
        status: 'active',
      }
    }).then(activeTAList => {
      if (activeTAList.length === 0) {
        return res.status(500).end()
      }
      Homework.findAll({
        group: ['TAId'],
        attributes: ['TAId', [sequelize.fn('COUNT', 'id'), 'homeworkCount']],
        where: {
          TAId: activeTAList.map(ta => ta.id),
        },
        distinct: true,
        order: [[sequelize.literal('homeworkCount'), 'ASC']],
      }).then(hasHomeworkTA => {
        let TA = null;
        hasHomeworkTA.forEach(ta => console.log(ta))
        /**
         * p1: 先給完全沒有改過作業的助教
         * p2: 如果只有一個助教可以改作業先給他
         * p3: 改作業數最少的助教會有 0.7 * 自身權重(0 ~ 1) 的機率收到作業
         * p4: 隨機分配
         */
        if(activeTAList.length > hasHomeworkTA.length) {
          let difference = activeTAList
            .map(ta => ta.id)
            .filter(ta => !hasHomeworkTA.map(item => item.TAId).includes(ta));
          TA = difference[0];
        } else {
          let taInfo = activeTAList.find(ta => ta.id === hasHomeworkTA[0].TAId);
          if (hasHomeworkTA.length === 1) {
            TA = taInfo.id;
          } else {
            let num = 0;
            while(TA === null) {
              const isLowestWeight = num === 0 ? 0.7 : 0.3;
              if (Math.random() <= taInfo.weight * isLowestWeight) {
                TA = taInfo.id;
              }
              if(num === hasHomeworkTA.length - 1) {
                TA = hasHomeworkTA[Math.floor(Math.random() * (hasHomeworkTA.length - 1))].TAId
              }
              num += 1;
              taInfo = activeTAList.find(ta => ta.id === hasHomeworkTA[num].TAId);
            }
          }
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

      }).catch(err => {
        console.log(err)
        res.status(500).end()
      })
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },
}

module.exports = homeworkController