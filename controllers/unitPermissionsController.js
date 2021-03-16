const db = require('../models')
const SUCCESS = require('../constants/success')

const UnitPermissions = db['Unit_Permissions']

const unitPermissionsController = {
  createUnitPermission: (req, res) => {
    if (!req.body.week) {
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
        }
      })
      .then(() => {
        res.json(SUCCESS.GENERAL)
      }).catch(err => {
        console.log(err)
        res.status(500).end()
      })
  },
}

module.exports = unitPermissionsController