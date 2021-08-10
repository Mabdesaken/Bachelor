const express = require('express')
const router = express.Router()
const invItem = require('../models/invItem')

let indexPath = 'invItem/index'

//All inventory items route
router.get('/',  (req, res) => {
    res.render('invItem/index')
})

//New inventory Item route
router.get('/new', (req, res) => {
    res.render('invItem/new', { invItem: new invItem() })
})

//Create new inventory item
router.post('/',  (req, res) => {
    res.redirect(`invItem`)
})

module.exports = router