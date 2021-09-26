const db = require('../models')
const SUCCESS = require('../constants/success')

const User = db.User
const Article = db.Article
const Comment = db.Comment
const Sequelize = db.Sequelize

const commentController = {
  getComments: (req, res) => {
    const itemsPerPage = 5
    let offset = 0
    if(req.query.page) {
      offset = (req.query.page - 1) * itemsPerPage
    }

    Comment.findAll({
      include: [User, Article],
      limit: itemsPerPage,
      offset: offset,
      order: [['createdAt', 'DESC']]
    }).then(list => {
      res.json(list)
    }).catch(err => {
      console.log(err)
      res.json([])
    })
  },

  createComment: (req, res) => {
    if (!req.body.content || !req.body.ArticleId) {
      return res.status(500).end()
    }
    Comment.create({
      UserId: req.user.id,
      content: req.body.content,
      ArticleId: req.body.ArticleId
    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  deleteComment: (req, res) => {
    Comment.findByPk(req.params.id)
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

  updateComment: (req, res) => {
    if (!req.body.content) {
      return res.status(500).end()
    }

    Comment.findByPk(req.params.id)
    .then(item => {
      if (item.UserId !== req.user.id) {
        throw new Error('invalid user')
      }
      return item.update({
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
  }, 
}

module.exports = commentController