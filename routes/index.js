const express = require('express')
const router = express.Router()
const items = require('../models/invItem')
const initiative = require('../models/initiativeTracker')

router.get('/', async (req, res) =>{
    let initiatives
    try {
        initiatives = await initiative.find().sort({name: 'asc'}).exec()
    } catch {
        initiatives = []
    }

    res.render('index', {
        initiativeTracker: initiatives
    })
})

module.exports = router