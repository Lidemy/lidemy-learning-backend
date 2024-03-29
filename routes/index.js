const express = require('express')
const router = express.Router();

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const reportController = require('../controllers/reportController')
const homeworkController = require('../controllers/homeworkController')
const unitPermissionsController = require('../controllers/unitPermissionsController')
const noteController = require('../controllers/noteController')
const syllabusController = require('../controllers/syllabusController')
const transactionController = require('../controllers/transactionController')
const articleController = require('../controllers/articleController')
const commentController = require('../controllers/commentController')

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
router.post('/progress/up', userController.upProgress)
router.put('/progress', userController.updateProgress)
router.get('/users/:id/reports', reportController.getUserReports)
router.get('/users/:id', userController.getUserProfile)
router.put('/users/:id', userController.updateUser)
router.get('/ta', userController.getTAs)
router.get('/ta/toggle', userController.toggleStatus)

router.get('/reports', reportController.getReports)
router.post('/reports', reportController.createReport)
router.put('/reports/:id', reportController.updateReport)
router.delete('/reports/:id', reportController.deleteReport)

router.post('/permissions/pass', unitPermissionsController.createPassCode)
router.post('/permissions', unitPermissionsController.createUnitPermission)
router.get('/permissions', unitPermissionsController.getUnitPermission)

router.get('/notes', noteController.getWeekNotes)
router.post('/notes', noteController.createNote)
router.delete('/notes/:id', noteController.deleteNote)

router.get('/news', adminController.getAnnouncements)
router.get('/admin/news', onlyAdmin, adminController.getAnnouncements)
router.post('/admin/news', onlyAdmin, adminController.createAnnouncement)
router.get('/admin/news/:id', onlyAdmin, adminController.getAnnouncement)
router.put('/admin/news/:id', onlyAdmin, adminController.updateAnnouncement)
router.delete('/admin/news/:id', onlyAdmin, adminController.deleteAnnouncement)
router.get('/admin/users/drop', onlyAdmin, adminController.getDropUsers)

router.post('/invite', onlyAdmin, adminController.createInvite)

router.get('/homeworks', homeworkController.getHomeworks)
router.get('/homeworks/achieve/data', homeworkController.getHomeworksAchieveData)
router.get('/homeworks/:id/like', adminAndTA, homeworkController.likeHomework)
router.get('/homeworks/:id/achieve', adminAndTA, homeworkController.achieveHomework)
router.post('/homeworks', homeworkController.createHomework)

router.post('/news', adminController.getAnnouncements)

router.get('/syllabus', syllabusController.getSyllabus)
router.put('/syllabus', syllabusController.updateSyllabus)
router.delete('/syllabus', syllabusController.deleteSyllabus)

router.post('/transactions/selectPlan', transactionController.selectPlan)
router.post('/transactions/:id/paid', transactionController.paidTransaction)
router.get('/transactions', transactionController.getTransactions)
router.post('/transactions', transactionController.createTransaction)
router.delete('/transactions/:id', transactionController.deleteTransaction)
router.put('/transactions/:id', onlyAdmin, transactionController.updateTransaction)
router.get('/admin/transactions', onlyAdmin, transactionController.getAdminTransactions)

router.get('/articles', articleController.getArticles)
router.get('/articles/:id', articleController.getArticle)
router.post('/articles', articleController.createArticle)
router.put('/articles/:id', articleController.updateArticle)
router.delete('/articles/:id', articleController.deleteArticle)

router.post('/comments', commentController.createComment)
router.get('/comments', commentController.getComments)
router.put('/comments/:id', commentController.updateComment)
router.delete('/comments/:id', commentController.deleteComment)

module.exports = router