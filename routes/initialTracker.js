const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('initialTracker/index')
})

router.get('/new', (req, res) => {
    res.render('initialTracker/new')
})

router.post('/', (req, res) => {
    res.redirect(`initialTracker`)
})

module.exports = router