const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const reportController = require('../controllers/reportController')
const homeworkController = require('../controllers/homeworkController')

const checkPermission = (roles = []) => (req, res, next) => {
  if (roles.indexOf('admin') >= 0 && req.user.isAdmin) {
    return next()
  }

  if (roles.indexOf('TA') >= 0 && req.user.isTA) {
    return next()
  }

  res.status(401)
}

const onlyAdmin = checkPermission(['admin'])
const adminAndTA = checkPermission(['admin', 'TA'])

router.get('/', (req, res) => res.end('hello'))
router.get('/users/me', userController.me)
router.post('/progress/up', userController.upProgress)
router.post('/progress/down', userController.downProgress)
router.get('/users/:id/reports', reportController.getUserReports)
router.get('/users/:id', userController.getUserProfile)
router.put('/users/:id', userController.updateUser)
router.get('/ta', userController.getTAs)
router.get('/ta/toggle', userController.toggleStatus)

router.get('/reports', reportController.getReports)
router.post('/reports', reportController.createReport)
router.put('/reports/:id', reportController.updateReport)
router.delete('/reports/:id', reportController.deleteReport)

router.get('/news', adminController.getAnnouncements)
router.get('/admin/news', onlyAdmin, adminController.getAnnouncements)
router.post('/admin/news', onlyAdmin, adminController.createAnnouncement)
router.get('/admin/news/:id', onlyAdmin, adminController.getAnnouncement)
router.put('/admin/news/:id', onlyAdmin, adminController.updateAnnouncement)
router.delete('/admin/news/:id', onlyAdmin, adminController.deleteAnnouncement)

router.post('/invite', onlyAdmin, adminController.createInvite)

router.get('/homeworks', homeworkController.getHomeworks)
router.get('/homeworks/achieve/data', homeworkController.getHomeworksAchieveData)
router.get('/homeworks/:id/like', adminAndTA, homeworkController.likeHomework)
router.get('/homeworks/:id/achieve', adminAndTA, homeworkController.achieveHomework)
router.post('/homeworks', homeworkController.createHomework)

router.post('/news', adminController.getAnnouncements)
module.exports = router