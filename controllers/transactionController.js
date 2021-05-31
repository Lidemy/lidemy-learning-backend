const moment = require('moment')
const db = require('../models')
const SUCCESS = require('../constants/success')
const User = db.User
const Transaction = db.Transaction
const sequelize = db.sequelize

const PLAN_A_AMOUNT = 5000
const PLAN_B_AMOUNT = 17500
const transactionLimit = 20

const transactionController = {
  selectPlan: (req, res) => {
    if (req.user.isPlanSelected) {
      return res.status(500).end()
    }

    const plan = req.user.disablePlanSelect ? 'B' : req.body.plan
    if (!['A', 'B'].includes(plan)) {
      return res.status(500).end()
    }

    // update user first
    User.findByPk(req.user.id).then(user => {
      user.update({
        isPlanSelected: true,
        priceType: plan
      })
    }).then(() => {
      // create transaction
      const params = {
        UserId: req.user.id,
        isCreateByAdmin: true,
        status: 'pending',
        isDelete: false
      }

      const firstParams = {
        expireTime: '2021-06-12T00:00:00Z',
      }

      if (plan === 'A') {
        return Transaction.create({
          ...params,
          ...firstParams,
          name: '保證金',
          amount: PLAN_A_AMOUNT,          
        })
      }

      // planB
      return Transaction.bulkCreate([
        {
          ...params,
          ...firstParams,
          name: '保證金加學費第一期',
          amount: PLAN_B_AMOUNT, 
        }, {
          ...params,
          name: '學費第二期',
          expireTime: '2021-07-12T00:00:00Z',
          amount: 12500
        }, {
          ...params,
          name: '學費第三期',
          expireTime: '2021-08-12T00:00:00Z',
          amount: 12500
        }, {
          ...params,
          name: '學費第四期',
          expireTime: '2021-09-12T00:00:00Z',
          amount: 12500
        },
      ])
    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  paidTransaction: (req, res) => {
    const { id } = req.params
    const { bankCode, payTime } = req.body

    Transaction.findByPk(id).then(transaction => {
      if (transaction.UserId !== req.user.id) {
        return res.status(500).end()
      }

      if (transaction.status !== 'pending') {
        return res.status(500).end()
      }

      return transaction.update({
        bankCode,
        paidTime: payTime,
        status: 'confirming'
      })

    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      return res.status(500).end()
    })
  },

  getTransactions: (req, res) => {
    Transaction.findAll({
      include: [User],
      where: {
        UserId: req.user.id,
        isDelete: false
      },
      order: [['createdAt', 'DESC']]
    }).then(list => {
      res.json(list)
    }).catch(err => {
      console.log(err)
      res.json([])
    })
  },

  createTransaction: (req, res) => {
    const { name, expireTime, amount, UserId } = req.body
    if (!name || !expireTime || !amount) {
      return res.status(500).end()
    }

    const params = {
      name,
      expireTime,
      amount,
      UserId: req.user.id,
      status: 'pending'
    }

    if (req.user.isAdmin && UserId) {
      params.isCreateByAdmin = true
      params.UserId = UserId
    }

    Transaction.create(params).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  deleteTransaction: (req, res) => {
    const { id } = req.params
    Transaction.findByPk(id).then(transaction => {
      if (transaction.UserId !== req.user.id && !req.user.isAdmin) {
        return res.status(500).end()
      }

      if (transaction.status === 'paid') {
        return res.status(500).end()
      }

      return transaction.update({
        isDelete: true
      })
    }).then(() => {
      res.json(SUCCESS.GENERAL)
    }).catch(err => {
      console.log(err)
      return res.status(500).end()
    })
  },

  updateTransaction: (req, res) => {
    if (!req.params.id) {
      return res.status(500).end()
    }

    const params = {}

    if (req.body.name) params.name = req.body.name
    if (req.body.amount) params.amount = req.body.amount
    if (req.body.status) params.status = req.body.status

    Transaction.findByPk(req.params.id)
    .then(item => {
      return item.update(params)
    })
    .then(() => {
      res.json(SUCCESS.GENERAL)
    })
    .catch(err => {
      console.log(err)
      res.status(500).end()
    })
  },

  getAdminTransactions: (req, res) => {
    let offset = 0
    if(req.query.page) {
      offset = (req.query.page - 1) * transactionLimit
    }

    Transaction.findAndCountAll({
      include: [User],
      limit: transactionLimit,
      offset: offset,
      order: [['updatedAt', 'DESC']]
    }).then(result => {
      res.json({
        count: result.count,
        transactions: result.rows
      })
    }).catch(err => {
      console.log(err)
      res.json([])
    })
  },

}

module.exports = transactionController