const db = require('../models')
const SUCCESS = require('../constants/success')

const Syllabus = db.Syllabus

const syllabusController = {
    getSyllabus: (req, res) => {
        if(!req.query.week) {
            return res.status(500).end()
        }
        Syllabus.findAll({
            where: {
                week: req.query.week
            }
        }).then(list => {
            res.json(list)
        }).catch(err => {
            console.log(err)
            res.json([])
        })
    },
    deleteSyllabus: (req, res) => {
        if (!req.query.week || !req.query.category) {
            return res.status(500).end()
        }

        Syllabus.findOne({
            where: {
                week: req.query.week,
                category: req.query.category
            }
        }).then(item => {
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
    updateSyllabus: (req, res) => {
        if (!req.query.week) {
            return res.status(500).end()
        }
    
        Syllabus.findOne({
            where: {
                week: req.query.week,
                category: req.query.category
            }
        }).then(syllabus => {
            if(!syllabus) {
                Syllabus.create({
                    week: req.query.week,
                    category: req.query.category,
                    title: req.body.title,
                    content: req.body.content,
                    visible: req.body.visible
                })
            } else {
                syllabus.update({
                    title: req.body.title,
                    content: req.body.content,
                    visible: req.body.visible
                })
            }
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

module.exports = syllabusController