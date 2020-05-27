const db = require('../models')
const SUCCESS = require('../constants/success')
const User = db.User
const Announcement = db.Announcement

const adminController = {
  getAnnouncements: (req, res) => {
    Announcement.findAll({
      include: [User],
      limit: 5,
      order: [['createdAt', 'DESC']]
    }).then(list => {
      res.json(list)
    }).catch(err => {
      console.log(err)
      res.json([])
    })
  },

  getAnnouncement: (req, res) => {
    Announcement.findByPk(req.params.id)
    .then(item => {
      res.json(item)
    }).catch(err => {
      console.log(err)
      res.json({})
    })
  },

  createAnnouncement: (req, res) => {
    Announcement.create({
      UserId: req.user.id,
      title: req.body.title,
      content: req.body.content
    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  deleteAnnouncement: (req, res) => {
    Announcement.findByPk(req.params.id)
    .then(item => {
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

  updateAnnouncement: (req, res) => {
    Announcement.findByPk(req.params.id)
    .then(item => {
      return item.update({
        title: req.body.title,
        content: req.body.content
      })
    })
    .then(() => {
      res.json(SUCCESS.GENERAL)
    })
    .catch(err => {
      console.log(err)
      res.status(500).end()
    })
  }
}

module.exports = adminController