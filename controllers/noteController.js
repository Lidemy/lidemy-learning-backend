const db = require('../models')
const SUCCESS = require('../constants/success')

const Notes = db.Notes
const Sequelize = db.Sequelize

const noteController = {
  getWeekNotes: (req, res) => {
    if (!req.query.week) {
        return res.status(500).end()
    } 
    Notes.findAll({
        week: req.query.week
    }).then(list => {
        res.json(list)
    }).catch(err => {
    console.log(err)
        res.json([])
    })
  },

  createNote: (req, res) => {
    if (!req.body.title || !req.body.link) {
      return res.status(500).end()
    }
    Notes.create({
      UserId: req.user.id,
      title: req.body.title,
      link: req.body.link,
      week: req.body.week,
    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  deleteNote: (req, res) => {
    Notes.findByPk(req.params.id)
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
}

module.exports = noteController