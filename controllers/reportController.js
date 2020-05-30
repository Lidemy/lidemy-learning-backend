const db = require('../models')
const SUCCESS = require('../constants/success')
const webhooks = require('../webhooks')

const User = db.User
const Report = db.Report
const Sequelize = db.Sequelize

const itemsPerPage = 10
const allReportLimit = 30
const Op = Sequelize.Op;

const reportController = {
  getReports: (req, res) => {
    let offset = 0
    if(req.query.page) {
      offset = (req.query.page - 1) * allReportLimit
    }

    let include = [{
      model: User,
      where: {
        [Op.or]:[
          {
            progress: {
              [Op.between]: [req.user.progress - 3, req.user.progress + 1]
            },
            semester: req.user.semester,
          }, 
          {
            [Op.not]: {
              semester: req.user.semester
            }
          }, 
        ]
      }
    }]
    if (req.query.all) {
      include = [User]
    }
    Report.findAll({
      include,
      limit: allReportLimit,
      offset: offset,
      order: [['id', 'DESC']]
    }).then(list => {
      res.json(list)
    }).catch(err => {
      console.log(err)
      res.json([])
    })
  },

  createReport: (req, res) => {
    if (!req.body.content) {
      return res.status(500).end()
    }
    Report.create({
      UserId: req.user.id,
      content: req.body.content,
      wordCount: req.body.content.length
    }).then(() => {
      res.json(SUCCESS.GENERAL)
      webhooks.sendReportToSlack(req)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  deleteReport: (req, res) => {
    Report.findByPk(req.params.id)
      .then(item => {
        if (item.UserId !== req.user.id) {
          throw new Error('invalid user')
        }
        return item.destroy()
      })
      .then(() => {
        res.json(SUCCESS.GENERAL)
      })
      .catch(err => {
        console.log(err)
        res.status(500).end()
      })
  },

  updateReport: (req, res) => {
    if (!req.body.content) {
      return res.status(500).end()
    }

    Report.findByPk(req.params.id)
    .then(item => {
      if (item.UserId !== req.user.id) {
        throw new Error('invalid user')
      }
      return item.update({
        content: req.body.content,
        wordCount: req.body.content.length
      })
    })
    .then(() => {
      res.json(SUCCESS.GENERAL)
    })
    .catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  getUserReports: (req, res) => {
    let offset = 0
    const userId = req.params.id
    if(req.query.page) {
      offset = (req.query.page - 1) * itemsPerPage
    }

    return Report.findAndCountAll({
      include: [User],
      offset: offset,
      limit: itemsPerPage,
      order: [['createdAt', 'DESC']],
      where: {
        UserId: userId
      }
    }).then(result => {
      res.json({
        count: result.count,
        reports: result.rows
      })
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },
}

module.exports = reportController