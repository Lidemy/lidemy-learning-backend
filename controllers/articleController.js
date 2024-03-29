const db = require('../models')
const SUCCESS = require('../constants/success')

const User = db.User
const Article = db.Article
const Comment = db.Comment
const Sequelize = db.Sequelize
const Op = Sequelize.Op;

const itemsPerPage = 10

const articleController = {
  getArticles: (req, res) => {
    let offset = 0
    const keyword = req.query.keyword
    if(req.query.page) {
      offset = (req.query.page - 1) * itemsPerPage
    }

    Article.findAndCountAll({
      include: [User, {
        model: Comment,
        attributes: ['id']
      }],
      limit: itemsPerPage,
      attributes: [ 'id', 'nickname','title', 'createdAt', 'updatedAt', 'UserId' ],
      offset: offset,
      where: {
        isDelete: false,
        ...(keyword && {
          [Op.or]: [
            { title: {[Op.substring]: keyword} },
            { content: {[Op.substring]: keyword} }, 
          ]
        })
      },
      order: [['createdAt', 'DESC']]
    }).then(list => {
      res.json(list)
    }).catch(err => {
      console.log(err)
      res.json([])
    })
  },

  getArticle: (req, res) => {
    Article.findByPk(req.params.id, {
      include: [User, {
        model: Comment,
        include: [User]
      }]
    }).then(item => {
      res.json(item)
    }).catch(err => {
      console.log(err)
      res.json([])
    })
  },

  createArticle: (req, res) => {
    if (!req.body.content || !req.body.title) {
      return res.status(500).end()
    }
    Article.create({
      UserId: req.user.id,
      title: req.body.title,
      content: req.body.content
    }).then((item) => {
      res.json({
        id: item.id
      })
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  deleteArticle: (req, res) => {
    Article.findByPk(req.params.id)
      .then(item => {
        if (item.UserId !== req.user.id) {
          throw new Error('invalid user')
        }
        return item.update({
          isDelete: 1
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

  updateArticle: (req, res) => {
    if (!req.body.content && !req.body.title) {
      return res.status(500).end()
    }

    Article.findByPk(req.params.id)
    .then(item => {
      if (item.UserId !== req.user.id) {
        throw new Error('invalid user')
      }
      return item.update({
        content: req.body.content,
        title: req.body.title
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

module.exports = articleController